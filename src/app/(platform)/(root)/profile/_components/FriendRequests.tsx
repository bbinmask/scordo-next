import { Friendship } from "@/generated/prisma";
import { cn } from "@/lib/utils";

interface FriendRequestsProps {
  requests: Friendship[];
  className?: string;
}

const FriendRequests = ({ className, requests }: FriendRequestsProps) => {
  return <div className={cn("", className)}>FriendRequests</div>;
};

export default FriendRequests;
