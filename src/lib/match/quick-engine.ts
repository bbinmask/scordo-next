// Pure cricket scoring functions.
//
// This module has NO Prisma imports, NO server-action imports, NO React imports.
// It contains only the cricket LOGIC so it can be called from:
//   • The authenticated pushBallHandler (server action)
//   • The Quick Match scoring reducer (client-side)
//   • Any future scoring surface (mobile app, websocket handler, etc.)
//
// Every function is a pure transform: (state, input) → newState.
// No side effects. No DB reads. No async.

import type {
  QuickBall,
  QuickInning,
  QuickInningBatting,
  QuickInningBowling,
  QuickMatch,
  QuickMatchStatus,
  QuickBallInput,
} from "@/types/quick-match.props";
import { nanoid } from "nanoid";

// ─── Run accounting ────────────────────────────────────────────────────────
//
// All three run-accounting functions mirror the verified logic in pushBallHandler.

/** Total runs added to the innings score (includes wide/no-ball penalty). */
export function computeTeamRuns(runs: number, isWide: boolean, isNoBall: boolean): number {
  return runs + (isWide ? 1 : 0) + (isNoBall ? 1 : 0);
}

/** Runs credited to the batsman's personal tally (byes/leg-byes are extras). */
export function computeBatsmanRuns(runs: number, isBye: boolean, isLegBye: boolean): number {
  return isBye || isLegBye ? 0 : runs;
}

/**
 * Runs charged to the bowler.
 * Law 25 / Law 21: byes and leg-byes are NOT the bowler's fault — only the
 * penalty run (1) counts against the bowler on wides/no-balls.
 */
export function computeBowlerRuns(
  runs: number,
  isWide: boolean,
  isNoBall: boolean,
  isBye: boolean,
  isLegBye: boolean
): number {
  if (isWide) return isBye || isLegBye ? 1 : runs + 1;
  if (isNoBall) return isBye || isLegBye ? 1 : runs + 1;
  return isBye || isLegBye ? 0 : runs;
}

// ─── Ball-counter helpers ──────────────────────────────────────────────────

export function isLegalDelivery(isWide: boolean, isNoBall: boolean): boolean {
  return !isWide && !isNoBall;
}

/** Next legal-ball counter (advances only on legal deliveries). */
export function nextBallCount(current: number, legal: boolean): number {
  return legal ? current + 1 : current;
}

/** Next completed-overs counter (increments every 6 legal balls). */
export function nextOverCount(currentOvers: number, nextBalls: number, legal: boolean): number {
  if (!legal) return currentOvers;
  return nextBalls % 6 === 0 ? currentOvers + 1 : currentOvers;
}

// ─── Strike rotation ───────────────────────────────────────────────────────
//
// Cricket rule: odd runs = batsmen crossed = swap. End of over = swap.
// Both on the same ball = double swap = back to original (correct outcome).

export function computeNextStrike(
  strikerId: string | null,
  nonStrikerId: string | null,
  runs: number,
  isEndOfOver: boolean,
  isWicket: boolean,
  outBatsmanId: string | undefined,
  nextBatsmanId: string | undefined,
  isLastWicket: boolean
): { striker: string | null; nonStriker: string | null } {
  let striker = strikerId;
  let nonStriker = nonStrikerId;

  // Odd run(s) → batsmen crossed
  if (runs % 2 === 1) [striker, nonStriker] = [nonStriker, striker];

  // End of over → bowling switches ends
  if (isEndOfOver) [striker, nonStriker] = [nonStriker, striker];

  // Wicket: replace dismissed batsman
  if (isWicket && !isLastWicket && nextBatsmanId) {
    if (outBatsmanId === striker) {
      striker = nextBatsmanId;
    } else if (outBatsmanId === nonStriker) {
      nonStriker = nextBatsmanId;
    }
  }

  return { striker, nonStriker };
}

// ─── Over-completion guard ─────────────────────────────────────────────────
//
// Checks whether the scorer needs to select a new bowler before the next ball.

export function needsBowlerChange(
  ballsHistory: QuickBall[],
  currentBowlerId: string | null
): boolean {
  const legalBalls = ballsHistory.filter((b) => !b.isWide && !b.isNoBall);
  if (legalBalls.length === 0) return false;

  const lastLegal = legalBalls[legalBalls.length - 1];
  return lastLegal.ball % 6 === 0 && lastLegal.ball !== 0 && lastLegal.bowlerId === currentBowlerId;
}

