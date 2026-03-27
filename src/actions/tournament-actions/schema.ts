import { z } from "zod";

const message = "This field is required";

export const CreateTournament = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  totalOvers: z.number({ message }).min(1).max(100),
  maxTeams: z.number({ message }).min(2).max(64),
  matchesPerTeam: z.number({ message }).min(1),
  minAge: z.number().optional(),
  maxAge: z.number().optional(),
  winnerPrice: z.number().optional(),
  runnerUpPrice: z.number().optional(),
  entryFee: z.number().optional(),
  halfBoundary: z.boolean().default(false),
  startDate: z.string({ message }),
  endDate: z.string({ message }),
  rules: z.array(z.string()).default([]),
  location: z
    .object({
      city: z.string().min(1),
      state: z.string().min(1),
      country: z.string().min(1),
    })
    .optional(),
});
