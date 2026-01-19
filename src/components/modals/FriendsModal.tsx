"use client";

import { User } from "@/generated/prisma";
import { Users, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useFriendsModal } from "@/hooks/store/use-friends";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import ConfirmModal from "./ConfirmModal";
import { useAction } from "@/hooks/useAction";
import { removeFriend } from "@/actions/user-actions";
import { toast } from "sonner";

interface FriendsModalProps {
  friends: User[];
  isOwnProfile?: boolean;
}
const FriendsModal = ({ friends, isOwnProfile }: FriendsModalProps) => {
  const { isOpen, onClose } = useFriendsModal();
  const { execute, isLoading } = useAction(removeFriend, {
    onSuccess: (data) => {
      toast.success(`Friend is removed`);
    },
    onError: (err) => {
      toast.error(err);
    },
  });

  const { confirmModalState, openConfirmModal, closeConfirmModal } = useConfirmModal();

  const handleRemoveFriend = (id: string, username: string) => {
    execute({ addresseeId: id, username });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogTitle />

        <DialogContent onClick={(e) => e.stopPropagation()} className="max-w-md overflow-hidden">
          <DialogHeader className="border-b p-4">
            <DialogTitle className="flex items-center text-xl font-semibold">
              <Users className="mr-2 h-6 w-6" />
              Friends
            </DialogTitle>
          </DialogHeader>

          {/* Friend List */}
          <div className="max-h-[60vh] w-full overflow-y-auto p-4">
            {friends.length === 0 ? (
              <p className="py-4 text-center">You don't have any friends yet.</p>
            ) : (
              <ul className="space-y-3">
                {friends.map((friend) => (
                  <li
                    key={friend.id}
                    className="flex w-full items-center justify-between bg-gray-50 hover:opacity-80 dark:bg-gray-800"
                  >
                    <a
                      href={`/u/${friend.username}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onClose();
                      }}
                      className="flex items-center rounded-md p-2 transition"
                    >
                      <img
                        src={friend.avatar || "/user.svg"}
                        alt={`${friend.name}'s avatar`}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div className="ml-3 font-[poppins]">
                        <p className="primary-text font-medium">{friend.name}</p>
                        <p className="text-sm text-gray-500">@{friend.username}</p>
                      </div>
                    </a>
                    <button
                      className=""
                      title="Remove Friend"
                      onClick={() => {
                        openConfirmModal({
                          title: "Remove Friend",
                          description: `Are you sure you want to remove ${friend.name} ?`,
                          confirmText: "Remove",
                          confirmVariant: "destructive",
                          onConfirm: () => handleRemoveFriend(friend.id, friend.username),
                        });
                      }}
                    >
                      <X />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmModal {...confirmModalState} isLoading={isLoading} onClose={closeConfirmModal} />
    </>
  );
};

export default FriendsModal;
