import { create } from "zustand";
import { createModalStore } from "./create";

type UserModalType = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useAskToJoinModal = createModalStore();

export const useJoinTheirTeamModal = createModalStore();
