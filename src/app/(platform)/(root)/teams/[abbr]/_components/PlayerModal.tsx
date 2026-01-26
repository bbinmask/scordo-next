import { removeFromTeam, updateCaptain } from "@/actions/team-actions";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePlayerModal } from "@/hooks/store/use-team";
import { useAction } from "@/hooks/useAction";
import { PlayerWithUser } from "@/lib/types";
import { Crown, ExternalLink, User, UserMinus, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface PlayerModalProps {
  player: PlayerWithUser | null;
  isOwner: boolean;
  isCaptain: boolean;
  teamId: string;
  captainId: string;
  ownerId: string;
}

const PlayerModal = ({
  player,
  isOwner,
  isCaptain,
  teamId,
  captainId,
  ownerId,
}: PlayerModalProps) => {
  const { isOpen, onClose } = usePlayerModal();

  const { execute: executeRemove, isLoading: isRemoving } = useAction(removeFromTeam, {
    onSuccess(data) {
      toast.success(`${player?.user.name} is removed!`);

      onClose();
    },
    onError(error) {
      toast.error(error);
    },
  });
  const { execute: executeCaptain, isLoading } = useAction(updateCaptain, {
    onSuccess(data) {
      toast.success(`${player?.user.name} is now captain of ${data.name}`);
    },
    onError(error) {
      toast.error(error);
    },
  });

  const handleRemove = () => {
    if (player?.userId === ownerId) {
      toast.error("Cannot remove the owner");
      return;
    } else executeRemove({ playerId: player?.userId as string, teamId });
  };

  const handlePromote = () => {
    executeCaptain({ playerId: player?.userId as string, teamId });
  };

  if (!player) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white bg-indigo-100 font-[poppins] text-3xl font-black text-indigo-600 uppercase shadow-inner dark:border-slate-800 dark:bg-indigo-900/30">
                {player.user?.avatar ? (
                  <img src={player.user.avatar} className="h-full w-full rounded-xl" />
                ) : (
                  player.user.name.charAt(0)
                )}
              </div>
              <div className="block">
                <h3 className="font-[poppins] text-2xl font-bold tracking-tighter text-slate-900 uppercase dark:text-white">
                  {player.user.name}
                </h3>
                <p className="text-start text-sm text-slate-400 italic">@{player.user.username}</p>
                <div className="mt-2 flex items-center gap-2">
                  {player.userId === ownerId && (
                    <span className="rounded-md bg-green-100 px-2 py-0.5 font-[poppins] text-[10px] font-bold tracking-wider text-yellow-600 uppercase dark:bg-yellow-500/10 dark:text-yellow-400">
                      Owner
                    </span>
                  )}

                  {player.userId === captainId && (
                    <span className="rounded-md bg-green-100 px-2 py-0.5 font-[poppins] text-[10px] font-bold tracking-wider text-green-600 uppercase dark:bg-green-500/10 dark:text-green-400">
                      Captain
                    </span>
                  )}
                </div>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="pb-6">
          <div className="space-y-3">
            {/* Common Actions */}
            <Link
              href={`/u/${player.user.username}`}
              className="group flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:bg-indigo-50 dark:border-white/5 dark:bg-white/5 dark:hover:bg-indigo-500/10"
            >
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-slate-400 group-hover:text-indigo-500" />
                <span className="font-inter text-sm font-semibold tracking-tight text-slate-700 uppercase dark:text-slate-200">
                  View Public Profile
                </span>
              </div>
              <ExternalLink className="h-4 w-4 text-slate-300" />
            </Link>

            {/* Administrative Actions */}
            {isOwner || isCaptain ? (
              <>
                <div className="my-2 h-px w-full bg-slate-100 dark:bg-white/5" />
                <p className="mb-2 ml-1 font-[poppins] text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
                  Management Controls
                </p>

                {isOwner && (
                  <button
                    onClick={handlePromote}
                    disabled={isLoading || player.userId === captainId}
                    className="group flex w-full items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4 transition-all hover:bg-amber-100 dark:border-amber-500/10 dark:bg-amber-500/5 dark:hover:bg-amber-500/10"
                  >
                    <Crown className="h-4 w-4 text-amber-500" />
                    <span className="font-[urbanist] text-sm font-bold tracking-tight text-amber-700 dark:text-amber-400">
                      {ownerId === player.userId
                        ? "Owner"
                        : captainId === player.userId
                          ? "Captain"
                          : "Promote to Captain"}
                    </span>
                  </button>
                )}
                {ownerId !== player.userId && (
                  <button
                    onClick={handleRemove}
                    disabled={isRemoving || ownerId === player.userId}
                    className="group flex w-full items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 transition-all hover:bg-red-100 dark:border-red-500/10 dark:bg-red-500/5 dark:hover:bg-red-500/10"
                  >
                    <UserMinus className="h-4 w-4 text-red-500" />
                    <span className="font-[urbanist] text-sm font-bold tracking-tight text-red-700 dark:text-red-400">
                      Remove from Team
                    </span>
                  </button>
                )}
              </>
            ) : null}
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 bg-white py-3 font-[poppins] text-[10px] font-bold tracking-wide text-slate-600 uppercase transition-all hover:bg-slate-100 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300"
          >
            Dismiss
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerModal;
