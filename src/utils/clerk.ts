import { clerkClient } from "@clerk/nextjs/server";

export async function customClerkMetadata(
  userId: string,
  key: string,
  value: string | number | boolean
) {
  const clerk = await clerkClient();

  await clerk.users.updateUserMetadata(userId, {
    publicMetadata: {
      [key]: value,
    },
  });

  return new Response("ok");
}
