import { z } from "zod";
import { message } from "@/constants";

export const CreateTeam = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
  abbreviation: z
    .string({ message: "Abbreviation is required!" })
    .min(2, { message: "Abbreviation must be atleast 2 characters long" }),
  address: z.object({
    city: z.string({ message: "City is required" }).min(2),
    state: z.string({ message: "State is required" }).min(2),
    country: z.string({ message: "Country is required" }).min(2),
  }),
  type: z.enum(["local", "club", "college", "corporate", "others"]).default("others"),
});

export const UpdateTeam = CreateTeam.extend({
  id: z.string({ message }),
  updatedAt: z.date().optional(),
});

export const UpdateLogoAndBanner = z.object({
  logo: z.file().optional(),
  banner: z.file().optional(),
  abbreviation: z.string({ message }),
  id: z.string({ message }),
});

export const UpdateRecruiting = z.object({
  recruiting: z.boolean({ message }),
  abbreviation: z.string({ message }),
});

export const AcceptRequest = z.object({
  fromId: z.string({ message }),
  teamId: z.string({ message }),
  reqId: z.string({ message }),
});

export const SendRequest = z.object({
  teamId: z.string({ message }),
});

export const DeclineRequest = z.object({
  reqId: z.string({ message }),
});
