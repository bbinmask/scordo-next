import { z } from "zod";
import { message } from "@/constants";
export const InviteUserToTeam = z.object({
  username: z.string({ message }),
  fromId: z.string({ message }),
  teamId: z.string({ message }),
});

export const AcceptRequest = z.object({
  teamId: z.string({ message }),
  reqId: z.string({ message }),
  fromId: z.string({}),
});

export const DeclineRequest = z.object({
  id: z.string({ message }),
  teamId: z.string({ message }),
});
