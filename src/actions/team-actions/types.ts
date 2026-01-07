import { z } from "zod";
import { Team, TeamRequest } from "@/generated/prisma";

import { ActionState } from "@/lib/create-safe-action";
import {
  AcceptRequest,
  CreateTeam,
  DeclineRequest,
  SendRequest,
  UpdateLogoAndBanner,
  UpdateRecruiting,
  UpdateTeam,
} from "./schema";
import { TeamRequestWithDetails } from "@/lib/types";

export type InputTypeForUpdateTeam = z.infer<typeof UpdateTeam>;
export type ReturnTypeForUpdateTeam = ActionState<InputTypeForUpdateTeam, Team>;

export type InputTypeForLogoAndBanner = z.infer<typeof UpdateLogoAndBanner>;
export type ReturnTypeForLogoAndBanner = ActionState<InputTypeForLogoAndBanner, Team>;
export type InputType = z.infer<typeof CreateTeam>;
export type ReturnType = ActionState<InputType, Team>;

export type InputTypeForRecruiting = z.infer<typeof UpdateRecruiting>;
export type ReturnTypeForRecruiting = ActionState<InputTypeForRecruiting, Team>;

export type InputTypeForAccept = z.infer<typeof AcceptRequest>;
export type ReturnTypeForAccept = ActionState<InputTypeForAccept, Team>;

export type InputTypeForSend = z.infer<typeof SendRequest>;
export type ReturnTypeForSend = ActionState<InputTypeForSend, TeamRequest>;
export type InputTypeForDecline = z.infer<typeof DeclineRequest>;
export type ReturnTypeForDecline = ActionState<InputTypeForDecline, Team>;
