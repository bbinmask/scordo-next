import { create } from "zustand";

type ModalStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const createModalStore = () => {
  return create<ModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
  }));
};
