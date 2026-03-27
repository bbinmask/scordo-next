import { Tournament } from "@/generated/prisma";
import { ActionState } from "@/lib/create-safe-action";
import { CreateTournament } from "./schema";
import z from "zod";

export type InputTypeForCreate = z.infer<typeof CreateTournament>;
export type ReturnTypeForCreate = ActionState<InputTypeForCreate, Tournament>;
