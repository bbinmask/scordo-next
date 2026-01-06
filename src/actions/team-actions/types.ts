import { z } from "zod";
import { Team } from "@/generated/prisma";

import { ActionState } from "@/lib/create-safe-action";
import { CreateTeam, UpdateLogoAndBanner, UpdateTeam } from "./schema";

export type InputTypeForUpdateTeam = z.infer<typeof UpdateTeam>;
export type ReturnTypeForUpdateTeam = ActionState<InputTypeForUpdateTeam, Team>;

export type InputTypeForLogoAndBanner = z.infer<typeof UpdateLogoAndBanner>;
export type ReturnTypeForLogoAndBanner = ActionState<InputTypeForLogoAndBanner, Team>;
export type InputType = z.infer<typeof CreateTeam>;
export type ReturnType = ActionState<InputType, Team>;
