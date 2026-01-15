import { z } from "zod";
import { AcceptRequest, DeclineRequest, InviteUserToTeam } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Team, TeamRequest } from "@/generated/prisma";

export type InputInviteUserToTeam = z.infer<typeof InviteUserToTeam>;
export type ReturnInviteUserToTeam = ActionState<InputInviteUserToTeam, TeamRequest>;

export type InputTypeForAccept = z.infer<typeof AcceptRequest>;
export type ReturnTypeForAccept = ActionState<InputTypeForAccept, Team>;

export type InputTypeForDecline = z.infer<typeof DeclineRequest>;
export type ReturnTypeForDecline = ActionState<InputTypeForDecline, Team>;
