import { Ball, CommentaryEventType } from "@/generated/prisma";

export type ShotSide =
  | "covers"
  | "point"
  | "third-man"
  | "fine-leg"
  | "square-leg"
  | "mid-wicket"
  | "mid-on"
  | "mid-off"
  | "long-on"
  | "straight"
  | "long-off";

export type BallType =
  | "YORKER"
  | "FULL"
  | "GOOD_LENGTH"
  | "SHORT"
  | "BOUNCER"
  | "SLOWER"
  | "LEG_SPIN"
  | "OFF_SPIN"
  | "GOOGLY"
  | "FLIPPER"
  | "INSWING"
  | "OUTSWING"
  | "REVERSE_SWING";

export type ShotType =
  | "DRIVE"
  | "CUT"
  | "PULL"
  | "HOOK"
  | "FLICK"
  | "GLANCE"
  | "DEFENSE"
  | "LOFTED"
  | "SWEEP"
  | "REVERSE_SWEEP"
  | "UPPER_CUT"
  | "LEAVE";

export type MilestoneType = "FIFTY" | "CENTURY" | "HAT_TRICK";
export type SpecialEventType =
  | "BACK_TO_BACK_FOURS"
  | "BACK_TO_BACK_SIXES"
  | "MULTIPLE_BOUNDARIES"
  | "MAIDEN_OVER"
  | "LAST_WICKET"
  | "MATCH_WIN";

export interface CommentaryPayload {
  eventType: CommentaryEventType;
  ball: Ball | null;
  batterName?: string;
  bowlerName?: string;
  fielderName?: string;
  shotSide?: ShotSide;
  shotType?: ShotType;
  // Match context
  overContext?: string; // e.g. "over 14.3"
  teamScore?: string; // e.g. "124/3"
  target?: number;
  runsNeeded?: number;
  ballsLeft?: number;
  inningNumber?: number;

  milestoneType?: MilestoneType;
  milestoneValue?: number;
  specialEvent?: SpecialEventType;
}
export interface CommentaryLine {
  id: string;
  text: string;
  label: string;
  eventType: CommentaryEventType;
  timestamp: Date;
}
