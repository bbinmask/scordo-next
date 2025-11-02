"use client";

import { cn } from "@/lib/utils";
import { FaUser } from "react-icons/fa6";
import { BiSolidMessage } from "react-icons/bi";
import { Bell, BellDot } from "lucide-react";
import { useNotificationModal } from "@/hooks/store/use-profile-notifications";
import RequestsModal from "@/components/modals/RequestsModal";
import {
  FriendshipWithBoth,
  TeamRequestWithDetails,
  TournamentRequestWithDetails,
} from "@/lib/types";
interface FriendRequestsProps {
  requests: {
    friendRequests: FriendshipWithBoth[];
    tournamentRequests: TournamentRequestWithDetails[];
    teamRequests: TeamRequestWithDetails[];
  };
  className?: string;
}

const FriendRequests = ({ className, requests }: FriendRequestsProps) => {
  const noRequest =
    (requests.friendRequests.length &&
      requests.teamRequests.length &&
      requests.tournamentRequests.length) === 0;

  const { onOpen } = useNotificationModal();

  return (
    <div className={cn("", className)}>
      <div className="relative">
        {noRequest ? (
          <button onClick={onOpen}>
            <BellDot className="h-6 w-6" />
          </button>
        ) : (
          <Bell className="h-6 w-6" />
        )}
        {/* <span className="absolute top-2 left-7 font-[urbanist] text-xs font-semibold text-white">
          {requests?.length > 9 ? "9+" : requests?.length || 0}
        </span> */}
      </div>
      <RequestsModal initialRequests={requests} />
    </div>
  );
};

export default FriendRequests;
