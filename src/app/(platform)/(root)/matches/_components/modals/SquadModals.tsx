import NotFoundParagraph from "@/components/NotFoundParagraph";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlayerWithUser } from "@/lib/types";
import { Shield, UserCircle2 } from "lucide-react";

interface SquadModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName?: string;
  teamLogo?: string;
  players?: PlayerWithUser[];
}
export const SquadModal = ({ isOpen, onClose, teamName, teamLogo, players }: SquadModalProps) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="overflow-hidden p-0 font-[poppins]">
      <DialogHeader className={`bg-gradient-to-br from-green-500/10 to-transparent p-6 pb-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border-2 border-white bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
              {teamLogo ? (
                <img src={teamLogo} alt={teamName} className="h-full w-full object-cover" />
              ) : (
                <Shield className={`h-8 w-8 text-green-500/40`} />
              )}
            </div>
            <div>
              <DialogTitle className="text-xl font-bold tracking-tighter text-slate-900 uppercase italic dark:text-white">
                {teamName}
              </DialogTitle>
              <DialogDescription
                className={`w-full text-left text-[10px] font-semibold tracking-wide text-green-500 uppercase`}
              >
                {players?.length} Active
              </DialogDescription>
            </div>
          </div>
        </div>
      </DialogHeader>
      <div className="hide_scrollbar mt-4 max-h-[40vh] space-y-3 overflow-y-auto px-4 pr-2">
        {!players || players?.length === 0 ? (
          <NotFoundParagraph description="No players in the squad" />
        ) : (
          players.map((player: any, idx: number) => (
            <div
              key={idx}
              className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-emerald-500/50 dark:border-white/5 dark:bg-white/5"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm transition-colors group-hover:text-emerald-500 dark:bg-slate-800 dark:text-slate-500">
                  <UserCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-[inter] text-sm font-semibold tracking-tight text-slate-900 uppercase dark:text-white">
                    {player.user.name}
                  </h4>
                  <p className="font-[urbanist] text-[10px] font-bold tracking-wide text-slate-400 uppercase">
                    Core Squad
                  </p>
                </div>
              </div>
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            </div>
          ))
        )}
      </div>
      <DialogFooter className="p-4">
        <button
          onClick={onClose}
          className={`w-full rounded-2xl bg-green-600 py-4 text-xs font-bold tracking-wide text-white uppercase shadow-xl shadow-green-500/20 transition-all active:scale-95`}
        >
          Dismiss
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
