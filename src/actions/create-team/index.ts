"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { auth } from "@clerk/nextjs/server";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateTeam } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  const { name, abbreviation, address, logo, banner, isRecruiting, type } = data;

  let team;

  try {
    team = await db.team.create({
      data: {
        name,
        abbreviation,
        address,
        logo,
        banner,
        isRecruiting,
        type,
        owner: userId,
      },
    });
  } catch (error: any) {
    return {
      error: error.message || "Failed to create",
    };
  }

  revalidatePath(`/teams/${team.id}`);
  return { data: team };
};

export const createBoard = createSafeAction(CreateTeam, handler);
