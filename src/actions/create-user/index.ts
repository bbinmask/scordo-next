"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { auth } from "@clerk/nextjs/server";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateTeam } from "./schema";
import { uploadImage } from "@/utils/uploadOnCloudinary";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = await auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  const { name, abbreviation, address, logo, banner, isRecruiting, type } = data;

  let logoUrl, bannerUrl;

  if (logo) {
    logoUrl = (await uploadImage(logo)).imageUrl;
  }
  if (banner) {
    bannerUrl = (await uploadImage(banner)).imageUrl;
  }

  console.log(bannerUrl);

  let team;
  try {
    team = await db.team.create({
      data: {
        name,
        abbreviation,
        address,
        logo: (logoUrl as string) || null,
        banner: (bannerUrl as string) || null,
        isRecruiting,
        type,
        owner: userId,
      },
    });

    console.log(team);
    if (!team)
      return {
        error: "Failed to create team",
      };
  } catch (error: any) {
    console.log(error);
    return {
      error: error.message || "Failed to create",
    };
  }
  revalidatePath(`/teams/${team.id}`);
  return { data: team };
};

export const createTeam = createSafeAction(CreateTeam, handler);
