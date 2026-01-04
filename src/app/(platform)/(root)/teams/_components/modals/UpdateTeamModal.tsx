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
import { SubmitHandler } from "react-hook-form";
import { ITeamForm } from "../../types";
import { useAction } from "@/hooks/useAction";
import { updateTeam } from "@/actions/team-actions";
import { useRouter } from "next/navigation";

interface UpdateTeamModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  team: Team;
  isOwner: boolean;
}

const UpdateTeamModal = ({ isOpen, setIsOpen, team, isOwner }: UpdateTeamModalProps) => {
  const router = useRouter();

  const { execute, isLoading } = useAction(updateTeam, {
    onSuccess: (data) => {
      toast.success("Team updated!");
      onClose();
      router.push(`/teams/${data.abbreviation}`);
    },
    onError: (err) => {
      toast.error(err);
    },
  });

  const onSubmit: SubmitHandler<ITeamForm> = async (data) => {
    const { abbreviation, address, name, type } = data;

    if (
      team.abbreviation === abbreviation &&
      team.address === address &&
      team.name === name &&
      team.type === type
    ) {
      onClose();
      return;
    }

    execute({ abbreviation, address, type, name, id: team.id });
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
        <TeamForm onSubmit={onSubmit} team={team}>
          <div className="mt-2 flex justify-end space-x-3">
            <button
              onClick={onClose}
              type="button"
              className="rounded-md border border-gray-300 px-4 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={
                "rounded-md bg-blue-600 px-4 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
              }
            >
              {isLoading ? <Spinner /> : "Update"}
            </button>
          </div>
        </TeamForm>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTeamModal;
