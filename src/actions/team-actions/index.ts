"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { auth } from "@clerk/nextjs/server";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateTeam } from "./schema";
import { uploadImage } from "@/utils/uploadOnCloudinary";
import { User } from "@/generated/prisma";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return { error: "Unauthorized" };
  }

  const { name, abbreviation, address, logo, banner, isRecruiting, type } = data;

  let logoUrl, bannerUrl;

  let user: User | null = null;
  try {
    user =
      (await prisma?.user.findUnique({
        where: {
          clerkId,
        },
      })) ?? null;
  } catch (error: any) {
    return {
      error: error.message || "User not found!",
    };
  }

  if (!user) {
    return {
      error: "User not found!",
    };
  }

  if (logo) {
    logoUrl = (await uploadImage(logo, "team-logo")).imageUrl;
  }
  if (banner) {
    bannerUrl = (await uploadImage(banner, "team-banner")).imageUrl;
  }

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
        captain: user.id,
        players: [user.id],
        type,
        owner: user.id,
      },
    });

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
