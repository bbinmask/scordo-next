import { create } from "zustand";
import { createModalStore } from "./create";

type UpdateTeamProps = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useUpdateTeam = createModalStore();

export const useUpdateLogoAndBanner = createModalStore();

export const usePlayerModal = createModalStore();
