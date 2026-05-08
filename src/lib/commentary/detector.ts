import { Ball } from "@/generated/prisma";
import { CommentaryPayload, MilestoneType } from "./types";

export interface DetectedEvent {
  payload: CommentaryPayload;
  dedupeKey: string;
}

// ── Milestone detection from batting stats ────────────────────────────────────

export function detectBatterMilestone(
  batterName: string,
  previousRuns: number,
  currentRuns: number,
  overContext: string,
  teamScore: string
): DetectedEvent | null {
  const milestones: { threshold: number; type: MilestoneType }[] = [
    { threshold: 50, type: "FIFTY" },
    { threshold: 100, type: "CENTURY" },
  ];

  for (const { threshold, type } of milestones) {
    if (previousRuns < threshold && currentRuns >= threshold) {
      return {
        payload: {
          eventType: "MILESTONE",
          milestoneType: type,
          milestoneValue: currentRuns,
          batterName,
          ball: null,
          bowlerName: "",
          overContext,
          teamScore,
        },
        dedupeKey: `milestone-${type}-${batterName}`,
      };
    }
  }

  return null;
}

// ── Hat-trick detection from bowling stats ────────────────────────────────────
// A hat-trick = 3 consecutive legal wicket-taking deliveries by the same bowler.
// We check the last 3 balls in history for wickets by the current bowler.

export function detectHatTrick(
  recentBalls: Ball[],
  bowlerName: string,
  overContext: string,
  teamScore: string
): DetectedEvent | null {
  // Need at least 3 balls
  if (recentBalls.length < 3) return null;

  const last3 = recentBalls.slice(-3);
  // All 3 must be wickets (wides don't count as legal balls, but we track wickets on wides too)
  const allWickets = last3.every((b) => b.isWicket);
  if (!allWickets) return null;

  return {
    payload: {
      eventType: "MILESTONE",
      milestoneType: "HAT_TRICK",
      bowlerName,
      ball: null,
      overContext,
      teamScore,
    },
    dedupeKey: `hattrick-${bowlerName}-${overContext}`,
  };
}

// ── Back-to-back / multiple boundaries detection ──────────────────────────────

export function detectSpecialBoundaryEvents(
  recentBalls: Ball[],
  batterName: string,
  bowlerName: string,
  overContext: string,
  teamScore: string
): DetectedEvent | null {
  if (recentBalls.length < 2) return null;

  const last2 = recentBalls.slice(-2);
  const last2AreAllFours = last2.every((b) => b.runs === 4 && !b.isWide);
  const last2AreAllSixes = last2.every((b) => b.runs === 6 && !b.isWide);

  if (last2AreAllSixes) {
    return {
      payload: {
        eventType: "SPECIAL_EVENT",
        specialEvent: "BACK_TO_BACK_SIXES",
        batterName,
        bowlerName,
        ball: null,
        overContext,
        teamScore,
      },
      dedupeKey: `bb6-${overContext}`,
    };
  }

  if (last2AreAllFours) {
    return {
      payload: {
        eventType: "SPECIAL_EVENT",
        specialEvent: "BACK_TO_BACK_FOURS",
        ball: null,
        batterName,
        bowlerName,
        overContext,
        teamScore,
      },
      dedupeKey: `bb4-${overContext}`,
    };
  }

  // 3+ boundaries in current over
  const boundaries = recentBalls.filter((b) => (b.runs === 4 || b.runs === 6) && !b.isWide).length;
  if (boundaries >= 3) {
    return {
      payload: {
        eventType: "SPECIAL_EVENT",
        specialEvent: "MULTIPLE_BOUNDARIES",
        batterName,
        ball: null,
        bowlerName,
        overContext,
        teamScore,
      },
      dedupeKey: `multibnd-${overContext}-${boundaries}`,
    };
  }

  return null;
}

// ── Maiden over detection ─────────────────────────────────────────────────────
// Called when an over completes (balls % 6 === 0)

export function detectMaidenOver(
  overBalls: Ball[],
  bowlerName: string,
  overContext: string,
  teamScore: string
): DetectedEvent | null {
  if (overBalls.length !== 6) return null;
  const totalRuns = overBalls.reduce((sum, b) => sum + b.runs, 0);
  const hasWide = overBalls.some((b) => b.isWide);
  const hasNoBall = overBalls.some((b) => b.isNoBall);

  if (totalRuns === 0 && !hasWide && !hasNoBall) {
    return {
      payload: {
        eventType: "SPECIAL_EVENT",
        specialEvent: "MAIDEN_OVER",
        bowlerName,
        ball: null,
        overContext,
        teamScore,
      },
      dedupeKey: `maiden-${overContext}`,
    };
  }
  return null;
}
