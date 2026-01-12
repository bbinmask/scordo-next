import { z } from "zod";
import { InviteUserToTeam } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { TeamRequest } from "@/generated/prisma";

export type InputInviteUserToTeam = z.infer<typeof InviteUserToTeam>;
export type ReturnInviteUserToTeam = ActionState<InputInviteUserToTeam, TeamRequest>;
