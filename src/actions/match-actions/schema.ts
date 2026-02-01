import z from "zod";
import { message } from "@/constants";

export const CreateMatch = z.object({
  teamAId: z.string({ message }),
  teamBId: z.string({ message }),
  overs: z.number({ message }),
  overLimit: z.number({ message }),
  venue: z.object({
    city: z.string({ message }),
    state: z.string({ message }),
    country: z.string({ message }),
  }),
  tournamentId: z.string({ message }).optional(),
  tossWinner: z.string({ message }).optional(),
  tossDecision: z.string({ message }).optional(),
  category: z.enum(["T10", "T20", "ODI", "Test", "others"]),
  date: z.string({ message }),
  location: z.string({ message }).optional(),
  matchOfficials: z
    .array(
      z.object({
        role: z.enum(["SCORER", "UMPIRE", "COMMENTATOR"]),
        name: z.string({ message }),
        userId: z.string({ message }),
      })
    )
    .optional(),
});

export const AddOfficials = z.object({
  matchOfficials: z.array(
    z.object({
      role: z.enum(["SCORER", "UMPIRE", "COMMENTATOR"]),
      name: z.string({ message }),
      userId: z.string({ message }),
    })
  ),
  matchId: z.string({ message }),
});
