import { create } from "zustand";

type ProfileModalProps = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useRequestModal = create<ProfileModalProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export const useDetailsModal = create<ProfileModalProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export const useProfileModal = create<ProfileModalProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
