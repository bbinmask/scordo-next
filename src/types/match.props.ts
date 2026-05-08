import { Ball, WicketType } from "@/generated/prisma";
import { CommentaryLine } from "@/lib/commentary/types";

export type FallWicket = {
  fielderId: string;
  batsmanId: string;
  nextBatsmanId: string | null;
  type: WicketType;
};

export interface CommentaryItem {
  id: string;
  text: string;
  overContext: string;
  isGenerating?: boolean;
  isSpecial?: boolean;
}

export interface CommentaryWithBall extends CommentaryLine {
  ball: Ball;
}
