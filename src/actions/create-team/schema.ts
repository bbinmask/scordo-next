import { z } from "zod";

export const CreateTeam = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
  logo: z.string().optional(),
  banner: z.string().optional(),
  abbreviation: z
    .string({ message: "Abbreviation is required!" })
    .min(2, { message: "Abbreviation must be atleast 2 characters long" }),
  address: z.object({
    city: z.string({ message: "City is required" }).min(2),
    state: z.string({ message: "State is required" }).min(2),
    country: z.string({ message: "Country is required" }).min(2),
  }),
  type: z.enum(["local", "club", "college", "corporate", "others"]).optional(),
  isRecruiting: z.boolean().default(false),
});
// players
// type
// owner
// isRecruiting
// captain
