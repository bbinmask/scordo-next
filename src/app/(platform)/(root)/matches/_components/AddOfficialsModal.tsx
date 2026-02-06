"use client";
import { PlayerWithUser } from "@/lib/types";
import { MatchOfficial } from "../_types/types";
import { OfficialRole } from "@/generated/prisma";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash, UserCircle2, UserPlus2 } from "lucide-react";

interface AddOfficialModalProps {
  onClose: () => void;
  isOpen: boolean;
  players: PlayerWithUser[];
  onSubmit: (matchOfficials: MatchOfficial[]) => void;
}

export const AddOfficialModal = ({ onClose, onSubmit, isOpen, players }: AddOfficialModalProps) => {
  const [selectedRole, setSelectedRole] = useState<OfficialRole>("UMPIRE");
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerWithUser | null>(null);
  const [matchOfficials, setMatchOfficials] = useState<MatchOfficial[]>([]);

  const handleAdd = () => {
    if (!selectedPlayer?.userId || selectedRole.trim() === "") return;

    setMatchOfficials((prev) => [
      ...prev,
      {
        name: selectedPlayer?.user?.name,
        role: selectedRole as OfficialRole,
        userId: selectedPlayer.userId,
      },
    ]);
  };

  const handleRemove = (userId: string) => {
    const officials = matchOfficials.filter((official) => official.userId !== userId);
    setMatchOfficials(officials);
  };

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>
            <div className="font-inter flex items-center justify-between rounded-lg bg-gradient-to-br from-green-500/10 to-transparent p-2 italic">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-600 p-2 shadow-lg">
                  <UserPlus2 className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-black tracking-tighter text-slate-900 uppercase italic dark:text-white">
                    Add New Official
                  </h2>
                </div>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="w-full bg-slate-600 pb-[1px]" />
        <div className="grid grid-cols-5 items-end gap-2 space-y-2 font-[poppins]">
          <div className="col-span-2">
            <label className="mb-2 ml-1 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Select a Player
            </label>
            <select
              onChange={(e) => setSelectedPlayer(JSON.parse(e.target.value) as any)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-[poppins] text-xs font-normal transition-all outline-none focus:ring-2 focus:ring-green-500 dark:border-white/10 dark:bg-white/5"
            >
              <option value={""}>Select a Player</option>
              {players
                .filter((pl) => !matchOfficials.some((u) => u.userId === pl.userId))
                .map((pl) => (
                  <option className="" key={pl.userId} value={JSON.stringify(pl)}>
                    {pl.user.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="mb-2 ml-1 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Select Role
            </label>
            <select
              onChange={(e) => setSelectedRole(e.target.value as OfficialRole)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-[poppins] text-xs font-normal transition-all outline-none focus:ring-2 focus:ring-green-500 dark:border-white/10 dark:bg-white/5"
            >
              <option value={""}>Select Role</option>
              {["UMPIRE", "SCORER", "COMMENTATOR"].map((role) => (
                <option className="" key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleAdd}
            className={`col-span-1 mb-2 rounded-xl bg-green-800 px-4 py-2 font-[urbanist] text-sm font-bold text-white focus-visible:ring-2 focus-visible:ring-green-400`}
          >
            Add
          </button>
        </div>

        {/* Officials List */}
        {matchOfficials.length > 0 && (
          <>
            <div className="w-full bg-slate-600 pb-[1px]" />
            <div className="hide_scrollbar max-h-48 space-y-2 overflow-y-auto pr-2">
              {matchOfficials.map((user) => (
                <div
                  key={user.userId}
                  className="group flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-2 hover:border-green-500 dark:border-white/5 dark:bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition-colors group-hover:text-green-500 dark:border-white/10 dark:bg-slate-800">
                      <UserCircle2 className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold tracking-tight text-slate-900 uppercase dark:text-white">
                        {user.name}
                      </p>
                    </div>
                  </div>
                  <button className="" onClick={() => handleRemove(user.userId)}>
                    <Trash className="h-5 w-5 text-slate-300 transition-all group-hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
        <div className="flex w-full items-center justify-between gap-8 px-2">
          {matchOfficials.length > 0 && (
            <button
              className="w-full rounded-2xl bg-green-800 px-4 py-2 text-xs font-black tracking-wide text-white uppercase shadow-lg shadow-green-500/20 transition-all active:scale-95 dark:bg-green-600"
              onClick={() => {
                onSubmit(matchOfficials);
                onClose();
              }}
            >
              Submit
            </button>
          )}
          <button
            onClick={onClose}
            className="mx-auto w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 font-[poppins] text-xs font-semibold tracking-widest text-slate-500 uppercase transition-all hover:bg-slate-100 dark:border-white/10 dark:bg-slate-800 dark:text-slate-400"
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
