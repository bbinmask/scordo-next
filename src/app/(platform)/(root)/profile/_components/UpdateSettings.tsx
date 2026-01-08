import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useSettingModal } from "@/hooks/store/use-profile";

interface UpdateSettingModalProps {}

const UpdateSettingModal = ({}: UpdateSettingModalProps) => {
  const { isOpen, onClose } = useSettingModal();

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent></DialogContent>
    </Dialog>
  );
};

export default UpdateSettingModal;
