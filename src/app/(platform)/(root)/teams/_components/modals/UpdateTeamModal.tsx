import Spinner from "@/components/Spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Team } from "@/generated/prisma";
import { confirmButtonClass } from "@/styles/buttons";
import { debounce } from "lodash";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import TeamForm from "../TeamForm";
import { cn } from "@/lib/utils";

interface UpdateTeamModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  team: Team;
  isOwner: boolean;
}

const UpdateTeamModal = ({ isOpen, setIsOpen, team, isOwner }: UpdateTeamModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = () => {
    try {
      setIsLoading(true);
    } catch (error: any) {
      toast.error(error.message || "Could not update Team!");
    } finally {
      setIsLoading(false);
    }
  };

  const onClose = () => {
    setIsOpen(false);
  };

  if (!isOwner) {
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-sm rounded-lg bg-white font-[poppins] dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {`Update ${team.abbreviation.toUpperCase()} Details`}
          </DialogTitle>
          <DialogDescription className="text-gray-500">{}</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <TeamForm onSubmit={onSubmit} team={team}>
              <div className="mt-2 flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="rounded-md border border-gray-300 px-4 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  className={
                    "rounded-md bg-blue-600 px-4 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
                  }
                >
                  Update
                </button>
              </div>
            </TeamForm>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTeamModal;
