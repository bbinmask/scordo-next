import { z } from "zod";

export const CreateUser = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
  contact: z.string().optional(),
  email: z.string({ message: "Email is required!" }),
  username: z
    .string({ message: "username is required!" })
    .min(2, { message: "username must be atleast 2 characters long" }),
  address: z
    .object({
      city: z.string(),
      state: z.string(),
      country: z.string(),
    })
    .optional(),
  gender: z.enum(["male", "female", "other"]).nullable().default(null).optional(),
  role: z.enum(["fan", "admin", "player"]).default("fan").optional(),
  dob: z.date(),
  availability: z.enum(["available", "injured", "on_break"]).default("available"),
});

export const SentRequest = z.object({
  addresseeId: z.string({ error: "AddresseeId is required" }),
  username: z.string({ error: "Required parameter is missing" }),
});

export const RecievedRequest = z.object({
  reqId: z.string({ error: "Request Id is required" }),
  reqUsername: z.string({ error: "Username is required" }),
});

export const CreatePlayer = z.object({});
