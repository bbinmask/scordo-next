import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AskToJoinTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AskToJoinTeamModal = ({ isOpen, onClose }: AskToJoinTeamModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Teams</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

interface JoinTheirTeamProps {}

const modal = ({}: JoinTheirTeamProps) => {
  return <div>modal</div>;
};

export default modal;
