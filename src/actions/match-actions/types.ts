import z from "zod";
import { CreateMatch } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Match } from "@/generated/prisma";

export type InputTypeForCreate = z.infer<typeof CreateMatch>;
export type ReturnTypeForCreate = ActionState<InputTypeForCreate, Match>;
