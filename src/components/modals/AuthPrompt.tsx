"use client";
import { REASON_COPY } from "@/constants";
import { useCheckLogin } from "@/hooks/store/check-login";
import { Shield, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface PleaseSignInProps {
  reason?: string;
}

export const AuthPrompt = ({ reason = "general" }: PleaseSignInProps) => {
  const router = useRouter();

  const copy = REASON_COPY[reason] || REASON_COPY.general;

  const { isOpen, onClose } = useCheckLogin();
  // Handle Escape Key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Prevent Body Scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="animate-in fade-in fixed inset-0 z-[9998] bg-slate-950/60 backdrop-blur-sm duration-200"
      />

      {/* Modal / Bottom Sheet */}
      <div className="pointer-events-none fixed inset-0 z-[9999] flex items-end justify-center sm:items-center sm:p-4">
        <div
          role="dialog"
          aria-modal="true"
          className="animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 sm:zoom-in-95 pointer-events-auto relative w-full max-w-sm rounded-t-[2.5rem] border border-slate-200 bg-white p-8 pt-6 shadow-2xl duration-300 sm:rounded-[2.5rem] sm:pt-8 dark:border-white/10 dark:bg-slate-950"
        >
          {/* Mobile Drag Handle */}
          <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-slate-200 sm:hidden dark:bg-slate-800" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-white"
          >
            <X size={20} />
          </button>

          {/* Icon */}
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
            <Shield size={28} />
          </div>

          {/* Copy */}
          <h2 className="mb-2 text-center text-2xl font-black tracking-tighter text-slate-900 uppercase italic dark:text-white">
            {copy.headline}
          </h2>
          <p className="mb-8 px-2 text-center text-sm leading-relaxed font-medium text-slate-500 dark:text-slate-400">
            {copy.sub}
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push("/auth/sign-up")}
              className="w-full rounded-2xl bg-emerald-600 py-4 text-xs font-black tracking-widest text-white uppercase shadow-xl shadow-emerald-500/20 transition-all hover:bg-emerald-500 active:scale-95"
            >
              Create a free account
            </button>
            <button
              onClick={() => router.push("/auth/sign-in")}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 text-xs font-black tracking-widest text-slate-600 uppercase transition-all hover:bg-slate-100 active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
            >
              Sign in
            </button>
          </div>

          <p className="mt-6 text-center text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            Secure authentication via Scordo ID.
          </p>
        </div>
      </div>
    </>
  );
};
