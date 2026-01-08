import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UserDetailsForm from "../../_components/UserDetailsForm";
import { Separator } from "@/components/ui/separator";
import { User } from "@/generated/prisma";
import { useDetailsModal } from "@/hooks/store/use-profile";

interface EditDetailsModalProps {
  user: User;
}

const EditDetailsModal = ({ user }: EditDetailsModalProps) => {
  const { isOpen, onClose } = useDetailsModal();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[80vh] w-full max-w-sm flex-col rounded-lg bg-white font-[poppins] dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="font-[cal_sans] text-lg font-normal tracking-wide">
            Update Details
          </DialogTitle>
          <Separator />
        </DialogHeader>
        <UserDetailsForm user={user} />
      </DialogContent>
    </Dialog>
  );
};

export default EditDetailsModal;
