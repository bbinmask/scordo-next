import { z } from "zod";
import { User } from "@/generated/prisma";

import { ActionState } from "@/lib/create-safe-action";
import { CreateUser } from "./schema";

export type InputType = z.infer<typeof CreateUser>;
export type ReturnType = ActionState<InputType, User>;
