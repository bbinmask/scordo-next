import { z } from "zod";

export const Query = z.object({
  q: z.string({ error: "Query cannot be empty" }).min(3, "Type minimum 3 letters"),
  filter: z.enum(["all", "users", "teams", "tournaments"]).default("all"),
});
