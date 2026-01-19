import { Button } from "@/components/ui/button";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { EllipsisVertical } from "lucide-react";

interface OptionsPopoverProps {
  team: Team;
  // onEditOpen: () => void;
  // onEditClose: () => void;
  // isEditOpen: boolean;
  // isProfileOpen: boolean;
  // onProfileOpen: () => void;
  // onProfileClose: () => void;
  // isReqOpen: boolean;
  // onReqOpen: () => void;
  // onReqClose: () => void;
}
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useUpdateLogoAndBanner, useUpdateTeam } from "@/hooks/store/use-team";
import { useNotificationModal } from "@/hooks/store/use-team";
import UpdateTeamImgModal from "./modals/UpdateTeamImgModal";
import { Team } from "@/generated/prisma";
import UpdateTeamModal from "./modals/UpdateTeamModal";
import Requests from "./Requests";
import { ChangeEvent, useState } from "react";
import { debounce } from "lodash";
import { useAction } from "@/hooks/useAction";
import { updateRecruiting } from "@/actions/team-actions";
import { toast } from "sonner";
const OptionsPopover = ({ team }: OptionsPopoverProps) => {
  const {
    isOpen: isProfileOpen,
    onClose: onProfileClose,
    onOpen: onProfileOpen,
  } = useUpdateLogoAndBanner();
  const { isOpen: isEditOpen, onClose: onEditClose, onOpen: onEditOpen } = useUpdateTeam();

  const { execute, isLoading } = useAction(updateRecruiting, {
    onSuccess(data) {
      setIsRecruiting(data.isRecruiting);
      toast.success("Recruiting updated!");
    },
    onError(error) {
      toast.error(error);
    },
  });

  const [isRecruiting, setIsRecruiting] = useState(team.isRecruiting);

  const { isOpen: isReqOpen, onClose: onReqClose, onOpen: onReqOpen } = useNotificationModal();

  const handleRecruiting = debounce((e: ChangeEvent<HTMLInputElement>) => {
    const recruiting = e.target.checked;
    if (recruiting === team.isRecruiting) return;
    execute({ abbreviation: team.abbreviation, recruiting });
  }, 2000);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <EllipsisVertical className="h-9 w-9 rounded-lg border border-white/20 bg-white/10 p-2 text-white backdrop-blur-lg transition-all hover:bg-white/20" />
      </PopoverTrigger>
      <PopoverContent align="end" className="bg-gray-50 p-0 dark:bg-gray-800">
        <h1 className="primary-text mb-2 px-4 py-2 font-[poppins] text-lg font-semibold tracking-wide">
          Options
        </h1>
        <Separator />
        <ul className="rounded-xl">
          <li
            onClick={onEditOpen}
            className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-300 hover:opacity-80 dark:hover:bg-gray-700"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-gray-800 dark:bg-gray-500"></span>
            <span className="primary-text font-[urbanist] text-base font-semibold">
              Edit Details
            </span>
          </li>

          <li
            onClick={onProfileOpen}
            className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-300 hover:opacity-80 dark:hover:bg-gray-700"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-gray-800 dark:bg-gray-500"></span>
            <span className="primary-text font-[urbanist] text-base font-semibold">
              Update Profile
            </span>
          </li>

          <li
            onClick={onReqOpen}
            className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-300 hover:opacity-80 dark:hover:bg-gray-700"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-gray-800 dark:bg-gray-500"></span>
            <span className="primary-text font-[urbanist] text-base font-semibold">Requests</span>
          </li>

          <li>
            <label
              htmlFor="isRecruiting"
              className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 hover:bg-gray-300 hover:opacity-80 dark:hover:bg-gray-700"
            >
              <div className="center flex gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-gray-800 dark:bg-gray-500" />
                <span className="primary-text font-[urbanist] text-base font-semibold">
                  Recruiting Status
                </span>
              </div>

              {/* Recruiting */}
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
            </label>
          </li>
        </ul>
        <>
          <UpdateTeamImgModal team={team} isOpen={isProfileOpen} onClose={onProfileClose} />
          <UpdateTeamModal isOpen={isEditOpen} onClose={onEditClose} team={team} />
          {/* <Requests data={[]} /> */}
        </>
      </PopoverContent>
    </Popover>
  );
};

export default OptionsPopover;
