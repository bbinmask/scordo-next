import z from "zod";
import { AddOfficials, CreateMatch, Request, RemoveOfficial } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Match, MatchOfficial } from "@/generated/prisma";

export type InputTypeForCreate = z.infer<typeof CreateMatch>;
export type ReturnTypeForCreate = ActionState<InputTypeForCreate, Match>;

export type InputTypeForOfficials = z.infer<typeof AddOfficials>;
export type ReturnTypeForOfficials = ActionState<InputTypeForOfficials, MatchOfficial[]>;

export type InputTypeForRemove = z.infer<typeof RemoveOfficial>;
export type ReturnTypeForRemove = ActionState<InputTypeForRemove, any>;

export type InputTypeForRequest = z.infer<typeof Request>;
export type ReturnTypeForRequest = ActionState<InputTypeForRequest, any>;
