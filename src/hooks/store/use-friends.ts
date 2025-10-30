import { create } from "zustand";

interface ProfileFriends {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useFriendsModal = create<ProfileFriends>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
