import { z } from "zod";
import { message } from "@/constants";
export const InviteUserToTeam = z.object({
  username: z.string({ message }),
  toId: z.string({ message }),
  teamId: z.string({ message }),
});

export const AcceptRequest = z.object({
  fromId: z.string({ message }),
  teamId: z.string({ message }),
  reqId: z.string({ message }),
});
