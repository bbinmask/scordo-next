import { acceptMatchRequest, declineMatchRequest } from "@/actions/match-actions";
import Spinner from "@/components/Spinner";
import { useAction } from "@/hooks/useAction";
import { MatchWithDetails } from "@/lib/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Bell } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function MatchRequests() {
  const [inviteId, setInviteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: matchRequests, isLoading } = useQuery<MatchWithDetails[]>({
    queryKey: ["match-requests"],
    queryFn: async () => {
      const { data } = await axios.get("/api/me/matches/requests");
      return data.data;
    },
  });

  const { execute: executeAccept, isLoading: isAccepting } = useAction(acceptMatchRequest, {
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["match-requests"] });
      toast.success("Accepted!");
      setInviteId(null);
    },
    onError(error) {
      toast.error(error);
      setInviteId(null);
    },
  });

  const { execute: executeDecline, isLoading: isCanceling } = useAction(declineMatchRequest, {
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["team-invites"] });
      toast.success("Request Declined!");
      setInviteId(null);
    },
    onError(error) {
      toast.error(error);
      setInviteId(null);
    },
  });

  const handleAccept = (id: string) => {
    setInviteId(id);

    executeAccept({ id });
  };
  const handleDecline = (id: string) => {
    setInviteId(id);

    executeDecline({ id });
  };

  return (
    <div className="group hover-card border-input relative h-52 w-full rounded-3xl border p-6 font-[urbanist] font-semibold lg:mt-16">
      <div className="flex items-center justify-between">
        <h2 className="primary-text flex items-center gap-3 font-[inter] text-lg font-bold uppercase italic">
          <div className="relative">
            <Bell size={20} className="text-green-600" />
            {matchRequests?.length ? (
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500 ring-1 ring-white dark:ring-slate-900" />
            ) : null}
          </div>
          Inbox
        </h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500 dark:bg-white/5">
          {matchRequests?.length} NEW
        </span>
      </div>

      {/* Team Invitations */}
      <div className="max-h-36 overflow-x-hidden overflow-y-auto">
        {isLoading ? (
          <div className="center flex h-full w-full">
            <Spinner />
          </div>
        ) : !matchRequests || matchRequests.length === 0 ? (
          <div className="mt-8 rounded-[2rem] border border-dashed border-slate-200 p-6 text-center dark:border-white/10">
            <p className="text-[10px] font-normal tracking-widest text-slate-400 uppercase">
              No Requests found!
            </p>
          </div>
        ) : (
          <ul className="hide_scrollbar mb-4 overflow-y-auto scroll-smooth rounded-xl">
            {matchRequests.map((req) => (
              <li key={req.id} className="rounded-lg px-3 py-2">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src={req?.teamA?.logo || "/team.svg"}
                      alt={req.teamA.name}
                      className="h-8 w-8 rounded-full bg-white"
                      onError={(e) =>
                        (e.currentTarget.src = "https://placehold.co/100x100/CCCCCC/FFFFFF?text=T")
                      }
                    />
                    <h3 className="font-[urbanist] font-bold text-slate-800 dark:text-slate-100">
                      {req.teamA.name}
                    </h3>
                  </div>
                </div>
                {
                  <div className="flex space-x-2 font-[poppins]">
                    <button
                      disabled={isAccepting || isCanceling}
                      onClick={() => handleAccept(req.id)}
                      className="flex-1 rounded-xl bg-green-600 py-2 text-[10px] font-bold text-white uppercase transition-opacity hover:opacity-90"
                    >
                      {isAccepting && inviteId === req.id ? (
                        <Spinner className="mx-auto h-4" />
                      ) : (
                        "Accept"
                      )}
                    </button>
                    <button
                      onClick={() => handleDecline(req.id)}
                      disabled={isCanceling || isAccepting}
                      className="center flex flex-1 rounded-xl bg-slate-200 py-2 text-[10px] font-bold text-slate-600 uppercase transition-colors hover:bg-slate-300 dark:bg-white/10 dark:text-slate-400"
                    >
                      {isCanceling && inviteId === req.id ? (
                        <Spinner className="mx-auto h-4" />
                      ) : (
                        <span className="text-red-600 dark:text-red-300">Decline</span>
                      )}
                    </button>
                  </div>
                }
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
