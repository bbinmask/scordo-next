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

  console.log(user);

  if (!user) {
    return notFound();
  }

  return (
    <div className="font-inter container mx-auto min-h-screen p-4">
      <PersonalDetails user={user} />
    </div>
  );
};

export default ProfilePage;
