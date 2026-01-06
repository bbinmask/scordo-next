"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import {
  InputType,
  InputTypeForLogoAndBanner,
  InputTypeForRecruiting,
  InputTypeForUpdateTeam,
  ReturnType,
  ReturnTypeForLogoAndBanner,
  ReturnTypeForRecruiting,
  ReturnTypeForUpdateTeam,
} from "./types";
import { auth } from "@clerk/nextjs/server";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateTeam, UpdateLogoAndBanner, UpdateRecruiting, UpdateTeam } from "./schema";
import { uploadImage } from "@/utils/uploadOnCloudinary";
import { User } from "@/generated/prisma";
import { redirect } from "next/navigation";
import { getTeamUrl } from "@/utils/getURL";

const createTeamHandler = async (data: InputType): Promise<ReturnType> => {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return { error: "Unauthorized" };
  }

  const { name, abbreviation, address, type } = data;

  let user: User | null = null;
  try {
    user =
      (await db?.user.findUnique({
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

  let team;
  try {
    team = await db.team.create({
      data: {
        name,
        abbreviation: abbreviation.toLowerCase(),
        address,
        isRecruiting: false,
        captain: { connect: { id: user.id } },
        players: {
          create: {
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        },
        type,
        owner: {
          connect: { id: user.id },
        },
      },
    });

    if (!team)
      return {
        error: "Failed to create team",
      };
  } catch (error: any) {
    return {
      error: error.message || "Failed to create",
    };
  }

  redirect(`/teams/${team.abbreviation}`);
};

const teamUpdateHandler = async (
  data: InputTypeForUpdateTeam
): Promise<ReturnTypeForUpdateTeam> => {
  const { name, abbreviation, address, type, id } = data;
  let user: User | null = null;
  let team;

  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return { error: "Unauthorized" };
    }
    user =
      (await db?.user.findUnique({
        where: {
          clerkId,
        },
      })) ?? null;
  } catch (error: any) {
    return {
      error: error.message || "User not found!",
    };
  }
  try {
    if (!user) {
      return {
        error: "User not found!",
      };
    }

    team = await db?.team.update({
      where: {
        id: id,
      },
      data: {
        name,
        abbreviation,
        address,
        type,
      },
    });
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
  revalidatePath(`/teams/${abbreviation}`);
  return {
    data: team,
  };
};

const logoAndBannerUpdateHandler = async (
  data: InputTypeForLogoAndBanner
): Promise<ReturnTypeForLogoAndBanner> => {
  const { logo, banner, id, abbreviation } = data;

  let logoUrl, bannerUrl, team;

  if (logo) {
    logoUrl = (await uploadImage(logo, "team-logo")).imageUrl;
  }
  if (banner) {
    bannerUrl = (await uploadImage(banner, "team-banner")).imageUrl;
  }

  try {
    team = await db.team.update({
      where: {
        id,
      },
      data: {
        logo: logoUrl as string,
        banner: bannerUrl as string,
      },
    });
  } catch (error: any) {
    return { error: error.message };
  }

  revalidatePath(`/teams/${abbreviation}`);

  return { data: team };
};

const recruitingUpdateHanlder = async (
  data: InputTypeForRecruiting
): Promise<ReturnTypeForRecruiting> => {
  const { userId: clerkId } = await auth();
  if (!clerkId) return { error: "Unauthorized" };

  const { abbreviation, recruiting } = data;

  if (!abbreviation || !recruiting) {
    return {
      error: "Required paramter is missing!",
    };
  }

  let team;

  try {
    team = await db.team.update({
      where: { abbreviation },
      data: {
        isRecruiting: recruiting,
      },
    });
  } catch (error: any) {
    return { error: error.message };
  }

  revalidatePath(`/teams/${abbreviation}`);

  return { data: team };
};

export const createTeam = createSafeAction(CreateTeam, createTeamHandler);
export const updateTeam = createSafeAction(UpdateTeam, teamUpdateHandler);
export const updateTeamLogoAndBanner = createSafeAction(
  UpdateLogoAndBanner,
  logoAndBannerUpdateHandler
);

export const updateRecruiting = createSafeAction(UpdateRecruiting, recruitingUpdateHanlder);
