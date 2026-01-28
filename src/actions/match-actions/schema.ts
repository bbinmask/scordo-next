import z from "zod";
import { message } from "@/constants";

export const CreateMatch = z.object({
  teamAId: z.string({ message }),
  teamBId: z.string({ message }),
  tournamentId: z.string({ message }).optional(),
  overs: z.number({ message }),
  overLimit: z.number({ message }),
  venue: z.object({
    city: z.string({ message }),
    state: z.string({ message }),
    country: z.string({ message }),
  }),
  tossWinner: z.string({ message }),
  tossDecision: z.string({ message }),
  category: z.enum(["T10", "T20", "ODI", "Test", "others"]),
  date: z.date({ message }),
  location: z.string({ message }),
  matchOfficials: z.array(
    z.object({ role: z.enum(["SCORER", "UMPIRE", "COMMENTATOR"]), userId: z.string({ message }) })
  ),
});
