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

export const getFriendRequests = (friendships: FriendshipWithBoth[], userId: string) => {
  if (friendships.length === 0) return [];

  const requests = friendships.map((fr) => {
    if (fr.addresseeId === userId) return { ...fr, addressee: null };
    else return { ...fr, requester: null };
  });

  return requests;
};
