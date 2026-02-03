import { z } from "zod";
import { Team, TeamRequest } from "@/generated/prisma";

import { ActionState } from "@/lib/create-safe-action";
import {
  AcceptRequest,
  OwnerAction,
  CreateTeam,
  DeclineRequest,
  LeaveTeam,
  SendRequest,
  UpdateLogoAndBanner,
  UpdateRecruiting,
  UpdateTeam,
  WidthdrawRequest,
} from "./schema";

export type InputTypeForUpdateTeam = z.infer<typeof UpdateTeam>;
export type ReturnTypeForUpdateTeam = ActionState<InputTypeForUpdateTeam, Team>;

export type InputTypeForLogoAndBanner = z.infer<typeof UpdateLogoAndBanner>;
export type ReturnTypeForLogoAndBanner = ActionState<InputTypeForLogoAndBanner, Team>;
export type InputTypeForCreateTeam = z.infer<typeof CreateTeam>;
export type ReturnTypeForCreateTeam = ActionState<InputType, Team>;

export type InputTypeForRecruiting = z.infer<typeof UpdateRecruiting>;
export type ReturnTypeForRecruiting = ActionState<InputTypeForRecruiting, Team>;

export type InputTypeForAccept = z.infer<typeof AcceptRequest>;
export type ReturnTypeForAccept = ActionState<InputTypeForAccept, Team>;

export type InputTypeForLeave = z.infer<typeof LeaveTeam>;
export type ReturnTypeForLeave = ActionState<InputTypeForLeave, Team>;

export type InputTypeForWidthdraw = z.infer<typeof WidthdrawRequest>;
export type ReturnTypeForWidthdraw = ActionState<InputTypeForWidthdraw, boolean>;

export type InputTypeForSend = z.infer<typeof SendRequest>;
export type ReturnTypeForSend = ActionState<InputTypeForSend, TeamRequest>;

export type InputTypeForDecline = z.infer<typeof DeclineRequest>;
export type ReturnTypeForDecline = ActionState<InputTypeForDecline, Team>;

export type InputTypeForOwnerAction = z.infer<typeof OwnerAction>;
export type ReturnTypeForOwnerAction = ActionState<InputTypeForOwnerAction, Team>;
