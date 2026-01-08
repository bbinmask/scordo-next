import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UserDetailsForm from "../../_components/UserDetailsForm";
import { User } from "@/generated/prisma";

interface UpdateProfileModalProps {
  user: User;
}

const UpdateProfileModal = ({ user }: UpdateProfileModalProps) => {
  const isOpen = true;
  const onClose = () => {};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-sm rounded-lg bg-white font-[poppins] dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {/* {`Update ${team.abbreviation.toUpperCase()} Details`} */}
          </DialogTitle>
          <DialogDescription className="text-gray-500">{}</DialogDescription>
        </DialogHeader>
        <UserDetailsForm user={user} />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileModal;
