"use client";

import { debounce } from "lodash";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import Spinner from "../Spinner";
import { useEffect, useState } from "react";
import { confirmButtonClass } from "@/styles/buttons";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  confirmVariant?: "primary" | "destructive" | "secondary";
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  confirmVariant = "primary",
  isLoading,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const [isConfirm, setIsConfirm] = useState(false);

  useEffect(() => {
    if (!isLoading && isConfirm) onClose();
  }, [isLoading, isConfirm]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-sm rounded-lg bg-white p-6 font-[poppins] dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          <DialogDescription className="text-gray-500">{description}</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                debounce(onConfirm, 500)();
                setIsConfirm(true);
              }}
              className={confirmButtonClass(confirmVariant)}
            >
              {confirmText}
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmModal;
