import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { EllipsisVertical, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUpdateLogoAndBanner, useUpdateTeam } from "@/hooks/store/use-team";
import { useNotificationModal } from "@/hooks/store/use-team";
import UpdateTeamImgModal from "./modals/UpdateTeamImgModal";
import { Team } from "@/generated/prisma";
import UpdateTeamModal from "./modals/UpdateTeamModal";
import Requests from "./Requests";
import { ChangeEvent, useRef, useState } from "react";
import { debounce } from "lodash";
import { useAction } from "@/hooks/useAction";
import { deleteTeam, updateRecruiting } from "@/actions/team-actions";
import { toast } from "sonner";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { useOnClickOutside } from "usehooks-ts";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { useRouter } from "next/navigation";

interface OptionsPopoverProps {
  team: Team;
}
const OptionsPopover = ({ team }: OptionsPopoverProps) => {
  const {
    isOpen: isProfileOpen,
    onClose: onProfileClose,
    onOpen: onProfileOpen,
  } = useUpdateLogoAndBanner();
  const { isOpen: isEditOpen, onClose: onEditClose, onOpen: onEditOpen } = useUpdateTeam();

  const router = useRouter();

  const popoverRef = useRef<any>(null);

  const { execute: executeRecruiting, isLoading } = useAction(updateRecruiting, {
    onSuccess(data) {
      setIsRecruiting(data.isRecruiting);
      toast.success("Recruiting updated!");
    },
    onError(error) {
      toast.error(error);
    },
  });
  const { execute: executeDelete } = useAction(deleteTeam, {
    onSuccess(data) {
      toast.success("Team Deleted!");
      router.push("/teams");
    },
    onError(error) {
      toast.error(error);
    },
  });

  const { closeConfirmModal, confirmModalState, openConfirmModal } = useConfirmModal();

  const onDelete = () => {
    executeDelete({ id: team.id });
  };

  const [isRecruiting, setIsRecruiting] = useState(team.isRecruiting);

  const { isOpen: isReqOpen, onClose: onReqClose, onOpen: onReqOpen } = useNotificationModal();

  const handleRecruiting = debounce((e: ChangeEvent<HTMLInputElement>) => {
    const recruiting = e.target.checked;
    if (recruiting === team.isRecruiting) return;
    executeRecruiting({ abbreviation: team.abbreviation, recruiting });
  }, 2000);

  useOnClickOutside(popoverRef, () => {
    closeConfirmModal();
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <EllipsisVertical className="h-9 w-9 rounded-lg border border-white/20 bg-white/10 p-2 text-white backdrop-blur-lg transition-all hover:bg-white/20" />
      </PopoverTrigger>

      <PopoverContent
        ref={popoverRef}
        align="end"
        className="animate-in fade-in slide-in-from-top-2 mt-3 w-full max-w-full rounded-[1.5rem] border border-slate-200 bg-white/90 p-2 shadow-2xl backdrop-blur-xl duration-200 dark:border-white/10 dark:bg-slate-900/95"
      >
        <div className="rounded-xl">
          <button
            onClick={onEditOpen}
            className="flex w-full items-center gap-3 rounded-xl p-3 transition-all hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
          >
            <span className="primary-text font-[urbanist] text-base font-semibold">
              Edit Details
            </span>
          </button>

          <button
            onClick={onProfileOpen}
            className="flex w-full items-center gap-3 rounded-xl p-3 transition-all hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
          >
            <span className="primary-text font-[urbanist] text-base font-semibold">
              Update Profile
            </span>
          </button>
          <button
            onClick={onEditOpen}
            className="flex w-full items-center gap-3 rounded-xl p-3 transition-all hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
          >
            <span className="primary-text font-[urbanist] text-base font-semibold">Requests</span>
          </button>

          <button
            onClick={() => {
              openConfirmModal({
                onConfirm: onDelete,
                title: "Delete Team",
                description: "Are you sure you want to delete this team?",
              });
            }}
            className="group flex w-full items-center justify-between gap-3 rounded-xl p-3 transition-all hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
          >
            <span className="primary-text font-[urbanist] text-base font-semibold">Delete</span>
            <Trash className="group-hover:text-red-600" />
          </button>

          {/* Recruiting */}

          <div className="flex w-full items-center justify-between gap-3 rounded-xl p-3 transition-all hover:bg-indigo-50 dark:hover:bg-indigo-500/10">
            <label htmlFor="isRecruiting" className="">
              <div className="center flex gap-2">
                <span className="primary-text font-[urbanist] text-base font-semibold">
                  Recruiting Status
                </span>
              </div>
            </label>
            <div
              className={`switch bg-gradient-to-r ${isRecruiting ? "from-lime-500 via-green-600 to-emerald-600" : "from-teal-900 via-green-900/80 to-gray-400/70"}`}
            >
              <Input
                id="isRecruiting"
                type="checkbox"
                defaultChecked={isRecruiting}
                onChange={(e) => {
                  setIsRecruiting(e.target.checked);
                  handleRecruiting(e);
                }}
                className="relative z-20 h-full w-full rounded border-gray-300 text-emerald-600"
              />
              <div className="slider" />
            </div>
          </div>
        </div>
        <>
          <UpdateTeamImgModal team={team} isOpen={isProfileOpen} onClose={onProfileClose} />
          <UpdateTeamModal isOpen={isEditOpen} onClose={onEditClose} team={team} />
          {/* <Requests data={[]} /> */}
        </>
      </PopoverContent>
      <ConfirmModal {...confirmModalState} onClose={closeConfirmModal} />
    </Popover>
  );
};

export default OptionsPopover;
