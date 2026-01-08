import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UserDetailsForm from "../../_components/UserDetailsForm";
import { User } from "@/generated/prisma";
import { ImagePreview, UploadImg } from "@/components/Image";
import { useState } from "react";
import { IImageType } from "@/types/index.props";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import { useProfileModal } from "@/hooks/store/use-profile";

interface UpdateProfileModalProps {
  user: User;
}

const UpdateProfileModal = ({ user }: UpdateProfileModalProps) => {
  const { isOpen, onClose } = useProfileModal();

  console.log(user);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-sm rounded-lg bg-white font-[poppins] dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Update Profile</DialogTitle>
          <DialogDescription className="text-gray-500">{}</DialogDescription>
        </DialogHeader>
        <UpdateAvatar user={user} />
      </DialogContent>
    </Dialog>
  );
};

interface UpdateAvatarProps {
  user: User;
}

const UpdateAvatar = ({ user }: UpdateAvatarProps) => {
  const [isActive, setIsActive] = useState(false);
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [avatarFile, setAvatarFile] = useState<File>();

  const onDeactive = () => {
    setIsActive(false);
  };

  const isLoading = false;

  const handleSave = (file: File, type: IImageType) => {
    const image = URL.createObjectURL(file);
    setAvatarFile(file);
    setAvatar(image);
  };

  const handleUpdate = () => {
    console.log(avatarFile);
  };

  return (
    <div className="center flex flex-col space-y-4">
      <ImagePreview
        onClick={() => {
          setIsActive(true);
        }}
        url={avatar}
        type="avatar"
      >
        <UploadImg isActive={isActive} onDeactive={onDeactive} onSave={handleSave} type="avatar" />
      </ImagePreview>

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