// ─── Over-limit guard ──────────────────────────────────────────────────────

export function bowlerOversBowled(ballsHistory: QuickBall[], bowlerId: string): number {
  const legalByBowler = ballsHistory.filter(
    (b) => b.bowlerId === bowlerId && !b.isWide && !b.isNoBall
  ).length;
  return Math.floor(legalByBowler / 6);
}

// ─── Current over (last 6 legal balls) ────────────────────────────────────

export function getCurrentOverBalls(balls: QuickBall[]): QuickBall[] {
  const legal = balls.filter((b) => !b.isWide && !b.isNoBall);
  if (legal.length === 0) return [];

  const lastLegal = legal[legal.length - 1];
  const overNumber = Math.floor((lastLegal.ball - 1) / 6);

  // Return all balls (including extras) from this over
  return balls.filter((b) => {
    if (!b.isWide && !b.isNoBall) {
      return Math.floor((b.ball - 1) / 6) === overNumber;
    }
    // Wides and no-balls belong to the over of the last legal ball before them
    return true; // approximation — include all extras in current over display
  });
}

// ─── End-of-innings detection ──────────────────────────────────────────────

export function isInngsComplete(
  isLastWicket: boolean,
  nextOver: number,
  totalOvers: number
): boolean {
  return isLastWicket || nextOver === totalOvers;
}

// ─── Win / result calculation ─────────────────────────────────────────────

export function computeResult(
  currentScore: number,
  firstInningRuns: number,
  battingTeamName: string,
  bowlingTeamName: string,
  battingTeamId: string,
  bowlingTeamId: string,
  totalWickets: number,
  playerLimit: number,
  isWicket: boolean,
  category: string
): {
  result: string;
  winnerId: string | undefined;
  status: QuickMatchStatus;
} {
  const chased = currentScore > firstInningRuns;
  const tied = currentScore === firstInningRuns;

  if (chased) {
    const wicketsRemaining = playerLimit - 1 - totalWickets - (isWicket ? 1 : 0);
    return {
      result: `${battingTeamName} won by ${wicketsRemaining} wickets`,
      winnerId: battingTeamId,
      status: "completed",
    };
  }

  if (tied) {
    return {
      result: category === "Test" ? "Match Drawn" : "Match Tied",
      winnerId: undefined,
      status: "completed",
    };
  }

  // Batting side fell short
  const margin = firstInningRuns - currentScore;
  return {
    result: `${bowlingTeamName} won by ${margin} runs`,
    winnerId: bowlingTeamId,
    status: "completed",
  };
}

// ─── Apply a ball to a QuickInning ────────────────────────────────────────
//
// This is the main engine entry-point.
// Returns { updatedInning, matchStatusChange } — no mutations.

export type BallResult = {
  updatedInning: QuickInning;
  inngsComplete: boolean; // first inning ended?
  matchComplete: boolean; // full match ended?
  result?: string;
  winnerId?: string;
  error?: string;
};

