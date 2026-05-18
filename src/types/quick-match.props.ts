// QuickMatch types mirror the authenticated MatchWithDetails / InningDetails
// shapes as closely as possible so the scoring engine and UI components can
// treat both interchangeably without branching.

import type { WicketType } from "@/generated/prisma";
import type { ShotSide, ShotType } from "@/lib/commentary/types";

// ─── Extras payload ────────────────────────────────────────────────────────

export interface QuickExtras {
  isWide: boolean;
  isNoBall: boolean;
  isBye: boolean;
  isLegBye: boolean;
}

// ─── A ball in the local ball history ─────────────────────────────────────

export interface QuickBall {
  id: string;
  ball: number; // legal-ball counter (1-6 within an over)
  over: number; // over number (0-indexed)
  runs: number; // runs off the bat
  isWide: boolean;
  isNoBall: boolean;
  isBye: boolean;
  isLegBye: boolean;
  isWicket: boolean;
  dismissalType?: WicketType;
  batsmanId: string;
  bowlerId: string;
  fielderId?: string;
  shotSide?: ShotSide | null;
  shotType?: ShotType | null;
  createdAt: string; // ISO timestamp — mirrors Prisma Ball.createdAt
}

// ─── Batting stats per player per inning ──────────────────────────────────

export interface QuickInningBatting {
  playerId: string; // mirrors InningBatting.playerId
  player: {
    user: {
      name: string;
      username: string;
    };
    userId: string;
  };
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  dots: number;
  isOut: boolean;
  dismissalType?: WicketType;
  bowlerId?: string; // who took the wicket
  fielderId?: string;
}

// ─── Bowling stats per player per inning ──────────────────────────────────

export interface QuickInningBowling {
  playerId: string;
  player: {
    user: {
      name: string;
      username: string;
    };
    userId: string;
  };
  runs: number;
  balls: number;
  overs: number;
  wides: number;
  maidens: number;
  noBalls: number;
  wickets: number;
}

// ─── A player on a quick-match team ───────────────────────────────────────

export interface QuickPlayer {
  id: string; // locally generated UUID
  name: string;
}

// ─── A team ───────────────────────────────────────────────────────────────

export interface QuickTeam {
  id: string; // locally generated UUID
  name: string;
  abbreviation: string;
  players: QuickPlayer[];
}

// ─── An innings ───────────────────────────────────────────────────────────

export interface QuickInning {
  id: string; // locally generated UUID
  inningNumber: 1 | 2;
  matchId: string;
  battingTeamId: string;
  bowlingTeamId: string;

  // Live counters — updated after every ball
  runs: number;
  wickets: number;
  balls: number; // total legal balls faced (0-totalOvers*6)
  overs: number; // completed overs (incremented every 6 legal balls)

  // Current players on crease / bowling
  currentStrikerId: string | null;
  currentNonStrikerId: string | null;
  currentBowlerId: string | null;

  // Per-player stats
  batting: QuickInningBatting[];
  bowling: QuickInningBowling[];

  // Ball-by-ball history for the full innings
  balls_history: QuickBall[];
}

// ─── Toss ─────────────────────────────────────────────────────────────────

export interface QuickToss {
  winnerId: string;
  decision: "BAT" | "BOWL";
}

// ─── Match status — mirrors Prisma MatchStatus ────────────────────────────

export type QuickMatchStatus =
  | "not_started"
  | "in_progress"
  | "inning_completed"
  | "completed"
  | "stopped";

// ─── The root QuickMatch object ───────────────────────────────────────────
//
// This is what lives in localStorage under the key `scordo_quick_matches`.
// Every scoring update overwrites this entry.

export interface QuickMatch {
  id: string; // `qm_${nanoid()}` — used as the URL slug
  version: 2; // bump this if the schema changes; storage layer migrates

  // Setup
  teamA: QuickTeam;
  teamB: QuickTeam;
  overs: number;
  overLimit: number; // max overs any one bowler can bowl
  playerLimit: number; // players per side (typically 11)
  category: "T10" | "T20" | "ODI" | "Test" | "others";
  location: string;
  venue: { city: string; state: string; country: string };
  date: string; // ISO date string
  commentaryEnabled: boolean;

  // State
  status: QuickMatchStatus;
  toss?: QuickToss;
  innings: QuickInning[];

  // Result
  result?: string;
  winnerId?: string;

  createdAt: string;
  updatedAt: string;
}

// ─── Creation payload (form → storage) ───────────────────────────────────

export interface CreateQuickMatchPayload {
  teamAName: string;
  teamBName: string;
  teamAPlayers: { name: string; isCaptain: boolean; isWicketkeeper: boolean }[];
  teamBPlayers: { name: string; isCaptain: boolean; isWicketkeeper: boolean }[];
  overs: number;
  overLimit: number;
  playerLimit: number;
  category: "T10" | "T20" | "ODI" | "Test" | "others";
  location: string;
  venue: { city: string; state: string; country: string };
  date: string;
  commentaryEnabled: boolean;
}

export interface QuickBallInput {
  inningId: string;
  matchId: string;
  runs: number;
  batsmanId: string;
  isWide?: boolean;
  isNoBall?: boolean;
  isBye?: boolean;
  isLegBye?: boolean;
  isWicket?: boolean;
  dismissalType?: WicketType;
  fielderId?: string;
  nextBatsmanId?: string;
  outBatsmanId?: string;
  isLastWicket?: boolean;
  shotSide?: ShotSide | null;
  shotType?: ShotType | null;
}
