import { db } from "@/lib/db";
import PersonalDetails from "./_components/PersonalDetails";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { getFriends } from "@/utils/helper/getFriends";

export interface ProfileFormData {
  newUsername: string;
  newName: string;
  newEmail: string;
  newPhone: string;
}

const ProfilePage = async () => {
  const clerkUser = await currentUser();

  const user = await db.user.findUnique({
    where: { clerkId: clerkUser?.id },
  });

  if (!user) {
    return notFound();
  }

  const friendRequests = await db.friendship.findMany({
    where: {
      addresseeId: user.id,
      status: "PENDING",
    },
  });

  const friendships = await db.friendship.findMany({
    where: {
      OR: [{ addresseeId: user.id }, { requesterId: user.id }],
      status: "ACCEPTED",
    },
    include: {
      requester: true,
      addressee: true,
    },
  });

  const friends = getFriends(friendships, user.id);

  const teams = await db.team.findMany({
    where: {
      players: {
        some: {
          userId: user.id,
        },
      },
    },
  });

  const teamRequests = await db.teamRequest.findMany({
    where: {
      toId: user.id,
    },
    include: {
      team: true,
      from: true,
    },
  });
  const tournaments = await db.tournament.findMany({
    where: {
      participatingTeams: {
        some: {
          team: {
            players: {
              some: {
                userId: user.id,
              },
            },
          },
        },
      },
    },
  });

  const tournamentRequests = await db.tournamentRequest.findMany({
    where: {
      AND: [
        { status: "pending" },
        {
          team: {
            players: {
              some: {
                userId: user.id,
              },
            },
          },
        },
      ],
    },
  });

  console.log({ friendRequests, tournamentRequests, teamRequests });

  return (
    <div className="font-inter container mx-auto min-h-screen p-4">
      <PersonalDetails
        user={user}
        requests={{ friendRequests, tournamentRequests, teamRequests }}
        friends={friends}
      />
    </div>
  );
};

export default ProfilePage;
