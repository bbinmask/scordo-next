"use server";

import { db } from "@/lib/db";
import {
  InputTypeForChangeBowler,
  InputTypeForCreate,
  InputTypeForInitializeMatch,
  InputTypeForNextInning,
  InputTypeForOfficials,
  InputTypeForPushBall,
  InputTypeForRemove,
  InputTypeForRequest,
  InputTypeForUndoBall,
  ReturnTypeForChangeBowler,
  ReturnTypeForCreate,
  ReturnTypeForInitialieMatch,
  ReturnTypeForNextInning,
  ReturnTypeForOfficials,
  ReturnTypeForPushBall,
  ReturnTypeForRemove,
  ReturnTypeForRequest,
  ReturnTypeForUndoBall,
} from "./types";
import { createSafeAction } from "@/lib/create-safe-action";
import {
  AddOfficials,
  ChangeBowler,
  CreateMatch,
  InitializeMatch,
  PushBall,
  RemoveOfficial,
  Request,
  StartNextInning,
  UndoBall,
} from "./schema";
import { currentUser } from "@/lib/currentUser";
import { ERROR_CODES } from "@/constants";
import { Ball, Inning, Match } from "@/generated/prisma";
import { revalidatePath } from "next/cache";
import { ablyServer } from "@/lib/ably-server";
import { generateCommentary } from "@/lib/commentary/engine";
import { ShotSide } from "@/lib/commentary/types";
import { currentOverData } from "@/lib/match/current-over";
import {
  detectBatterMilestone,
  detectHatTrick,
  detectSpecialBoundaryEvents,
} from "@/lib/commentary/detector";

const createMatchHandler = async (data: InputTypeForCreate): Promise<ReturnTypeForCreate> => {
  const {
    category,
    date,
    location,
    matchOfficials,
    overLimit,
    overs,
    teamAId,
    teamBId,
    tossDecision,
    tossWinner,
    venue,
    playerLimit,
    tournamentId,
  } = data;

  const user = await currentUser();

  if (!user)
    return {
      error: ERROR_CODES.UNAUTHORIZED.message,
    };

  let match: Match, tournament;

  try {
    const teamA = await db.team.findUnique({
      where: {
        id: teamAId,
      },
    });

    if (!teamA)
      return {
        error: "Team A not found!",
      };

    const teamB = await db.team.findUnique({
      where: {
        id: teamBId,
      },
    });

    if (!teamB)
      return {
        error: "Team B not found!",
      };

    if (tournamentId) {
      tournament = await db.tournament.findUnique({
        where: {
          id: tournamentId,
        },
      });

      if (!tournament)
        return {
          error: "Tournament not found!",
        };
    }

    match = await db.match.create({
      data: {
        category,
        date: new Date(date),
        location,
        overLimit,
        overs,
        teamAId,
        teamBId,
        tossDecision,
        tossWinner,
        requestStatus: teamA.ownerId === teamB.ownerId ? "accepted" : "pending",
        venue,
        playerLimit,
        organizerId: user.id,
        ...(tournamentId && { tournamentId }),
      },
    });

    if (!match)
      return {
        error: "Could not create match!",
      };

    if (matchOfficials && matchOfficials.length > 0) {
      await db.matchOfficial.createMany({
        data: matchOfficials?.map((official) => ({
          ...official,
          matchId: match.id,
        })),
      });
    }
  } catch (error: unknown) {
    if (error instanceof Error)
      return {
        error: error?.message || "Something went wrong!",
      };
    return {
      error: ERROR_CODES.INTERNAL_SERVER_ERROR.message,
    };
  }

  revalidatePath(`/matches`);
  return {
    data: match,
  };
};