export function applyBall(
  inning: QuickInning,
  input: QuickBallInput,
  match: QuickMatch
): BallResult {
  const {
    runs,
    batsmanId,
    isWide = false,
    isNoBall = false,
    isBye = false,
    isLegBye = false,
    isWicket = false,
    dismissalType,
    fielderId,
    nextBatsmanId,
    outBatsmanId,
    isLastWicket = false,
    shotSide,
    shotType,
  } = input;

  // Guard: bowler change required?
  if (needsBowlerChange(inning.balls_history, inning.currentBowlerId)) {
    return {
      updatedInning: inning,
      inngsComplete: false,
      matchComplete: false,
      error: "Bowler change is required before bowling next ball!",
    };
  }

  const legal = isLegalDelivery(isWide, isNoBall);
  const teamRuns = computeTeamRuns(runs, isWide, isNoBall);
  const batRuns = computeBatsmanRuns(runs, isBye, isLegBye);
  const bowlerRns = computeBowlerRuns(runs, isWide, isNoBall, isBye, isLegBye);

  const nextBalls = nextBallCount(inning.balls, legal);
  const nextOvers = nextOverCount(inning.overs, nextBalls, legal);
  const isEndOver = legal && nextBalls % 6 === 0;

  const { striker, nonStriker } = computeNextStrike(
    inning.currentStrikerId,
    inning.currentNonStrikerId,
    runs,
    isEndOver,
    isWicket,
    outBatsmanId,
    nextBatsmanId,
    isLastWicket
  );

  // Create ball record
  const newBall: QuickBall = {
    id: nanoid(),
    ball: nextBalls,
    over: nextOvers,
    runs,
    isWide,
    isNoBall,
    isBye,
    isLegBye,
    isWicket,
    dismissalType,
    batsmanId,
    bowlerId: inning.currentBowlerId as string,
    fielderId: fielderId?.trim() ? fielderId : undefined,
    shotSide,
    shotType,
    createdAt: new Date().toISOString(),
  };

  // Update batting stats
  const updatedBatting = inning.batting.map((bat): QuickInningBatting => {
    if (bat.playerId !== batsmanId) return bat;
    return {
      ...bat,
      balls: legal ? bat.balls + 1 : bat.balls,
      runs: bat.runs + batRuns,
      isOut: bat.isOut || isWicket,
      dots: legal && !isBye && !isLegBye && runs === 0 ? bat.dots + 1 : bat.dots,
      sixes: batRuns === 6 ? bat.sixes + 1 : bat.sixes,
      fours: batRuns === 4 ? bat.fours + 1 : bat.fours,
      ...(isWicket ? { dismissalType, bowlerId: inning.currentBowlerId!, fielderId } : {}),
    };
  });

  // Update bowling stats
  const updatedBowling = inning.bowling.map((bowl): QuickInningBowling => {
    if (bowl.playerId !== inning.currentBowlerId) return bowl;
    const newBalls = legal ? bowl.balls + 1 : bowl.balls;
    return {
      ...bowl,
      runs: bowl.runs + bowlerRns,
      balls: newBalls,
      overs: legal && newBalls % 6 === 0 ? bowl.overs + 1 : bowl.overs,
      wides: isWide ? bowl.wides + 1 : bowl.wides,
      noBalls: isNoBall ? bowl.noBalls + 1 : bowl.noBalls,
      wickets: isWicket && dismissalType !== "RUN_OUT" ? bowl.wickets + 1 : bowl.wickets,
    };
  });

  const newScore = inning.runs + teamRuns;
  const newWickets = inning.wickets + (isWicket ? 1 : 0);

  const updatedInning: QuickInning = {
    ...inning,
    runs: newScore,
    wickets: newWickets,
    balls: nextBalls,
    overs: nextOvers,
    currentStrikerId: striker,
    currentNonStrikerId: nonStriker,
    batting: updatedBatting,
    bowling: updatedBowling,
    balls_history: [...inning.balls_history, newBall],
  };

  // ── Inning / match completion ──
  const inngsComplete = isInngsComplete(isLastWicket, nextOvers, match.overs);

  if (inning.inningNumber === 1) {
    return { updatedInning, inngsComplete, matchComplete: false };
  }

  // Second innings: check if match is over
  const firstInning = match.innings[0];
  if (!firstInning) return { updatedInning, inngsComplete: false, matchComplete: false };

  const battingTeam = match.teamA.id === inning.battingTeamId ? match.teamA : match.teamB;
  const bowlingTeam = match.teamA.id === inning.bowlingTeamId ? match.teamA : match.teamB;

  const matchOver = inngsComplete || newScore > firstInning.runs;

  if (!matchOver) {
    return { updatedInning, inngsComplete: false, matchComplete: false };
  }

  const { result, winnerId } = computeResult(
    newScore,
    firstInning.runs,
    battingTeam.name,
    bowlingTeam.name,
    inning.battingTeamId,
    inning.bowlingTeamId,
    newWickets,
    match.playerLimit,
    isWicket,
    match.category
  );

  return { updatedInning, inngsComplete: false, matchComplete: true, result, winnerId };
}

// ─── Undo last ball ────────────────────────────────────────────────────────
//
// Mirror of undoMatchHandler — reverses exactly what applyBall applied.

