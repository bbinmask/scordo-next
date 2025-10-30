import { User } from "@/generated/prisma";
import { Users, X } from "lucide-react";
import { useState } from "react";

interface FriendsModalProps {
  friends: User[];
}
const FriendsModal = ({ friends }: FriendsModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      {/* 2. The Trigger Button */}
      <button
        onClick={openModal}
        className="flex items-center justify-center rounded-md bg-white px-4 py-2 font-semibold text-gray-700 shadow-sm ring-1 ring-gray-300 transition ring-inset hover:bg-gray-50"
      >
        <Users className="mr-2 h-5 w-5" />
        Friends ({friends.length})
      </button>

      {/* 3. The Modal */}
      {isOpen && (
        <div
          // Backdrop
          onClick={closeModal}
          className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black backdrop-blur-sm"
        >
          <div
            // Modal Content
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            className="mx-4 w-full max-w-md rounded-lg bg-white shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="flex items-center text-xl font-semibold text-gray-800">
                <Users className="mr-2 h-6 w-6 text-blue-600" />
                Friends
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Body (Friend List) */}
            <div className="max-h-[60vh] overflow-y-auto p-4">
              {friends.length === 0 ? (
                <p className="py-4 text-center text-gray-500">
                  This user hasn't added any friends yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {friends.map((friend) => (
                    <li key={friend.id}>
                      {/* Replaced Next.js <Link> with <a> */}
                      <a
                        href={`/profile/${friend.id}`}
                        // Close modal on navigation and prevent default link behavior
                        onClick={(e) => {
                          e.preventDefault();
                          closeModal();
                        }}
                        className="flex items-center rounded-md p-2 transition hover:bg-gray-100"
                      >
                        {/* Replaced Next.js <Image> with <img> */}
                        <img
                          src={
                            friend.avatar || "https://placehold.co/40x40/E0E7FF/4F46E5?text=Avatar"
                          }
                          alt={`${friend.name}'s avatar`}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div className="ml-3">
                          <p className="font-medium text-gray-800">{friend.name}</p>
                          <p className="text-sm text-gray-500">@{friend.username}</p>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
