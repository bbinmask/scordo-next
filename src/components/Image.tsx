import { cn } from "@/lib/utils";
import { getCroppedImage } from "@/utils/cropImg";
import { ImageIcon, Upload } from "lucide-react";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { Area } from "react-easy-crop";
import ImageCropper from "./ImageCropper";

export const ImagePreview = ({
  url,
  type,
  children,
  className,
}: {
  url: string;
  type: "logo" | "banner" | "avatar";
  children: ReactNode;
  className?: string;
}) => {
  const isBanner = type === "banner";

  return (
    <div
      className={cn(
        `h-32 w-full cursor-pointer rounded-[2rem] border-2 border-dashed border-slate-200 transition-all hover:border-emerald-500 hover:bg-emerald-500/5 dark:border-white/10 dark:hover:border-emerald-500 ${url && !isBanner ? "aspect-square w-32" : "aspect-auto"}`,
        className
      )}
    >
      {url && (
        <img
          src={url}
          alt={`${type} preview`}
          className="h-full w-full rounded-[2rem] object-cover"
        />
      )}
      {children}
    </div>
  );
};

export interface UploadImgProps {
  type: "logo" | "banner" | "avatar";
  url: string;
  onSave: (file: File, type: "logo" | "banner" | "avatar") => Promise<void>;
}

export function UploadImg({ type, url, onSave }: UploadImgProps) {
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
    handleClose();
  };

  return (
    <div className="h-full w-full space-y-4">
      <>
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 z-40 h-full w-full cursor-pointer opacity-0"
          onChange={onSelectFile}
          onClick={(e) => e.stopPropagation()}
        />
        {!url && (
          <div className="group z-50 h-full">
            <label
              htmlFor="logo-input"
              className="flex h-full w-full flex-col items-center justify-center gap-2"
            >
              <Upload className="h-6 w-6 text-slate-400 group-hover:text-emerald-500" />
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Upload Icon
              </span>
            </label>
          </div>
        )}
      </>
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
