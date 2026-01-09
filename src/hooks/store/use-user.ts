import { create } from "zustand";

type UserModalType = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useAskToJoinModal = create<UserModalType>((set) => ({
  isOpen: false,
  onOpen() {
    set({ isOpen: true });
  },
  onClose() {
    set({ isOpen: false });
  },
}));

export const useJoinTheirTeamModal = create<UserModalType>((set) => ({
  isOpen: false,
  onOpen() {
    set({ isOpen: true });
  },
  onClose() {
    set({ isOpen: true });
  },
}));
