import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UserDetailsForm from "../../_components/UserDetailsForm";
import { Separator } from "@/components/ui/separator";

interface EditDetailsModalProps {}

const EditDetailsModal = ({}: EditDetailsModalProps) => {
  const isOpen = true;
  const onClose = () => {};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[80vh] w-full max-w-sm flex-col rounded-lg bg-white font-[poppins] dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="font-[cal_sans] text-lg font-normal tracking-wide">
            Update Details
          </DialogTitle>
          <Separator />
        </DialogHeader>
        <UserDetailsForm />
      </DialogContent>
    </Dialog>
  );
};

export default EditDetailsModal;