export function undoLastBall(inning: QuickInning): QuickInning | null {
  if (inning.balls_history.length === 0) return null;

  const lastBall = inning.balls_history[inning.balls_history.length - 1];
  const remaining = inning.balls_history.slice(0, -1);

  const legal = !lastBall.isWide && !lastBall.isNoBall;
  const teamRuns = lastBall.runs + (lastBall.isWide ? 1 : 0) + (lastBall.isNoBall ? 1 : 0);
  const overs =
    legal && inning.overs > 0 && inning.balls % 6 === 0 ? inning.overs - 1 : inning.overs;
  // Revert batting stats
  const updatedBatting = inning.batting.map((bat): QuickInningBatting => {
    if (bat.playerId !== lastBall.batsmanId) return bat;
    const batRuns = lastBall.isBye || lastBall.isLegBye ? 0 : lastBall.runs;
    return {
      ...bat,
      runs: bat.runs - batRuns,
      balls: legal ? bat.balls - 1 : bat.balls,
      isOut: lastBall.isWicket ? false : bat.isOut,
      dots:
        legal && !lastBall.isBye && !lastBall.isLegBye && lastBall.runs === 0
          ? bat.dots - 1
          : bat.dots,
      sixes: batRuns === 6 ? bat.sixes - 1 : bat.sixes,
      fours: batRuns === 4 ? bat.fours - 1 : bat.fours,
    };
  });

  // Revert bowling stats
  const updatedBowling = inning.bowling.map((bowl): QuickInningBowling => {
    if (bowl.playerId !== lastBall.bowlerId) return bowl;
    if (lastBall.isBye || lastBall.isLegBye) return bowl;
    const bowlerRns = computeBowlerRuns(
      lastBall.runs,
      lastBall.isWide,
      lastBall.isNoBall,
      lastBall.isBye,
      lastBall.isLegBye
    );

    return {
      ...bowl,
      runs: bowl.runs - bowlerRns,
      balls: legal ? bowl.balls - 1 : bowl.balls,
      overs: (bowl.overs > 0 && legal && bowl.balls % 6) === 0 ? bowl.overs - 1 : bowl.overs,
      wides: lastBall.isWide ? bowl.wides - 1 : bowl.wides,
      noBalls: lastBall.isNoBall ? bowl.noBalls - 1 : bowl.noBalls,
      wickets:
        lastBall.isWicket && lastBall.dismissalType !== "RUN_OUT" ? bowl.wickets - 1 : bowl.wickets,
    };
  });

  const currentNonStrikerId =
    inning.currentStrikerId === lastBall.batsmanId
      ? inning.currentNonStrikerId
      : inning.currentStrikerId;

  // Revert inning counters and restore striker/bowler to who was active
  // on the ball being removed (batsmanId = striker at time of ball)
  return {
    ...inning,
    currentNonStrikerId: currentNonStrikerId,
    runs: inning.runs - teamRuns,
    wickets: inning.wickets - (lastBall.isWicket ? 1 : 0),
    balls: legal ? inning.balls - 1 : inning.balls,
    overs: overs,
    currentStrikerId: lastBall.batsmanId,
    currentBowlerId: lastBall.bowlerId,
    batting: updatedBatting,
    bowling: updatedBowling,
    balls_history: remaining,
  };
}

export function createEmptyInning(
  matchId: string,
  inningNumber: 1 | 2,
  battingTeamId: string,
  bowlingTeamId: string,
  battingPlayerIds: string[],
  bowlingPlayerIds: string[],
  battingPlayerNames: Record<string, string>,
  bowlingPlayerNames: Record<string, string>,
  strikerId: string,
  nonStrikerId: string,
  bowlerId: string
): QuickInning {
  return {
    id: nanoid(),
    inningNumber,
    matchId,
    battingTeamId,
    bowlingTeamId,
    runs: 0,
    wickets: 0,
    balls: 0,
    overs: 0,
    currentStrikerId: strikerId,
    currentNonStrikerId: nonStrikerId,
    currentBowlerId: bowlerId,
    batting: battingPlayerIds.map((id) => ({
      playerId: id,
      player: {
        user: {
          name: battingPlayerNames[id] ?? id,
          username: battingPlayerNames[id]?.split(" ")?.[0] + nanoid(5),
        },
        userId: id,
      },
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      dots: 0,
      isOut: false,
    })),
    bowling: bowlingPlayerIds.map((id) => ({
      playerId: id,
      player: {
        user: {
          name: bowlingPlayerNames[id] ?? id,
          username: bowlingPlayerNames[id]?.split(" ")?.[0] + nanoid(5),
        },
        userId: id,
      },
      maidens: 0,
      runs: 0,
      balls: 0,
      overs: 0,
      wides: 0,
      noBalls: 0,
      wickets: 0,
    })),
    balls_history: [],
  };
}
