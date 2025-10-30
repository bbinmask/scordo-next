import { create } from "zustand";

type ProfileNotification = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNotificationModal = create<ProfileNotification>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
