"use client";

import { TeamRequest, TournamentRequest } from "@/generated/prisma";
import {
  FriendshipWithBoth,
  TournamentRequestWithDetails,
  TeamRequestWithDetails,
} from "@/lib/types";
import {
  Check,
  Inbox,
  Shield,
  Trophy,
  UserPlus,
  X,
  ChevronLeft,
  ChevronUp,
  ShieldPlus,
} from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { useNotificationModal } from "@/hooks/store/use-profile-notifications";
import NotFoundParagraph from "../NotFoundParagraph";
import { capitalize, debounce } from "lodash";
import { AnimatePresence, motion } from "framer-motion";
import { useAction } from "@/hooks/useAction";
import { acceptRequest } from "@/actions/user-actions";
import { toast } from "sonner";

import { ConfirmModal } from "./ConfirmModal";
import { useConfirmModal } from "@/hooks/useConfirmModal";

interface RequestsModalProps {
  initialRequests: {
    friendRequests: FriendshipWithBoth[];
    tournamentRequests: TournamentRequestWithDetails[];
    teamRequests: TeamRequestWithDetails[];
  };
}

export default function RequestsModal({ initialRequests }: RequestsModalProps) {
  const [requests, setRequests] = useState(initialRequests);
  const [toggle, setToggle] = useState({
    friend: true,
    team: true,
    tournament: true,
  });

  interface ConfirmModalState {
    isOpen: boolean;
    title: string;
    description: string;
    confirmText: string;
    confirmVariant: "primary" | "destructive";
    onConfirm: () => void;
  }

  const { confirmModalState, closeConfirmModal, openConfirmModal } = useConfirmModal();

  const { isOpen, onClose } = useNotificationModal();

  const { execute: acceptFriendRequest, isLoading } = useAction(acceptRequest, {
    onSuccess: (data) => {
      toast.success("You are now friends");
    },
    onError: (err) => {
      console.error(err);
    },
  });

  // const {} = useAction(reject);
  // const {} = useAction();
  // const {} = useAction();
  // const {} = useAction();

  //

  const handleFriendAccept = (requestId: string, reqUsername: string) => {
    acceptFriendRequest({ reqId: requestId, reqUsername });

    const filteredRequests = requests.friendRequests.filter((prev) => prev.id !== requestId);

    setRequests((prev) => ({ ...prev, friendRequests: filteredRequests }));
  };

  const handleTeamAccept = (requestId: string) => {
    const filteredRequests = requests.teamRequests.filter((prev) => prev.id !== requestId);

    setRequests((prev) => ({
      ...prev,
      teamRequests: filteredRequests,
    }));
  };

  const handleTournamentAccept = (requestId: string) => {
    const filteredRequests = requests.tournamentRequests.filter((prev) => prev.id !== requestId);

    setRequests((prev) => ({
      ...prev,
      tournamentRequests: filteredRequests,
    }));
  };

  const handleFriendDecline = (requestId: string, reqUsername: string) => {
    const filteredRequests = requests.friendRequests.filter((prev) => prev.id !== requestId);

    setRequests((prev) => ({ ...prev, friendRequests: filteredRequests }));
  };

  const handleTeamDecline = (requestId: string) => {
    const filteredRequests = requests.teamRequests.filter((prev) => prev.id !== requestId);

    setRequests((prev) => ({
      ...prev,
      teamRequests: filteredRequests,
    }));
  };

  const handleTournamentDecline = (requestId: string) => {
    const filteredRequests = requests.tournamentRequests.filter((prev) => prev.id !== requestId);

    setRequests((prev) => ({
      ...prev,
      tournamentRequests: filteredRequests,
    }));
  };

  const pendingCount =
    requests?.friendRequests.length ||
    requests?.teamRequests.length ||
    requests?.tournamentRequests.length;

  const variants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: "auto", opacity: 1 },
    exit: { height: 0, opacity: 0 },
  };
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
              {requests.friendRequests.length !== 0 && (
                <>
                  <ToggleButton
                    state={toggle}
                    name="friend"
                    onClick={() => setToggle((prev) => ({ ...prev, friend: !prev.friend }))}
                  />
                  <AnimatePresence initial={false}>
                    {toggle.friend && (
                      <motion.ul
                        key="friend-list"
                        variants={variants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="mb-2 space-y-4 overflow-hidden"
                      >
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
                                <p className="primary-text text-sm font-medium">{user.name}</p>
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
                                      onConfirm: () =>
                                        handleFriendAccept(request.id, user.username),
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
                                      onConfirm: () =>
                                        handleFriendDecline(request.id, user.username),
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
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </>
              )}

              {/* TEAM REQUESTS */}
              {requests.teamRequests.length !== 0 && (
                <>
                  <ToggleButton
                    state={toggle}
                    name="team"
                    onClick={() => setToggle((prev) => ({ ...prev, team: !prev.team }))}
                  />
                  <AnimatePresence initial={false}>
                    {toggle.team && (
                      <motion.ul
                        key="team-list"
                        variants={variants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="mb-2 space-y-4 overflow-hidden"
                      >
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
                              <p className="primary-text text-sm font-medium">
                                {request.from.name}
                              </p>
                              <p className="secondary-text flex items-center text-xs">
                                <span className="mr-1">
                                  <ShieldPlus className="h-4 w-4" />
                                </span>
                                wants you to join {request.team.name} team.
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
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </>
              )}

              {/* TOURNAMENT REQUESTS */}
              {requests.tournamentRequests.length !== 0 && (
                <>
                  <ToggleButton
                    state={toggle}
                    name="tournament"
                    onClick={() => setToggle((prev) => ({ ...prev, tournament: !prev.tournament }))}
                  />
                  <AnimatePresence initial={false}>
                    {toggle.tournament && (
                      <motion.ul
                        key="tournament-list"
                        variants={variants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="mb-2 space-y-4 overflow-hidden"
                      >
                        {requests.tournamentRequests.map((request) => (
                          <li key={request.id} className="flex items-center space-x-3">
                            <img src="/trophy.svg" alt="" width={40} height={40} />
                            <div className="flex-1">
                              <p className="primary-text text-sm font-medium">
                                {request.tournament.title}
                              </p>
                              <p className="secondary-text flex items-center text-xs">
                                <span className="mr-1">
                                  <Trophy className="h-4 w-4" />
                                </span>
                                sent you a tournament request.
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
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <ConfirmModal {...confirmModalState} isLoading={isLoading} onClose={closeConfirmModal} />
    </>
  );
}

interface ToggleButtonProps {
  state: {
    friend: boolean;
    team: boolean;
    tournament: boolean;
  };
  name: "friend" | "team" | "tournament";
  onClick: () => void;
}

const ToggleButton = ({ state, name, onClick }: ToggleButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="mb-2 flex w-full items-center justify-between transition-all duration-200"
    >
      <h3 className="font-[cal_sans]">{capitalize(`${name} Requests`)}</h3>
      {state[name] ? <ChevronUp /> : <ChevronLeft />}
    </button>
  );
};
