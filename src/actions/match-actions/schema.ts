import z from "zod";
import { errorMessage, message } from "@/constants";

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
  playerLimit: z.number({ message }),
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

export const RemoveOfficial = z.object({
  id: z.string({ message }),
});

export const Request = z.object({
  id: z.string({ message }),
});

export const InitializeMatch = z.object({
  matchId: z.string({ message }),
  tossWinnerId: z.string({ message }),
  strikerId: z.string({ message }),
  nonStrikerId: z.string({ message }),
  bowlerId: z.string({ message }),
  tossDecision: z.enum(["BAT", "BOWL"]),
  teamAPlayerIds: z.array(
    z.object({
      id: z.string({ message }),
      userId: z.string({ message }),
    })
  ),
  teamBPlayerIds: z.array(
    z.object({
      id: z.string({ message }),
      userId: z.string({ message }),
    })
  ),
});

export const PushBall = z
  .object({
    matchId: z.string({ message: errorMessage("matchId") }),
    inningId: z.string({ message: errorMessage("inningId") }),
    runs: z.number({ message: errorMessage("runs") }),
    batsmanId: z.string({ message: errorMessage("batsmanId") }),
    isWide: z.boolean({ message: errorMessage("isWide") }).optional(),
    isNoBall: z.boolean({ message: errorMessage("isNoBall") }).optional(),
    isBye: z.boolean({ message: errorMessage("isBye") }).optional(),
    isLegBye: z.boolean({ message: errorMessage("isLegBye") }).optional(),
    isWicket: z.boolean({ message: errorMessage("isWicket") }).optional(),
    nextBatsmanId: z.string().optional(),
    outBatsmanId: z.string({ message: errorMessage("nextBatsmanId") }).optional(),
    dismissalType: z
      .enum(["BOWLED", "CAUGHT", "RUN_OUT", "LBW", "STUMPED", "HIT_WICKET"])
      .optional(),
    fielderId: z.string().optional(),
    isLastWicket: z.boolean().optional().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.isWicket) {
      if (!data.fielderId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["fielderId"],
          message: errorMessage("fielderId is required when wicket falls"),
        });
      } else if (!data.dismissalType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["dismissalType"],
          message: errorMessage("dismissal is required when wicket falls"),
        });
      } else if (!data.nextBatsmanId && !data.isLastWicket) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["nextBatsmanId"],
          message: errorMessage("nextBatsmanId is required when wicket falls"),
        });
      } else if (data.dismissalType === "RUN_OUT" && !data.outBatsmanId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["outBatsmanId"],
          message: errorMessage("outBatsmanId is required when wicket falls"),
        });
      }
    }
  });

export const ChangeBowler = z.object({
  inningId: z.string({ message: errorMessage("inningId") }),
  matchId: z.string({ message: errorMessage("matchId") }),
  bowlerId: z.string({ message: errorMessage("bowlerId") }),
});
