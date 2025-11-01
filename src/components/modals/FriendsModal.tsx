import { User } from "@/generated/prisma";
import { Users, X } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useFriendsModal } from "@/hooks/store/use-friends";

interface FriendsModalProps {
  friends: User[];
}
const FriendsModal = ({ friends }: FriendsModalProps) => {
  const { isOpen, onClose } = useFriendsModal();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle title="Your Friends" />

      <DialogContent onClick={(e) => e.stopPropagation()} className="max-w-md overflow-hidden">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="flex items-center text-xl font-semibold">
            <Users className="mr-2 h-6 w-6" />
            Friends
          </h2>
        </div>

        {/* Body (Friend List) */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {friends.length === 0 ? (
            <p className="py-4 text-center">You don't have any friends yet.</p>
          ) : (
            <ul className="space-y-3">
              {friends.map((friend) => (
                <li key={friend.id} className="bg-gray-50 hover:opacity-80 dark:bg-gray-800">
                  <a
                    href={`/users/${friend.username}`}
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
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FriendsModal;
