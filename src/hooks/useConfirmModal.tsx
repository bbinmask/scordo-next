import { useState, useCallback } from "react";

export interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  confirmVariant?: "primary" | "destructive" | "secondary";
  onConfirm: () => void;
}

export function useConfirmModal() {
  const [confirmModalState, setConfirmModalState] = useState<ConfirmModalState>({
    isOpen: false,
    title: "",
    description: "",
    confirmText: "Confirm",
    confirmVariant: "primary",
    onConfirm: () => {},
  });

  const openConfirmModal = useCallback((config: Omit<ConfirmModalState, "isOpen">) => {
    setConfirmModalState({
      ...config,
      isOpen: true,
    });
  }, []);

  const closeConfirmModal = useCallback(() => {
    setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return {
    confirmModalState,
    openConfirmModal,
    closeConfirmModal,
  };
}
