import { create } from "zustand";
import { createModalStore } from "./create";

type ProfileModalProps = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useRequestModal = createModalStore();

export const useDetailsModal = createModalStore();
export const useProfileModal = createModalStore();

export const useSettingModal = createModalStore();
