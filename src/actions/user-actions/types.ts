import { z } from "zod";
import { User } from "@/generated/prisma";

import { ActionState } from "@/lib/create-safe-action";
import { RecievedRequest, CreateUser, SentRequest, UpdateUserDetails } from "./schema";

export type InputCreateUserType = z.infer<typeof CreateUser>;
export type ReturnCreateUserType = ActionState<InputCreateUserType, User>;

export type InputSentRequestType = z.infer<typeof SentRequest>;
export type ReturnSentRequestType = ActionState<InputSentRequestType, any>;

export type InputRecievedRequestType = z.infer<typeof RecievedRequest>;
export type ReturnAcceptRequestType = ActionState<InputRecievedRequestType, any>;

export type InputTypeForUpdateUserDetails = z.infer<typeof UpdateUserDetails>;
