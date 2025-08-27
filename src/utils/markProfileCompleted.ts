import { currentUser, clerkClient } from "@clerk/nextjs/server";

export async function markProfileComplete(userId: string) {
  const client = await clerkClient();

  client.users.updateUserMetadata(userId, {
    publicMetadata: {
      isProfileComplete: true,
    },
  });
}
