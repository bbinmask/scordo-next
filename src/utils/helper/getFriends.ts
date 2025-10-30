import { User } from "@/generated/prisma";
import { FriendshipWithBoth } from "@/lib/types";

export const getFriends = (friendships: FriendshipWithBoth[], userId: string): User[] => {
  if (friendships.length === 0) return [];

  const friends = friendships.map((fr) => {
    if (fr.addresseeId === userId) return fr.requester;
    else return fr.addressee;
  });
  return friends;
};
