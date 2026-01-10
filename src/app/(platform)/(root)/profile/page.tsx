import { db } from "@/lib/db";
import PersonalDetails from "./_components/PersonalDetails";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { getFriendRequests, getFriends } from "@/utils/helper/getFriends";

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

  const friendReqs = await db.friendship.findMany({
    where: {
      addresseeId: user.id,
      status: "PENDING",
    },
    include: {
      requester: true,
      addressee: true,
    },
  });

  const friendships = await db.friendship.findMany({
    where: {
      OR: [{ addresseeId: user.id }, { requesterId: user.id }],
    },
    include: {
      requester: true,
      addressee: true,
    },
  });

  console.log({ friendReqs, friendships });

  const friends = getFriends(friendships, user.id);

  const friendRequests: any = getFriendRequests(friendReqs, user.id);

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
    include: {
      tournament: true,
      team: true,
    },
  });

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