const addOfficialsHandler = async (
  data: InputTypeForOfficials
): Promise<ReturnTypeForOfficials> => {
  const { matchOfficials, matchId } = data;

  const user = await currentUser();

  if (!user)
    return {
      error: ERROR_CODES.UNAUTHORIZED.message,
    };

  let matchOfficial, match;

  try {
    match = await db.match.findUnique({
      where: {
        id: matchId,
      },
    });

    if (!match)
      return {
        error: "Match not found",
      };

    matchOfficial = await db.matchOfficial.findMany({
      where: {
        matchId,
      },
    });

    if (matchOfficial.length >= 5)
      return {
        error: "Only 5 officials are allowed!",
      };

    if (match.organizerId !== user.id)
      return {
        error: "Only organizer can add a new official",
      };

    await db.matchOfficial.createMany({
      data: matchOfficials.map((official) => ({
        ...official,
        matchId: matchId,
      })),
    });

    matchOfficial = await db.matchOfficial.findMany({
      where: {
        matchId,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error)
      return {
        error: error?.message,
      };
    return {
      error: ERROR_CODES.INTERNAL_SERVER_ERROR.message,
    };
  }

  revalidatePath(`/matches/${matchId}`);

  return {
    data: matchOfficial,
  };
};

const removeOfficialHandler = async (data: InputTypeForRemove): Promise<ReturnTypeForRemove> => {
  const user = await currentUser();

  if (!user)
    return {
      error: ERROR_CODES.UNAUTHORIZED.message,
    };

  const { id } = data;

  try {
    const official = await db.matchOfficial.findUnique({
      where: { id },
      include: { match: true },
    });

    if (!official)
      return {
        error: "Official not found",
      };

    if (official.match.organizerId !== user.id)
      return {
        error: "Only the organizer can remove an official",
      };

    await db.matchOfficial.delete({
      where: { id },
    });

    revalidatePath(`/matches/${official.matchId}`);
  } catch (error: unknown) {
    if (error instanceof Error)
      return {
        error: error?.message,
      };
    return {
      error: ERROR_CODES.INTERNAL_SERVER_ERROR.message,
    };
  }

  return {
    data: true,
  };
};

const declineMatchRequestHandler = async (
  data: InputTypeForRequest
): Promise<ReturnTypeForRequest> => {
  const { id } = data;

  const user = await currentUser();

  if (!user)
    return {
      error: "Please Log in!",
    };

  let match;
  try {
    match = await db.match.findUnique({
      where: {
        id,
      },
      select: {
        teamB: {
          select: {
            ownerId: true,
            captainId: true,
          },
        },
      },
    });

    if (!match)
      return {
        error: "Match not found!",
      };

    if (match.teamB.ownerId !== user.id && match.teamB.captainId !== user.id)
      return {
        error: "Only owner or captain can decline",
      };

    match = await db.match.delete({
      where: { id },
    });
  } catch (error: unknown) {
    if (error instanceof Error)
      return {
        error: error?.message,
      };
    return {
      error: ERROR_CODES.INTERNAL_SERVER_ERROR.message,
    };
  }

  revalidatePath(`/teams`);

  return {
    data: true,
  };
};

const acceptMatchRequestHandler = async (
  data: InputTypeForRequest
): Promise<ReturnTypeForRequest> => {
  const { id } = data;

  const user = await currentUser();

  if (!user)
    return {
      error: "Please Log in!",
    };

  let match;
  try {
    match = await db.match.findUnique({
      where: {
        id,
      },
      select: {
        teamB: {
          select: {
            ownerId: true,
            captainId: true,
          },
        },
      },
    });

    if (!match)
      return {
        error: "Match not found!",
      };

    if (match.teamB.ownerId !== user.id && match.teamB.captainId !== user.id)
      return {
        error: "Only owner or captain can decline",
      };

    match = await db.match.update({
      where: { id },
      data: {
        requestStatus: "accepted",
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error)
      return {
        error: error?.message,
      };
    return {
      error: ERROR_CODES.INTERNAL_SERVER_ERROR.message,
    };
  }

  revalidatePath(`/teams`);

  return {
    data: true,
  };
};

const initializeMatchHandler = async (
  data: InputTypeForInitializeMatch
): Promise<ReturnTypeForInitialieMatch> => {
  const {
    bowlerId,
    matchId,
    nonStrikerId,
    strikerId,
    teamAPlayerIds,
    teamBPlayerIds,
    tossDecision,
    tossWinnerId,
  } = data;

  const user = await currentUser();

  if (!user)
    return {
      error: "Login required",
    };

  const uniquePlayers = new Set([...teamAPlayerIds, ...teamBPlayerIds]);
  if (uniquePlayers.size !== teamAPlayerIds.length + teamBPlayerIds.length) {
    return { error: "Duplicate players detected in playing XI" };
  }

  let inning: Inning, match;
  try {
    match = await db.match.findUnique({
      where: {
        id: matchId,
      },
      select: {
        organizerId: true,
        teamAId: true,
        teamBId: true,
        status: true,
        innings: { select: { id: true } },
        playerLimit: true,
      },
    });

    if (!match)
      return {
        error: "Match not found",
      };

    if (match.status !== "not_started" || match.innings.length > 0) {
      return { error: "Match already started" };
    }

    if (
      teamAPlayerIds.length !== match.playerLimit ||
      teamBPlayerIds.length !== match.playerLimit
    ) {
      return { error: `Each team must have exactly ${match.playerLimit} players` };
    }

    if (match.organizerId !== user.id) {
      return {
        error: "Only match organizer can start the match!",
      };
    }

    const battingTeamId =
      (tossWinnerId === match.teamAId && tossDecision === "BAT") ||
      (tossWinnerId === match.teamBId && tossDecision === "BOWL")
        ? match.teamAId
        : match.teamBId;
    const bowlingTeamId =
      (tossWinnerId === match.teamAId && tossDecision === "BOWL") ||
      (tossWinnerId === match.teamBId && tossDecision === "BAT")
        ? match.teamAId
        : match.teamBId;

    const battingPlayers = battingTeamId === match.teamAId ? teamAPlayerIds : teamBPlayerIds;

    const bowlingPlayers = bowlingTeamId === match.teamAId ? teamAPlayerIds : teamBPlayerIds;

    if (
      battingPlayers.findIndex((pl) => pl.id === strikerId) === -1 ||
      battingPlayers.findIndex((pl) => pl.id === nonStrikerId) === -1
    ) {
      return { error: "Strikers must be from batting team" };
    }

    if (battingPlayers.findIndex((pl) => pl.id === bowlerId) !== -1) {
      return { error: "Bowler cannot be from batting team" };
    }

    if (bowlingPlayers.findIndex((pl) => pl.id === bowlerId) === -1) {
      return { error: "Bowler must be from bowling team" };
    }

    if (strikerId === nonStrikerId) {
      return { error: "Striker and non-striker cannot be the same player" };
    }

    const validPlayers = await db.player.findMany({
      where: {
        id: { in: [...teamAPlayerIds.map((pl) => pl.id), ...teamBPlayerIds.map((pl) => pl.id)] },
      },
      select: {
        id: true,
        teamId: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    if (validPlayers.length !== teamAPlayerIds.length + teamBPlayerIds.length) {
      return { error: "One or more players do not exist" };
    }

    const playerMap = new Map(
      validPlayers.map((p) => [p.id, { teamId: p.teamId, username: p.user.username }])
    );

    for (const player of teamAPlayerIds) {
      if (playerMap.get(player.id)?.teamId !== match.teamAId)
        return { error: `Player ${playerMap.get(player.id)?.username} is invalid in Team A` };
    }

    for (const player of teamBPlayerIds) {
      if (playerMap.get(player.id)?.teamId !== match.teamBId)
        return { error: `Player ${playerMap.get(player.id)?.username} is invalid in Team B` };
    }

    inning = await db.$transaction(async (tsx) => {
      const createdInning = await tsx.inning.create({
        data: {
          battingTeamId,
          bowlingTeamId,
          matchId,
          currentBowlerId: bowlerId,
          currentStrikerId: strikerId,
          currentNonStrikerId: nonStrikerId,
          inningNumber: 1,
        },
      });

      await tsx.inningBatting.createMany({
        data: battingPlayers.map((player) => ({
          playerId: player.id,
          inningId: createdInning.id,
        })),
      });

      await tsx.inningBowling.createMany({
        data: bowlingPlayers.map((player) => ({
          playerId: player.id,
          inningId: createdInning.id,
        })),
      });

      await tsx.match.update({
        where: { id: matchId },
        data: {
          status: "in_progress",
          tossWinner: tossWinnerId,
          tossDecision,
        },
      });

      return createdInning;
    });

    const foundInning = await db.inning.findUnique({
      where: {
        id: inning.id,
      },
      include: {
        battingTeam: true,
        bowlingTeam: true,
        InningBatting: true,
        InningBowling: true,
        currentBowler: true,
        currentNonStriker: true,
        currentStriker: true,
      },
    });

    if (!foundInning)
      return {
        error: "Inning not found",
      };

    revalidatePath(`/matches/${matchId}`);

    ablyServer.channels.get(`match:${matchId}`).publish("match-start", {
      inning: foundInning,
    });

    return {
      data: foundInning,
    };
  } catch (error: unknown) {
    if (error instanceof Error)
      return {
        error: error?.message,
      };
    return {
      error: ERROR_CODES.INTERNAL_SERVER_ERROR.message,
    };
  }
};

const pushBallHandler = async (data: InputTypeForPushBall): Promise<ReturnTypeForPushBall> => {
  const {
    batsmanId,
    inningId,
    matchId,
    fielderId: initFielderId,
    isBye,
    dismissalType,
    runs,
    isLegBye,
    isNoBall,
    isWicket,
    isWide,
    nextBatsmanId,
    isLastWicket,
    outBatsmanId,
    shotSide,
    shotType,
  } = data;

  const user = await currentUser();
  if (!user) return { error: "Log in required" };

  // ─── Run counting ────────────────────────────────────────────────────────

  const teamRuns = runs + (isWide ? 1 : 0) + (isNoBall ? 1 : 0);

  const batsmanRuns = isBye || isLegBye ? 0 : runs;

  let bowlerRuns: number;
  if (isWide) {
    bowlerRuns = isBye || isLegBye ? 1 : runs + 1;
  } else if (isNoBall) {
    bowlerRuns = isBye || isLegBye ? 1 : runs + 1;
  } else {
    bowlerRuns = isBye || isLegBye ? 0 : runs;
  }

  const isLegalDelivery = !isNoBall && !isWide;

  const fielderId = initFielderId?.trim() ? initFielderId : undefined;

  let target: number | undefined;
  let runsNeeded: number | undefined;

  let currentMatchStatus = "" as string;

  type HydratedBall = Ball & {
    batsman: { user: { name?: string; username?: string } };
    bowler: { user: { name?: string; username?: string } };
    fielder?: { user: { name?: string; username?: string } } | null;
  };

  let ball: HydratedBall;

  try {
    const match = await db.match.findUnique({
      where: { id: matchId },
      include: {
        matchOfficials: true,
        teamA: { select: { name: true, abbreviation: true } },
        teamB: { select: { name: true, abbreviation: true } },
      },
    });

    if (!match) return { error: "Match not found!" };

    const isCommentaryEnabled = match.commentaryEnabled;

    const isScorer = match.matchOfficials.some((o) => o.userId === user.id && o.role === "SCORER");
    if (!isScorer) return { error: "Only Scorer can update the score!" };

    const inning = await db.inning.findUnique({ where: { id: inningId } });
    if (!inning) return { error: "Inning not found!" };

    const ballsLeft = match.overs * 6 - inning.balls;
    const overContext = `${inning.overs}.${inning.balls % 6}`;
    const teamScore = `${inning.runs}/${inning.wickets}`;
    const inningNumber = inning.inningNumber;
    const totalOvers = match.overs;

    const nextBall = isLegalDelivery ? inning.balls + 1 : inning.balls;
    const nextOver = isLegalDelivery && nextBall % 6 === 0 ? inning.overs + 1 : inning.overs;

    const battingTeam = match.teamAId === inning.battingTeamId ? match.teamA : match.teamB;
    const bowlingTeam = match.teamAId === inning.bowlingTeamId ? match.teamA : match.teamB;

    const battingInn = await db.inningBatting.findFirst({
      where: { inningId, playerId: batsmanId },
      include: {
        player: { select: { user: { select: { name: true, username: true } } } },
      },
    });
    if (!battingInn) return { error: "Batsman not found" };

    const bowlingInn = await db.inningBowling.findFirst({
      where: { inningId, playerId: inning.currentBowlerId as string },
      include: {
        player: { select: { user: { select: { name: true, username: true } } } },
      },
    });
    if (!bowlingInn) return { error: "Bowler not found" };

    // ── Strike rotation ────────────────────────────────────────────────────

    let striker = inning.currentStrikerId;
    let nonStriker = inning.currentNonStrikerId;

    if (runs % 2 === 1) {
      [striker, nonStriker] = [nonStriker, striker];
    }

    if (isLegalDelivery && nextBall % 6 === 0) {
      [striker, nonStriker] = [nonStriker, striker];
    }

    if (isWicket && !isLastWicket && nextBatsmanId) {
      if (outBatsmanId === striker) {
        striker = nextBatsmanId;
      } else if (outBatsmanId === nonStriker) {
        nonStriker = nextBatsmanId;
      }
    }

    // ── Main transaction ───────────────────────────────────────────────────
    ball = await db.$transaction(async (tsx) => {
      // Guard: if the previous over was just completed (6 legal balls bowled by
      // the SAME bowler who is still set as currentBowlerId), the scorer must
      // first call changeBowler before recording the next delivery.
      const lastLegalBall = await tsx.ball.findFirst({
        where: { inningId, isWide: false, isNoBall: false },
        orderBy: { createdAt: "desc" },
      });

      if (lastLegalBall) {
        const isOverCompleted =
          lastLegalBall.ball % 6 === 0 &&
          lastLegalBall.ball !== 0 &&
          lastLegalBall.bowlerId === inning.currentBowlerId;

        if (isOverCompleted) {
          throw new Error("Bowler change is required before bowling next ball!");
        }
      }

      const createdBall = await tsx.ball.create({
        data: {
          ball: nextBall,
          over: nextOver,
          batsmanId,
          bowlerId: inning.currentBowlerId as string,
          inningId,
          runs,
          dismissalType,
          isBye,
          isLegBye,
          isNoBall,
          fielderId: fielderId,
          isWicket,
          isWide,
        },
        include: {
          batsman: { select: { user: { select: { name: true, username: true } } } },
          bowler: { select: { user: { select: { name: true, username: true } } } },
          fielder: { select: { user: { select: { name: true, username: true } } } },
        },
      });

      await tsx.inningBatting.update({
        where: { id: battingInn.id },
        data: {
          balls: isLegalDelivery || isNoBall ? battingInn.balls + 1 : battingInn.balls,
          isOut: battingInn.isOut || isWicket,
          runs: battingInn.runs + batsmanRuns,
          dots:
            isLegalDelivery && !isBye && !isLegBye && runs === 0
              ? battingInn.dots + 1
              : battingInn.dots,
          sixes: batsmanRuns === 6 ? battingInn.sixes + 1 : battingInn.sixes,
          fours: batsmanRuns === 4 ? battingInn.fours + 1 : battingInn.fours,
        },
      });

      await tsx.inningBowling.update({
        where: { id: bowlingInn.id },
        data: {
          runs: bowlingInn.runs + bowlerRuns,
          balls: isLegalDelivery ? bowlingInn.balls + 1 : bowlingInn.balls,
          overs:
            isLegalDelivery && (bowlingInn.balls + 1) % 6 === 0
              ? bowlingInn.overs + 1
              : bowlingInn.overs,
          wides: isWide ? bowlingInn.wides + 1 : bowlingInn.wides,
          noBalls: isNoBall ? bowlingInn.noBalls + 1 : bowlingInn.noBalls,
          wickets:
            isWicket && dismissalType !== "RUN_OUT" ? bowlingInn.wickets + 1 : bowlingInn.wickets,
        },
      });

      await tsx.inning.update({
        where: { id: inningId },
        data: {
          balls: nextBall,
          overs: nextOver,
          runs: inning.runs + teamRuns,
          wickets: isWicket ? inning.wickets + 1 : inning.wickets,
          currentStrikerId: striker,
          currentNonStrikerId: nonStriker,
        },
      });

      if (inningNumber === 1) {
        if (isLastWicket || nextOver === totalOvers) {
          await tsx.match.update({
            where: { id: matchId },
            data: { status: "inning_completed" },
          });

          currentMatchStatus = "inning_completed";
        }
      } else if (inningNumber === 2) {
        const firstInning = await tsx.inning.findFirst({
          where: { matchId },
          orderBy: { inningNumber: "asc" },
        });

        if (!firstInning) throw new Error("First inning not found!");

        target = firstInning.runs + 1;
        runsNeeded = target - (inning.runs + teamRuns);

        const currentScore = inning.runs + teamRuns;
        const chased = currentScore > firstInning.runs;
        const matchComplete = isLastWicket || nextOver === totalOvers || chased;

        if (matchComplete) {
          let result: string;
          let winnerId: string | undefined;

          if (chased) {
            winnerId = inning.battingTeamId;
            const wicketsRemaining = match.playerLimit - inning.wickets - (isWicket ? 1 : 0);
            result = `${battingTeam.name} won by ${wicketsRemaining} wickets`;
          } else if (currentScore < firstInning.runs) {
            winnerId = inning.bowlingTeamId;

            const runsMargin = firstInning.runs - currentScore;
            result = `${bowlingTeam.name} won by ${runsMargin} runs`;
          } else {
            result = "Match Tied";
          }

          await tsx.match.update({
            where: { id: matchId },
            data: { status: "completed", result, winnerId },
          });

          currentMatchStatus = "completed";
        }
      }
      return createdBall;
    });

    if (currentMatchStatus === "inning_completed") {
      await ablyServer.channels.get(`match:${matchId}`).publish("inning-completed", {});
    }

    // ── Commentary ────────────────────────────────────────────────────────

    let commentary;

    if (isCommentaryEnabled) {
      const eventType = isWicket ? "WICKET" : "RUN_SCORED";
      const currentOver = (await currentOverData(inningId)).data;

      const batterName =
        battingInn?.player.user.name ?? battingInn?.player.user.username ?? "Batter";
      const bowlerName =
        bowlingInn?.player.user.name ?? bowlingInn?.player.user.username ?? "Bowler";

      let milestone, hattrick, special;

      if (battingInn && !isWicket) {
        const prevRuns = battingInn.runs;
        const nextRuns = prevRuns + batsmanRuns;
        milestone = detectBatterMilestone(batterName, prevRuns, nextRuns, overContext, teamScore);
      }

      if (isWicket) {
        hattrick = detectHatTrick(currentOver as Ball[], bowlerName, overContext, teamScore);
      }

      if (!isWicket) {
        special = detectSpecialBoundaryEvents(
          currentOver as Ball[],
          batterName,
          bowlerName,
          overContext,
          teamScore
        );
      }

      const { text, label } = await generateCommentary(
        {
          eventType,
          ball: ball,
          batterName,
          bowlerName,
          fielderName: ball.fielder?.user.name,
          overContext,
          teamScore,
          inningNumber,
          shotSide: shotSide as ShotSide,
          target,
          runsNeeded,
          shotType,
          ballsLeft,
          milestoneType: milestone?.payload.milestoneType || hattrick?.payload.milestoneType,
          specialEvent: special?.payload.specialEvent,
          milestoneValue: milestone?.payload.milestoneValue || hattrick?.payload.milestoneValue,
        },
        true
      );

      commentary = await db.commentary.create({
        data: { eventType, label, text, ballId: ball.id },
        include: { ball: { select: { over: true, ball: true } } },
      });
    }

    await ablyServer.channels.get(`match:${matchId}`).publish("ball-added", {
      ball: nextBall,
      over: nextOver,
      batsmanId,
      bowlerId: inning.currentBowlerId as string,
      inningId,
      isCompleted: currentMatchStatus === "completed" || currentMatchStatus === "inning_completed",
      runs,
      dismissalType,
      isBye,
      isLegBye,
      isNoBall,
      fielderId: fielderId,
      isWicket,
      isWide,
      ballData: ball,
      commentary: commentary ?? null,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message !== ERROR_CODES.INTERNAL_SERVER_ERROR.message) {
      return { error: error.message };
    }
    return { error: ERROR_CODES.INTERNAL_SERVER_ERROR.message };
  }

  revalidatePath(`/matches/${matchId}`);
  return { data: ball };
};

const startNextInningHandler = async (
  data: InputTypeForNextInning
): Promise<ReturnTypeForNextInning> => {
  const user = await currentUser();
  if (!user) return { error: "Please Log in!" };

  const { bowlerId, matchId, nonStrikerId, strikerId } = data;

  let inning;

  try {
    const match = await db.match.findUnique({
      where: { id: matchId },
      include: {
        teamA: { select: { id: true, players: { select: { id: true } } } },
        teamB: { select: { id: true, players: { select: { id: true } } } },
        innings: {
          include: {
            InningBatting: true,
            InningBowling: true,
          },
        },
      },
    });

    if (!match) return { error: "Match not found!" };

    if (match.organizerId !== user.id) return { error: "Only organizer can start!" };

    const inningCount = match.innings.length;

    if (match.category !== "Test" && inningCount >= 2) return { error: "All innings finished!" };
    if (match.category === "Test" && inningCount >= 4) return { error: "All innings finished!" };

    const lastInning = match.innings.at(-1);

    if (!lastInning) return { error: "First inning must be created before next!" };

    if (strikerId === nonStrikerId) {
      return { error: "Striker and Non-Striker must be different players!" };
    }

    const battingTeamId =
      lastInning.battingTeamId === match.teamAId ? match.teamBId : match.teamAId;

    const bowlingTeamId = battingTeamId === match.teamA.id ? match.teamB.id : match.teamA.id;

    const battingPlayers = lastInning.InningBowling.map((p) => p.playerId);
    const bowlingPlayers = lastInning.InningBatting.map((p) => p.playerId);

    const battingIds = new Set(battingPlayers.map((id) => id));
    const bowlingIds = new Set(bowlingPlayers.map((id) => id));

    if (match.status !== "inning_completed") {
      return { error: "Previous inning is still in progress!" };
    }

    if (!battingIds.has(strikerId) || !battingIds.has(nonStrikerId))
      return { error: "Strikers must belong to batting team" };

    if (!bowlingIds.has(bowlerId)) return { error: "Bowler must belong to bowling team" };

    inning = await db.$transaction(async (tsx) => {
      const createdInning = await tsx.inning.create({
        data: {
          matchId,
          battingTeamId,
          bowlingTeamId,
          currentBowlerId: bowlerId,
          currentStrikerId: strikerId,
          currentNonStrikerId: nonStrikerId,
          inningNumber: inningCount + 1,
        },
      });

      await tsx.inningBatting.createMany({
        data: battingPlayers.map((playerId) => ({
          playerId,
          inningId: createdInning.id,
        })),
      });

      await tsx.inningBowling.createMany({
        data: bowlingPlayers.map((playerId) => ({
          playerId,
          inningId: createdInning.id,
        })),
      });

      await tsx.match.update({
        where: { id: matchId },
        data: { status: "in_progress" },
      });

      ablyServer.channels.get(`match:${matchId}`).publish("next-inning", {
        inningId: createdInning.id,
        battingTeamId,
        bowlingTeamId,
      });

      return createdInning;
    });
  } catch {
    return { error: ERROR_CODES.INTERNAL_SERVER_ERROR.message };
  }

  revalidatePath(`/matches/${matchId}`);
  return { data: inning };
};

const changeBowlerHandler = async (
  data: InputTypeForChangeBowler
): Promise<ReturnTypeForChangeBowler> => {
  const { bowlerId, inningId, matchId } = data;

  const user = await currentUser();
  if (!user) return { error: "Please Log in!" };

  try {
    const result = await db.$transaction(async (tsx) => {
      const match = await tsx.match.findUnique({
        where: { id: matchId },
        include: { matchOfficials: true },
      });

      if (!match) return { error: "Match not found!" };

      const isScorer = match.matchOfficials.some(
        (o) => o.userId === user.id && o.role === "SCORER"
      );

      if (!isScorer) return { error: "Only Scorer can update the score!" };

      const inning = await tsx.inning.findUnique({
        where: { id: inningId },
      });

      if (!inning) return { error: "Inning not found!" };

      const lastLegalBall = await tsx.ball.findFirst({
        where: {
          inningId,
          isWide: false,
          isNoBall: false,
        },
        orderBy: { createdAt: "desc" },
      });

      if (lastLegalBall) {
        const legalBallsThisOver = await tsx.ball.count({
          where: {
            inningId,
            over: lastLegalBall.over,
            isWide: false,
            isNoBall: false,
          },
        });

        if (legalBallsThisOver === 6) {
          if (lastLegalBall.bowlerId === bowlerId) {
            return {
              error: "A bowler cannot bowl consecutive overs",
            };
          }
        }
      }

      const legalBallsByBowler = await tsx.ball.count({
        where: {
          inningId,
          bowlerId,
          isWide: false,
          isNoBall: false,
        },
      });

      const oversBowled = Math.floor(legalBallsByBowler / 6);

      if (oversBowled >= match.overLimit) {
        return { error: "This bowler completed all his overs" };
      }

      const updated = await tsx.inning.update({
        where: { id: inningId },
        data: { currentBowlerId: bowlerId },
      });

      return { data: updated };
    });

    if (!result)
      return {
        error: "Match not found!",
      };

    return {
      data: true,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error?.message,
      };
    }
    return { error: ERROR_CODES.INTERNAL_SERVER_ERROR.message };
  }

  revalidatePath(`/matches/${matchId}`);

  return { data: true };
};

const deleteMatchHandler = async (data: InputTypeForRequest): Promise<ReturnTypeForRequest> => {
  const user = await currentUser();
  const { id: matchId } = data;
  if (!user)
    return {
      error: "Please Log in!",
    };

  let match;

  try {
    match = await db.match.findUnique({
      where: {
        id: matchId,
      },
    });

    if (!match)
      return {
        error: "Match not found!",
      };

    if (match.organizerId !== user.id)
      return {
        error: "Only match organizer can delete the match!",
      };

    match = await db.$transaction(async (tsx) => {
      await tsx.inningBowling.deleteMany({
        where: {
          inning: {
            matchId,
          },
        },
      });

      await tsx.inningBatting.deleteMany({
        where: {
          inning: {
            matchId,
          },
        },
      });

      await tsx.ball.deleteMany({
        where: {
          inning: {
            matchId,
          },
        },
      });

      await tsx.inning.deleteMany({
        where: {
          matchId,
        },
      });

      await tsx.matchOfficial.deleteMany({
        where: {
          matchId,
        },
      });

      return await tsx.match.delete({
        where: { id: matchId },
      });
    });
  } catch (error: unknown) {
    if (error instanceof Error)
      return {
        error: error?.message,
      };
    return {
      error: ERROR_CODES.INTERNAL_SERVER_ERROR.message,
    };
  }

  revalidatePath(`/matches`);
  revalidatePath(`/matches/${matchId}`);
  return {
    data: true,
  };
};

const undoMatchHandler = async (data: InputTypeForUndoBall): Promise<ReturnTypeForUndoBall> => {
  const user = await currentUser();
  if (!user) return { error: "Please Log in!" };

  const { matchId, inningId } = data;

  try {
    const match = await db.match.findUnique({
      where: {
        id: matchId,
      },
    });

    if (!match) return { error: "Match not found!" };

    const isScorer = await db.matchOfficial.findFirst({
      where: {
        matchId,
        userId: user.id,
        role: "SCORER",
      },
    });

    if (!isScorer) return { error: "Only Scorer can update the score!" };

    const inning = await db.inning.findUnique({
      where: {
        id: inningId,
      },
    });

    if (!inning) return { error: "Inning not found!" };

    const lastBall = await db.ball.findFirst({
      where: {
        inningId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!lastBall) return { error: "No balls to undo!" };

    await db.$transaction(async (tsx) => {
      await tsx.ball.delete({
        where: {
          id: lastBall.id,
        },
      });

      await tsx.inning.update({
        where: {
          id: inningId,
        },
        data: {
          runs: inning.runs - lastBall.runs,
          wickets: lastBall.isWicket ? inning.wickets - 1 : inning.wickets,
          balls: lastBall.isNoBall || lastBall.isWide ? inning.balls : inning.balls - 1,
          overs:
            lastBall.isNoBall || lastBall.isWide
              ? inning.overs
              : (inning.balls - 1) % 6 === 0
                ? inning.overs - 1
                : inning.overs,
          currentStrikerId: lastBall.batsmanId,
          currentBowlerId: lastBall.bowlerId,
        },
      });

      await tsx.inningBatting.updateMany({
        where: {
          inningId,
          playerId: lastBall.batsmanId,
        },
        data: {
          runs: { decrement: lastBall.runs },
          ...(lastBall.isWicket && { isOut: false }),
        },
      });

      if (!lastBall.isBye && !lastBall.isLegBye) {
        await tsx.inningBowling.updateMany({
          where: {
            inningId,
            playerId: lastBall.bowlerId,
          },
          data: {
            runs: { decrement: lastBall.runs },
            ...(lastBall.isWicket &&
              lastBall.dismissalType !== "RUN_OUT" && {
                wickets: { decrement: 1 },
              }),
          },
        });
      }
    });
  } catch (error: unknown) {
    if (error instanceof Error)
      return {
        error: error?.message,
      };
    if (error instanceof Error)
      return {
        error: error?.message || "Something went wrong!",
      };
    return {
      error: ERROR_CODES.INTERNAL_SERVER_ERROR.message,
    };
  }

  return {
    data: true,
  };
};

export const createMatch = createSafeAction(CreateMatch, createMatchHandler);
export const addOfficials = createSafeAction(AddOfficials, addOfficialsHandler);
export const removeOfficial = createSafeAction(RemoveOfficial, removeOfficialHandler);
export const declineMatchRequest = createSafeAction(Request, declineMatchRequestHandler);
export const acceptMatchRequest = createSafeAction(Request, acceptMatchRequestHandler);
export const initializeMatch = createSafeAction(InitializeMatch, initializeMatchHandler);
export const pushBall = createSafeAction(PushBall, pushBallHandler);
export const changeBowler = createSafeAction(ChangeBowler, changeBowlerHandler);
export const startNextInning = createSafeAction(StartNextInning, startNextInningHandler);
export const deleteMatch = createSafeAction(Request, deleteMatchHandler);
export const undoBall = createSafeAction(UndoBall, undoMatchHandler);
