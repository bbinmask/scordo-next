import { create } from "zustand";

type UpdateTeamProps = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useUpdateTeam = create<UpdateTeamProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export const useUpdateLogoAndBanner = create<UpdateTeamProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
