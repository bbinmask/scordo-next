"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import {
  InputType,
  InputTypeForAccept,
  InputTypeForLogoAndBanner,
  InputTypeForRecruiting,
  InputTypeForUpdateTeam,
  ReturnType,
  ReturnTypeForAccept,
  ReturnTypeForLogoAndBanner,
  ReturnTypeForRecruiting,
  ReturnTypeForUpdateTeam,
} from "./types";
import { auth } from "@clerk/nextjs/server";
import { createSafeAction } from "@/lib/create-safe-action";
import {
  AcceptRequest,
  CreateTeam,
  UpdateLogoAndBanner,
  UpdateRecruiting,
  UpdateTeam,
} from "./schema";
import { uploadImage } from "@/utils/uploadOnCloudinary";
import { Player, User } from "@/generated/prisma";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/currentUser";

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

const acceptReqHandler = async (data: InputTypeForAccept): Promise<ReturnTypeForAccept> => {
  const { fromId, reqId, teamId } = data;

  const user = await currentUser();

  if (!user)
    return {
      error: "Unauthorized request!",
    };

  let request, team, player: Player | null;

  try {
    team = await db.team.findUnique({
      where: {
        id: teamId,
      },
      include: {
        players: true,
      },
    });

    if (team?.ownerId !== user.id)
      return {
        error: "Only owner can accept",
      };

    player = await db.player.findFirst({
      where: {
        userId: fromId,
      },
    });

    if (!player)
      return {
        error: `The use is not a player!`,
      };

    if (team.players.findIndex((pl) => pl.id === player?.id))
      return {
        error: "Player is already in the team!",
      };

    team.players.push(player);

    request = await db.teamRequest.delete({
      where: {
        id: reqId,
      },
    });
  } catch (error: any) {
    return {
      error: error.message,
    };
  }

  revalidatePath(`/teams/${team.abbreviation}`);

  return { data: team };
};

export const createTeam = createSafeAction(CreateTeam, createTeamHandler);
export const updateTeam = createSafeAction(UpdateTeam, teamUpdateHandler);
export const updateTeamLogoAndBanner = createSafeAction(
  UpdateLogoAndBanner,
  logoAndBannerUpdateHandler
);
export const updateRecruiting = createSafeAction(UpdateRecruiting, recruitingUpdateHanlder);

export const acceptRequest = createSafeAction(AcceptRequest, acceptReqHandler);
