import { Friendship } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { FaUser } from "react-icons/fa6";
import { BiSolidMessage } from "react-icons/bi";
interface FriendRequestsProps {
  requests: Friendship[];
  className?: string;
}

const FriendRequests = ({ className, requests }: FriendRequestsProps) => {
  return (
    <div className={cn("", className)}>
      <div className="relative">
        <BiSolidMessage className="h-12 w-12 text-red-600" />
        <FaUser className="absolute top-3 left-3 h-4 w-4 text-white" />
        <span className="absolute top-2 left-7 font-[urbanist] text-xs font-semibold text-white">
          {requests?.length > 9 ? "9+" : requests?.length || 0}
        </span>
      </div>
    </div>
  );
};

export default FriendRequests;
