import { db } from "@/lib/db";
import PersonalDetails from "./_components/PersonalDetails";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

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

  const friends = await db.friendship.findMany({
    where: {
      OR: [{ addresseeId: user.id }, { requesterId: user.id }],
      status: "ACCEPTED",
    },
  });

  const teams = await db.team.findMany({
    where: {
      players: {
        some: {
          userId: user.id,
        },
      },
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

  return (
    <div className="font-inter container mx-auto min-h-screen p-4">
      <PersonalDetails user={user} friendRequests={friendRequests} friends={friends} />
    </div>
  );
};

export default ProfilePage;
