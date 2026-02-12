"use client";

import { PlayerWithUser } from "@/lib/types";
import { MatchOfficial } from "../../_types/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Gavel, ShieldCheck, UserCheck } from "lucide-react";
import NotFoundParagraph from "@/components/NotFoundParagraph";
import { toast } from "sonner";
import { AddOfficialModal } from "../AddOfficialsModal";
import { capitalize } from "lodash";
import { useState } from "react";

export const OfficialsModal = ({
  officials,
  onClose,
  players,
  isOpen,
  onSubmit,
  isOrganizer,
}: {
  officials: MatchOfficial[];
  isOpen: boolean;
  onClose: () => void;
  players: PlayerWithUser[];
  onSubmit: (matchOffcials: MatchOfficial[]) => void;
  isOrganizer: boolean;
}) => {
  const [isAddingOfficial, setIsAddingOfficial] = useState(false);

  const onOpen = () => {
    setIsAddingOfficial(true);
  };

  if (!officials) return null;
  return (
    <>
      <Dialog onOpenChange={onClose} open={isOpen}>
        <DialogContent className="bg-white backdrop-blur-md dark:bg-slate-950/80">
          <DialogHeader className="px-3">
            <DialogTitle>
              <div className="flex items-center gap-2 rounded-2xl">
                <h2 className="font-[poppins] text-xl font-black text-slate-900 uppercase italic dark:text-white">
                  Match Officials
                </h2>
                <Gavel className="h-6 w-6 text-white" />
              </div>
            </DialogTitle>
            <DialogDescription className="text-left text-[10px] font-black tracking-wider text-green-500 uppercase">
              Authorized Personnel
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-72 space-y-4 pt-4">
            {officials?.length === 0 ? (
              <NotFoundParagraph
                className="font-[poppins] font-bold uppercase"
                description="No officials appointed"
              />
            ) : (
              officials.map((official, idx) => (
                <div
                  key={idx}
                  className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-2 transition-all hover:border-green-500/50 dark:border-white/5 dark:bg-white/5"
                >
                  <div className="flex items-center gap-4">
                    {official.role.includes("UMPIRE") ? (
                      <ShieldCheck className="h-4 w-4" />
                    ) : (
                      <UserCheck className="h-4 w-4" />
                    )}
                    <div>
                      <h4 className="font-[poppins] text-sm font-semibold tracking-tight text-slate-900 uppercase dark:text-white">
                        {official.name}
                      </h4>
                      <p className="font-[urbanist] text-[10px] font-bold text-green-500">
                        {capitalize(official.role.replace("_", " "))}
                      </p>
                    </div>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                </div>
              ))
            )}
          </div>
          <div className="flex w-full items-center gap-2">
            {isOrganizer && (
              <button
                className="w-full rounded-2xl bg-green-800 py-4 text-xs font-bold tracking-wide text-white uppercase shadow-lg shadow-green-500/20 transition-all active:scale-95 dark:bg-green-600"
                onClick={() => {
                  if (players.length === 0) {
                    toast.error("No players left to appointed");
                    onClose();
                  } else onOpen();
                }}
              >
                Add Official
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full rounded-2xl bg-slate-900 py-4 text-xs font-bold tracking-wide text-white uppercase transition-all active:scale-95 dark:bg-gray-500"
            >
              {isOrganizer ? "Cancel" : "Back"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <AddOfficialModal
        onSubmit={onSubmit}
        isOpen={isAddingOfficial}
        onClose={() => setIsAddingOfficial(false)}
        players={players}
      />
    </>
  );
};
