import ConfirmModal from "@/components/modals/ConfirmModal";
import NotFoundParagraph from "@/components/NotFoundParagraph";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TeamRequest } from "@/generated/prisma";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { TeamRequestWithDetails } from "@/lib/types";
import { Check, UserPlus, X } from "lucide-react";
import React from "react";

interface TeamRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: TeamRequestWithDetails[];
}

const TeamRequestModal = ({ requests, isOpen, onClose }: TeamRequestModalProps) => {
  const { confirmModalState, closeConfirmModal, openConfirmModal } = useConfirmModal();

  const handleAccept = (id: string, username: string) => {};
  const handleDecline = (id: string, username: string) => {};

  const isLoading = true;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="mx-4 w-full max-w-md overflow-y-auto rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle>Requests</DialogTitle>
        </DialogHeader>
        {requests.length === 0 ? (
          <NotFoundParagraph description="You have no requests." />
        ) : (
          <ul className="mb-2 h-[50vh] items-start justify-start space-y-4 overflow-hidden overflow-y-auto pr-2 font-[poppins]">
            {/* FRIEND REQUESTS */}
            {requests.map((request) => {
              const user = request.from;
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
                          onConfirm: () => handleAccept(request.id, user.username),
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
                          onConfirm: () => handleDecline(request.id, user.username),
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
      </DialogContent>
      <ConfirmModal {...confirmModalState} isLoading={isLoading} onClose={closeConfirmModal} />
    </Dialog>
  );
};

export default TeamRequestModal;
