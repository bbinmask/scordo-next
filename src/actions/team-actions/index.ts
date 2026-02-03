"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import {
  InputType,
  InputTypeForAccept,
  InputTypeForOwnerAction,
  InputTypeForLeave,
  InputTypeForLogoAndBanner,
  InputTypeForRecruiting,
  InputTypeForSend,
  InputTypeForUpdateTeam,
  InputTypeForWidthdraw,
  ReturnType,
  ReturnTypeForAccept,
  ReturnTypeForOwnerAction,
  ReturnTypeForLeave,
  ReturnTypeForLogoAndBanner,
  ReturnTypeForRecruiting,
  ReturnTypeForSend,
  ReturnTypeForUpdateTeam,
  ReturnTypeForWidthdraw,
} from "./types";
import { auth } from "@clerk/nextjs/server";
import { createSafeAction } from "@/lib/create-safe-action";
import {
  AcceptRequest,
  OwnerAction,
  CreateTeam,
  LeaveTeam,
  SendRequest,
  UpdateLogoAndBanner,
  UpdateRecruiting,
  UpdateTeam,
  WidthdrawRequest,
} from "./schema";
import { uploadImage } from "@/utils/uploadOnCloudinary";
import { Player, User } from "@/generated/prisma";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/currentUser";

const createTeamHandler = async (data: InputType): Promise<ReturnType> => {
  const user = await currentUser();

  const { name, abbreviation, address, type, logo, banner } = data;

  if (!user) {
    return {
      error: "User not found!",
    };
  }

  let logoUrl, bannerUrl, team;

  if (logo) {
    logoUrl = (await uploadImage(logo, "team-logo")).imageUrl;
  }
  if (banner) {
    bannerUrl = (await uploadImage(banner, "team-banner")).imageUrl;
  }

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
        logo: logoUrl as string,
        banner: bannerUrl as string,
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

const sendRequestHandler = async (data: InputTypeForSend): Promise<ReturnTypeForSend> => {
  const { teamId } = data;

  const user = await currentUser();

  if (!user)
    return {
      error: "Sign in to join the team!",
    };

  let request, team, player;

  try {
    team = await db.team.findUnique({
      where: {
        id: teamId,
      },
    });

    if (!team)
      return {
        error: "Team not found!",
      };

    if (team.ownerId === user.id) {
      player = await db.player.findFirst({
        where: {
          userId: user.id,
          teamId,
        },
      });

      if (player)
        return {
          error: `You are already in the team!`,
        };

      player = await db.player.create({
        data: {
          userId: user.id,
          teamId,
        },
      });
    } else {
      request = await db.teamRequest.create({
        data: {
          fromId: user.id,
          toId: team.ownerId,
          teamId,
        },
      });
    }
  } catch (error: any) {
    return {
      error: error.message,
    };
  }

  revalidatePath(`/teams/${team.abbreviation}`);

  return { data: request };
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
    request = await db.teamRequest.findUnique({
      where: {
        id: reqId,
      },
    });

    if (!request)
      return {
        error: "Request was widthdrawn!",
      };

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
        teamId,
      },
    });

    if (player)
      return {
        error: `You are already in the team!`,
      };

    if (team.players.findIndex((pl) => pl.id === player?.id))
      return {
        error: "Player is already in the team!",
      };

    await db.player.create({
      data: {
        userId: fromId,
        teamId,
      },
    });

    await db.teamRequest.delete({
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

const leaveTeamHandler = async (data: InputTypeForLeave): Promise<ReturnTypeForLeave> => {
  const user = await currentUser();

  if (!user)
    return {
      error: "Sign in required!",
    };

  const { teamId } = data;

  let team, player;

  try {
    team = await db.team.findUnique({
      where: {
        id: teamId,
      },
    });

    if (!team)
      return {
        error: "Team not found!",
      };

    player = await db.player.deleteMany({
      where: {
        teamId,
        userId: user.id,
      },
    });

    team = await db.team.update({
      where: {
        id: teamId,
      },
      data: {
        players: {
          deleteMany: {
            userId: user.id,
          },
        },
      },
    });
  } catch (error) {
    return {
      error: "Something went wrong!",
    };
  }

  revalidatePath(`/teams/${team.abbreviation}`);
  revalidatePath(`/teams`);

  return { data: team };
};

const widthdrawRequestHandler = async (
  data: InputTypeForWidthdraw
): Promise<ReturnTypeForWidthdraw> => {
  const user = await currentUser();

  if (!user)
    return {
      error: "Sign in required!",
    };

  const { teamId, abbr } = data;

  let request;

  try {
    request = await db.teamRequest.deleteMany({
      where: {
        teamId,
        fromId: user.id,
      },
    });
  } catch (error) {
    return {
      error: "Something went wrong!",
    };
  }

  revalidatePath(`/teams/${abbr}`);

  return { data: request.count === 0 ? false : true };
};

const removeFromTeamHandler = async (
  data: InputTypeForOwnerAction
): Promise<ReturnTypeForOwnerAction> => {
  const { playerId, teamId } = data;

  const user = await currentUser();

  if (!user)
    return {
      error: "Unauthorized",
    };

  let team, player;

  try {
    team = await db.team.findUnique({
      where: {
        id: teamId,
      },
    });

    if (!team)
      return {
        error: "Team not found!",
      };

    if (team.ownerId !== user.id && team.captainId !== user.id)
      return {
        error: "Only owner or captain can remove",
      };

    if (playerId === team.ownerId)
      return {
        error: "Owner cannot be removed",
      };

    player = await db.player.deleteMany({
      where: {
        userId: playerId,
        teamId,
      },
    });
  } catch (error) {
    return {
      error: "Something went wrong!",
    };
  }

  revalidatePath(`/teams/${team.abbreviation}`);

  return {
    data: team,
  };
};

const updateCaptainHandler = async (
  data: InputTypeForOwnerAction
): Promise<ReturnTypeForOwnerAction> => {
  const { playerId, teamId } = data;

  const user = await currentUser();

  if (!user)
    return {
      error: "Unauthorized",
    };

  let team;

  try {
    team = await db.team.findUnique({
      where: {
        id: teamId,
      },
    });

    if (!team)
      return {
        error: "Team not found!",
      };

    if (team.ownerId !== user.id)
      return {
        error: "Only owner can change the captain",
      };

    team = await db.team.update({
      where: {
        id: teamId,
      },
      data: {
        captainId: playerId,
      },
    });
  } catch (error) {
    return {
      error: "Something went wrong",
    };
  }

  revalidatePath(`/teams/${team.abbreviation}`);
  return {
    data: team,
  };
};

export const createTeam = createSafeAction(CreateTeam, createTeamHandler);
export const updateTeam = createSafeAction(UpdateTeam, teamUpdateHandler);
export const updateTeamLogoAndBanner = createSafeAction(
  UpdateLogoAndBanner,
  logoAndBannerUpdateHandler
);
export const removeFromTeam = createSafeAction(OwnerAction, removeFromTeamHandler);
export const updateCaptain = createSafeAction(OwnerAction, updateCaptainHandler);
export const updateRecruiting = createSafeAction(UpdateRecruiting, recruitingUpdateHanlder);

export const acceptTeamRequest = createSafeAction(AcceptRequest, acceptReqHandler);
export const sendTeamRequest = createSafeAction(SendRequest, sendRequestHandler);
export const leaveTeam = createSafeAction(LeaveTeam, leaveTeamHandler);
export const widthdrawRequest = createSafeAction(WidthdrawRequest, widthdrawRequestHandler);
