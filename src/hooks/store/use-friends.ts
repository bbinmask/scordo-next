import { create } from "zustand";
import { createModalStore } from "./create";

interface ProfileFriends {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useFriendsModal = createModalStore();
