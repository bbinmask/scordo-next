import { z } from "zod";
import { Team } from "@/generated/prisma";

import { ActionState } from "@/lib/create-safe-action";
import { CreateTeam } from "./schema";

export type InputType = z.infer<typeof CreateTeam>;
export type ReturnType = ActionState<InputType, Team>;
