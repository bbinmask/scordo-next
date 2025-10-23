import { z } from "zod";
import { User } from "@/generated/prisma";

import { ActionState } from "@/lib/create-safe-action";
import { CreateUser, FriendRequest } from "./schema";

export type InputCreateUserType = z.infer<typeof CreateUser>;
export type ReturnCreateUserType = ActionState<InputCreateUserType, User>;

export type InputFriendRequestType = z.infer<typeof FriendRequest>;
export type ReturnFriendRequestType = ActionState<InputFriendRequestType, any>;
