import { z } from "zod";
import { message } from "@/constants";
export const InviteUserToTeam = z.object({
  username: z.string({ message }),
  toId: z.string({ message }),
  teamId: z.string({ message }),
});
