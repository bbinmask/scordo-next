import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/generated/prisma";
import { ImagePreview, UploadImg } from "@/components/Image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import { useProfileModal } from "@/hooks/store/use-profile";
import { useAction } from "@/hooks/useAction";
import { updateUserProfile } from "@/actions/user-actions";
import { toast } from "sonner";

interface UpdateProfileModalProps {
  user: User;
}

const UpdateProfileModal = ({ user }: UpdateProfileModalProps) => {
  const { isOpen, onClose } = useProfileModal();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-sm rounded-lg bg-white font-[poppins] dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Update Profile</DialogTitle>
          <DialogDescription className="text-gray-500">{}</DialogDescription>
        </DialogHeader>
        <UpdateAvatar user={user} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

interface UpdateAvatarProps {
  user: User;
  onClose: () => void;
}

const UpdateAvatar = ({ user, onClose }: UpdateAvatarProps) => {
  const [avatarUrl, setAvatarUrl] = useState(user.avatar || "");
  const [avatar, setAvatar] = useState<File>();

  const handleSave = async (file: File) => {
    const image = URL.createObjectURL(file);
    setAvatar(file);
    setAvatarUrl(image);
  };

  const { execute, isLoading } = useAction(updateUserProfile, {
    onSuccess() {
      toast.success("Profile updated!");
      onClose();
    },
    onError(error) {
      toast.error(error);
    },
  });

  const handleUpdate = () => {
    if (!avatar) return;

    execute({ avatar: avatar });
  };

  return (
    <div className="center flex flex-col space-y-4">
      <div className="cursor-pointer">
        <ImagePreview url={avatarUrl} type="avatar">
          <UploadImg url={avatarUrl} onSave={handleSave} type="avatar" />
        </ImagePreview>
      </div>

      <Button
        type="button"
        onClick={handleUpdate}
        className="primary-btn mt-4 w-28 max-w-xs cursor-pointer font-[urbanist] font-bold hover:opacity-80 active:scale-90 lg:w-full"
        disabled={isLoading}
      >
        {isLoading ? <Spinner /> : "Update"}
      </Button>
    </div>
  );
};

export default UpdateProfileModal;
