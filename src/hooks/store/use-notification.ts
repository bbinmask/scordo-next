import { create } from "zustand";
import { createModalStore } from "./create";

type Props = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNotificationModal = createModalStore();
