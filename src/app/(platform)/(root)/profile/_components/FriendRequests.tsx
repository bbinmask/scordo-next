import { Friendship, TeamRequest, TournamentRequest } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { FaUser } from "react-icons/fa6";
import { BiSolidMessage } from "react-icons/bi";
import { Bell, BellDot } from "lucide-react";
interface FriendRequestsProps {
  requests: {
    friendRequests: Friendship[];
    tournamentRequests: TournamentRequest[];
    teamRequests: TeamRequest[];
  };
  className?: string;
}

const FriendRequests = ({ className, requests }: FriendRequestsProps) => {
  const noRequest =
    (requests.friendRequests.length &&
      requests.teamRequests.length &&
      requests.tournamentRequests.length) === 0;

  return (
    <div className={cn("", className)}>
      <div className="relative">
        {noRequest ? <BellDot className="h-6 w-6" /> : <Bell className="h-6 w-6" />}
        {/* <span className="absolute top-2 left-7 font-[urbanist] text-xs font-semibold text-white">
          {requests?.length > 9 ? "9+" : requests?.length || 0}
        </span> */}
      </div>
    </div>
  );
};

export default FriendRequests;
