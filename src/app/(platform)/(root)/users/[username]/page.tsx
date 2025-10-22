import NotFoundParagraph from "@/components/NotFoundParagraph";
import { AboutCard, Description, ProfileCard, StatsCard, TeamsCard } from "./_components/cards";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { currentUser as getCurrentUser } from "@/lib/currentUser";

interface UserIdProps {
  params: Promise<{ username: string }>;
}

const UserIdPage = async ({ params }: UserIdProps) => {
  const { username } = await params;

  if (!username) return notFound();

  const user = await db.user.findUnique({
    where: {
      username,
    },
    include: {
      teamsOwned: true,
    },
  });

  const currentUser = await getCurrentUser();

  if (!user || !currentUser) return notFound();

  return (
    <div className="min-h-[400px] w-full pt-2">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
        <ProfileCard currentUser={currentUser} user={user} />

        <div className="lg:col-span-2">
          <Description user={user} />
        </div>
      </div>
    </div>
  );
};

export default UserIdPage;
