import { cn } from "@/lib/utils";
import { getCroppedImage } from "@/utils/cropImg";
import { ImageIcon } from "lucide-react";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { Area } from "react-easy-crop";
import ImageCropper from "./ImageCropper";

export const ImagePreview = ({
  url,
  type,
  children,
  className,
  onClick,
}: {
  url: string;
  type: "logo" | "banner" | "avatar";
  children: ReactNode;
  className?: string;
  onClick: () => void;
}) => {
  const isBanner = type === "banner";
  const fallback = `https://placehold.co/${!isBanner ? "200x200" : "800x200"}/f3f4f6/a1a1aa?text=${type}`;

  return (
    <div
      onClick={onClick}
      className={cn(
        `border-input relative overflow-hidden border-2 border-dashed bg-gray-600 dark:border-gray-200 dark:bg-gray-100 ${
          !isBanner
            ? "aspect-square h-24 rounded-full lg:h-32"
            : "aspect-video h-24 rounded-xl lg:h-40"
        }`,
        className
      )}
    >
      <img
        src={url || fallback}
        alt={`${type} preview`}
        className="h-full w-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = fallback;
        }}
      />
      {children}
    </div>
  );
};

export interface UploadImgProps {
  type: "logo" | "banner" | "avatar";
  isActive: boolean;
  onDeactive: () => void;
  onSave: (file: File, type: "logo" | "banner" | "avatar") => void;
}

export function UploadImg({ type, onSave, isActive, onDeactive }: UploadImgProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [cropArea, setCropArea] = useState<Area | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(e.target.files[0]);
    handleOpen();
  }

  const handleOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSaveImage = async () => {
    if (!imageSrc || !cropArea) return;

    const file = await getCroppedImage(imageSrc, cropArea, `${type}.jpg`);

    // const formData = new FormData();
    // formData.append("file", file);

    onSave(file, type);
    onDeactive();
    handleClose();
  };

  return (
    <div className="h-full w-full space-y-4">
      {isActive && (
        <>
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 z-40 h-full w-full cursor-pointer opacity-0"
            onChange={onSelectFile}
            onClick={(e) => e.stopPropagation()}
          />

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-gray-300" />
          </div>
        </>
      )}

      {/* {type === "banner" && isActive.banner && (
        <>
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 z-40 h-full w-full cursor-pointer opacity-0"
            onChange={onSelectFile}
            onClick={(e) => e.stopPropagation()}
          />

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-gray-300" />
          </div>
        </>
      )} */}

      {imageSrc && (
        <>
          <ImageCropper
            onSave={handleSaveImage}
            isOpen={isOpen}
            onClose={handleClose}
            image={imageSrc}
            aspect={type == "banner" ? 16 / 9 : 1 / 1}
            onCropComplete={setCropArea}
          />
        </>
      )}
    </div>
  );
}
