"use client";

import {
  FriendshipWithBoth,
  TournamentRequestWithDetails,
  TeamRequestWithDetails,
} from "@/lib/types";
import { Check, Trophy, UserPlus, X, ChevronLeft, ChevronUp, ShieldPlus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRequestModal } from "@/hooks/store/use-profile";
import NotFoundParagraph from "@/components/NotFoundParagraph";
import { capitalize } from "lodash";
import { useAction } from "@/hooks/useAction";
import { acceptRequest } from "@/actions/user-actions";
import { toast } from "sonner";

import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { formatDate } from "@/utils/helper/formatDate";
import { acceptTeamRequest } from "@/actions/team-actions";

interface RequestsModalProps {
  initialRequests: {
    friendRequests?: FriendshipWithBoth[];
    tournamentRequests?: TournamentRequestWithDetails[];
    teamRequests?: TeamRequestWithDetails[];
  };
  type: "friend" | "team" | "tournament";
}

export function RequestsModal({ initialRequests, type }: RequestsModalProps) {
  const [requests, setRequests] = useState(initialRequests);

  interface ConfirmModalState {
    isOpen: boolean;
    title: string;
    description: string;
    confirmText: string;
    confirmVariant: "primary" | "destructive";
    onConfirm: () => void;
  }

  const { confirmModalState, closeConfirmModal, openConfirmModal } = useConfirmModal();

  const { isOpen, onClose } = useRequestModal();

  const { execute: acceptFriendRequest, isLoading } = useAction(acceptRequest, {
    onSuccess: (data) => {
      toast.success("You are now friends");
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const { execute: executeAcceptTeamRequest } = useAction(acceptTeamRequest, {
    onSuccess(data) {
      toast.success("Team request accepted!");
    },
    onError(error) {
      toast.error(error);
    },
  });

  // const {} = useAction(reject);
  // const {} = useAction();
  // const {} = useAction();
  // const {} = useAction();

  //

  const handleFriendAccept = (requestId: string, reqUsername: string) => {
    if (!requests.friendRequests) return;
    acceptFriendRequest({ reqId: requestId, reqUsername });

    const filteredRequests = requests.friendRequests.filter((prev) => prev.id !== requestId);

    setRequests((prev) => ({ ...prev, friendRequests: filteredRequests }));
  };

  const handleTeamAccept = (id: string) => {
    if (!requests.teamRequests) return;

    executeAcceptTeamRequest({ id });

    const filteredRequests = requests.teamRequests.filter((prev) => prev.id !== id);

    setRequests((prev) => ({
      ...prev,
      teamRequests: filteredRequests,
    }));
  };

  const handleTournamentAccept = (requestId: string) => {
    if (!requests.tournamentRequests) return;

    const filteredRequests = requests.tournamentRequests.filter((prev) => prev.id !== requestId);

    setRequests((prev) => ({
      ...prev,
      tournamentRequests: filteredRequests,
    }));
  };

  const handleFriendDecline = (requestId: string, reqUsername: string) => {
    if (!requests.friendRequests) return;

    const filteredRequests = requests.friendRequests.filter((prev) => prev.id !== requestId);

    setRequests((prev) => ({ ...prev, friendRequests: filteredRequests }));
  };

  const handleTeamDecline = (requestId: string) => {
    if (!requests.teamRequests) return;

    const filteredRequests = requests.teamRequests.filter((prev) => prev.id !== requestId);

    setRequests((prev) => ({
      ...prev,
      teamRequests: filteredRequests,
    }));
  };

  const handleTournamentDecline = (requestId: string) => {
    if (!requests.tournamentRequests) return;

    const filteredRequests = requests.tournamentRequests.filter((prev) => prev.id !== requestId);

    setRequests((prev) => ({
      ...prev,
      tournamentRequests: filteredRequests,
    }));
  };

  const pendingCount =
    (requests?.friendRequests?.length || 0) +
    (requests?.teamRequests?.length || 0) +
    (requests?.tournamentRequests?.length || 0);

  return (
    <>
      <Dialog onOpenChange={onClose} open={isOpen}>
        <DialogTitle />
        <DialogContent className="mx-4 w-full max-w-md overflow-y-auto rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle>Requests</DialogTitle>
          </DialogHeader>
          {pendingCount === 0 ? (
            <NotFoundParagraph description="You have no pending requests." />
          ) : (
            <div className="h-[50vh] items-start justify-start overflow-y-auto pr-2 font-[poppins]">
              {/* FRIEND REQUESTS */}
              {type === "friend" &&
                requests?.friendRequests &&
                requests.friendRequests.length !== 0 && (
                  <ul key="friend-list" className="mb-2 space-y-4 overflow-hidden">
                    {requests.friendRequests.map((request) => {
                      const user = request.addressee || request.requester;
                      return (
                        <li key={user.id} className="flex items-center space-x-3">
                          <img
                            src={user.avatar || "/user.svg"}
                            alt={`${user.name}'s avatar`}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex flex-nowrap justify-between overflow-hidden">
                              <p className="primary-text text-sm font-medium">{user.name}</p>
                              <p className="secondary-text text-[10px]">
                                ({formatDate(new Date(request.createdAt))})
                              </p>
                            </div>
                            <p className="secondary-text flex items-center text-xs">
                              <span className="mr-1">
                                <UserPlus className="h-4 w-4" />
                              </span>
                              sent you a friend request.
                            </p>
                          </div>
                          <div className="flex shrink-0 space-x-2">
                            <button
                              onClick={() => {
                                openConfirmModal({
                                  title: "Accept Friend Request",
                                  description: `Are you sure you want to accept ${user.name}'s request?`,
                                  confirmText: "Accept",
                                  confirmVariant: "primary",
                                  onConfirm: () => handleFriendAccept(request.id, user.username),
                                });
                              }}
                              className="rounded-full p-2 text-green-600 transition hover:bg-green-100"
                              title="Accept"
                            >
                              <Check className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => {
                                openConfirmModal({
                                  title: "Decline Friend Request",
                                  description: `Are you sure you want to decline ${user.name}'s request?`,
                                  confirmText: "Decline",
                                  confirmVariant: "destructive",
                                  onConfirm: () => handleFriendDecline(request.id, user.username),
                                });
                              }}
                              className="rounded-full p-2 text-red-600 transition hover:bg-red-100"
                              title="Decline"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}

              {/* TEAM REQUESTS */}
              {type === "team" && requests?.teamRequests && requests.teamRequests.length !== 0 && (
                <ul className="mb-2 space-y-4 overflow-hidden">
                  {requests.teamRequests.map((request) => (
                    <li key={request.id} className="flex items-center space-x-3">
                      <img
                        src={
                          request.team.logo ||
                          "https://placehold.co/40x40/E0E7FF/4F46E5?text=Avatar"
                        }
                        alt={`${request.team.name}'s avatar`}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex flex-nowrap justify-between overflow-hidden">
                          <p className="primary-text text-sm font-medium">{request.to.name}</p>
                          <p className="secondary-text text-[10px]">
                            ({formatDate(new Date(request.createdAt))})
                          </p>
                        </div>
                        <p className="secondary-text flex items-center text-xs">
                          wants to join {request.team.name}.
                        </p>
                      </div>
                      <div className="flex shrink-0 space-x-2">
                        <button
                          onClick={() => {
                            openConfirmModal({
                              title: "Accept Team Request",
                              description: `Are you sure you want to accept ${request.team.name}'s request?`,
                              confirmText: "Accept",
                              confirmVariant: "primary",
                              onConfirm: () => handleTeamAccept(request.id),
                            });
                          }}
                          className="rounded-full p-2 text-green-600 transition hover:bg-green-100"
                          title="Accept"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            openConfirmModal({
                              title: "Decline Team Request",
                              description: `Are you sure you want to decline ${request.team.name}'s request?`,
                              confirmText: "Decline",
                              confirmVariant: "destructive",
                              onConfirm: () => handleTeamDecline(request.id),
                            });
                          }}
                          className="rounded-full p-2 text-red-600 transition hover:bg-red-100"
                          title="Decline"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* TOURNAMENT REQUESTS */}
              {type === "tournament" &&
                requests?.tournamentRequests &&
                requests.tournamentRequests.length !== 0 && (
                  <ul className="mb-2 space-y-4 overflow-hidden">
                    {requests.tournamentRequests.map((request) => (
                      <li key={request.id} className="flex items-center space-x-3">
                        <img src="/trophy.svg" alt="" width={40} height={40} />
                        <div className="flex-1">
                          <div className="flex flex-nowrap justify-between overflow-hidden">
                            <p className="primary-text text-sm font-medium">{request.team.name}</p>
                            <p className="secondary-text text-[10px]">
                              ({formatDate(new Date(request.createdAt))})
                            </p>
                          </div>

                          <p className="secondary-text flex items-center text-xs">
                            <span className="mr-1">
                              <Trophy className="h-4 w-4" />
                            </span>
                            wants to join your {request.tournament.title}.
                          </p>
                        </div>
                        <div className="flex shrink-0 space-x-2">
                          <button
                            onClick={() => {
                              openConfirmModal({
                                title: "Accept Tournament Request",
                                description: `Are you sure you want to accept ${request.tournament.title}'s request?`,
                                confirmText: "Accept",
                                confirmVariant: "primary",
                                onConfirm: () => handleTournamentAccept(request.id),
                              });
                            }}
                            className="rounded-full p-2 text-green-600 transition hover:bg-green-100"
                            title="Accept"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              openConfirmModal({
                                title: "Decline Tournament Request",
                                description: `Are you sure you want to decline ${request.tournament.title}'s request?`,
                                confirmText: "Decline",
                                confirmVariant: "destructive",
                                onConfirm: () => handleTournamentDecline(request.id),
                              });
                            }}
                            className="rounded-full p-2 text-red-600 transition hover:bg-red-100"
                            title="Decline"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <ConfirmModal {...confirmModalState} isLoading={isLoading} onClose={closeConfirmModal} />
    </>
  );
}
