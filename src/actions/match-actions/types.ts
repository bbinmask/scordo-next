import z from "zod";
import {
  AddOfficials,
  CreateMatch,
  Request,
  RemoveOfficial,
  InitializeMatch,
  PushBall,
} from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Ball, Match, MatchOfficial } from "@/generated/prisma";

export type InputTypeForCreate = z.infer<typeof CreateMatch>;
export type ReturnTypeForCreate = ActionState<InputTypeForCreate, Match>;

export type InputTypeForOfficials = z.infer<typeof AddOfficials>;
export type ReturnTypeForOfficials = ActionState<InputTypeForOfficials, MatchOfficial[]>;

export type InputTypeForRemove = z.infer<typeof RemoveOfficial>;
export type ReturnTypeForRemove = ActionState<InputTypeForRemove, any>;

export type InputTypeForRequest = z.infer<typeof Request>;
export type ReturnTypeForRequest = ActionState<InputTypeForRequest, any>;

export type InputTypeForInitializeMatch = z.infer<typeof InitializeMatch>;
export type ReturnTypeForInitialieMatch = ActionState<InputTypeForInitializeMatch, any>;

export type InputTypeForPushBall = z.infer<typeof PushBall>;
export type ReturnTypeForPushBall = ActionState<InputTypeForPushBall, Ball>;
