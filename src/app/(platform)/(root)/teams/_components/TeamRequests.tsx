import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bell } from "lucide-react";
import { CheckCircle, XCircle } from "lucide-react";
import { useHandleRequest } from "@/hooks/useTeam";
import TeamProps from "@/types/teams.props";
import NotFoundParagraph from "@/components/NotFoundParagraph";

export default function TeamRequests({
  team,
  setTeam,
}: {
  team: TeamProps;
  setTeam: React.Dispatch<React.SetStateAction<TeamProps | null>>;
}) {
  const { handleAcceptRequest, handleRejectRequest } = useHandleRequest();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="heading-text cursor-pointer border-none p-4">
          <Bell size={28} />
        </button>
      </DialogTrigger>
      <DialogContent className="mb-10 rounded-2xl border border-pink-700 p-6 md:max-w-lg dark:bg-gradient-to-br dark:from-gray-700/50 dark:to-pink-900/50 dark:shadow-xl dark:shadow-pink-900/30">
        <DialogHeader>
          <DialogTitle className="mb-6 flex items-center font-bold text-gray-800 dark:text-pink-300">
            Requests
          </DialogTitle>
          <DialogDescription>Player requests to join the team.</DialogDescription>
        </DialogHeader>
        <div className="grid w-full gap-2">
          {team.pendingRequests.length === 0 ? (
            <div>
              <NotFoundParagraph description="No requests available" />
            </div>
          ) : (
            team.pendingRequests.map(
              (req, i) =>
                typeof req !== "string" && (
                  <div
                    key={i}
                    className="bg-light_dark flex transform-gpu flex-col items-center justify-between rounded-xl border p-4 shadow-md transition-all duration-200 hover:scale-[1.01] hover:shadow-lg md:flex-row"
                  >
                    <div className="mb-2 flex-1 text-center md:mr-4 md:mb-0 md:text-left">
                      <p className="heading-text text-lg font-semibold">{req.name}</p>
                      <p className="text-sm text-gray-400">
                        Requested by:
                        <span className="font-medium text-emerald-600 dark:text-purple-300">
                          {req.name}
                        </span>
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={async () => {
                          const success = await handleAcceptRequest();
                        }}
                        className="group transform-gpu rounded-lg border-none bg-gradient-to-r from-green-600 to-green-800 px-4 py-2 text-base font-medium text-white shadow-lg transition-all duration-300 ease-out hover:scale-105 hover:from-green-700 hover:to-green-900 active:scale-95"
                      >
                        <CheckCircle className="mr-1 inline-block h-5 w-5 transition-transform duration-200 group-hover:rotate-6" />{" "}
                        Accept
                      </button>
                      <button
                        onClick={async () => {
                          const success = await handleRejectRequest();
                        }}
                        className="group transform-gpu rounded-lg border-none bg-gradient-to-r from-red-600 to-red-800 px-4 py-2 text-base font-medium text-white shadow-lg transition-all duration-300 ease-out hover:scale-105 hover:from-red-700 hover:to-red-900 active:scale-95"
                      >
                        <XCircle className="mr-1 inline-block h-5 w-5 transition-transform duration-200 group-hover:-rotate-6" />
                        Reject
                      </button>
                    </div>
                  </div>
                )
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
