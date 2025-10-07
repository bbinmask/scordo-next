import { z } from "zod";
import { User } from "@/generated/prisma";

import { ActionState } from "@/lib/create-safe-action";
import { CreateUser, SendRequest } from "./schema";

export type InputCreateUserType = z.infer<typeof CreateUser>;
export type ReturnCreateUserType = ActionState<InputCreateUserType, User>;

export type InputSendRequestType = z.infer<typeof SendRequest>;
export type ReturnSendRequestType = ActionState<InputSendRequestType, any>;
