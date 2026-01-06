"use client";

import ImageCropper from "@/components/ImageCropper";
import { getCroppedImage } from "@/utils/cropImg";
import type { Area } from "@/utils/cropImg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Team } from "@/generated/prisma";
import { Dispatch, ReactNode, SetStateAction, useRef, useState } from "react";
import { ImageIcon, Save } from "lucide-react";
import Spinner from "@/components/Spinner";
import { cn } from "@/lib/utils";
import { useOnClickOutside } from "usehooks-ts";
import { useAction } from "@/hooks/useAction";
import { updateTeamLogoAndBanner } from "@/actions/team-actions";
import { toast } from "sonner";

interface UpdateTeamImgModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team;
}

const UpdateTeamImgModal = ({ isOpen, onClose, team }: UpdateTeamImgModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-sm rounded-lg font-[poppins]">
        <DialogHeader>
          <DialogTitle className="p-0 font-[cal_sans] text-2xl font-normal tracking-wide">
            {`Update`}
            <span className="primary-heading ml-1">{team.abbreviation.toUpperCase()}</span>
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            {`Update ${team.abbreviation}'s logo and banner.`}
          </DialogDescription>

          <div>
            <UpdateLogoAndBanner
              data={{
                id: team.id,
                banner: team.banner,
                logo: team.logo,
                abbreviation: team.abbreviation,
              }}
              onClose={onClose}
            />
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

interface UploadImgProps {
  type: "logo" | "banner";
  isActive: { logo: boolean; banner: boolean };
  setIsActive: Dispatch<
    SetStateAction<{
      logo: boolean;
      banner: boolean;
    }>
  >;
  onSave: (file: File, type: "logo" | "banner") => void;
}

export function UploadImg({ type, onSave, isActive, setIsActive }: UploadImgProps) {
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
    setIsActive({ logo: false, banner: false });
    handleClose();
  };

  return (
    <div className="h-full w-full space-y-4">
      {type === "logo" && isActive.logo && (
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

      {type === "banner" && isActive.banner && (
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

      {imageSrc && (
        <>
          <ImageCropper
            onSave={handleSaveImage}
            isOpen={isOpen}
            onClose={handleClose}
            image={imageSrc}
            aspect={type == "logo" ? 1 / 1 : 16 / 9}
            onCropComplete={setCropArea}
          />
        </>
      )}
    </div>
  );
}

interface UpdateLogoAndBannerProps {
  data: { id: string; banner: string | null; logo: string | null; abbreviation: string };
  onClose: () => void;
}

export function UpdateLogoAndBanner({
  data,

  onClose,
}: UpdateLogoAndBannerProps) {
  const [logo, setLogo] = useState(data.logo || "./team.svg");
  const [banner, setBanner] = useState(data.banner || "");
  const [isActive, setIsActive] = useState({
    logo: false,
    banner: false,
  });
  const [logoFile, setLogoFile] = useState<File>();
  const [bannerFile, setBannerFile] = useState<File>();

  const logoRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const bannerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const wrapperRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  const { execute, isLoading } = useAction(updateTeamLogoAndBanner, {
    onSuccess: (data) => {
      toast.success("Changes successfull.");
      onClose();
    },
    onError: (err) => {
      toast.error(err);
    },
  });

  const handleSave = async (file: File, type: "logo" | "banner") => {
    const url = URL.createObjectURL(file);

    if (type === "logo") {
      setLogo(url);
      setLogoFile(file);
    } else {
      setBanner(url);
      setBannerFile(file);
    }
  };

  const handleReset = (type: "logo" | "banner") => {
    if (type === "logo") {
      setLogoFile(undefined);
      setLogo(data.logo || "");
    }
    if (type === "banner") {
      setLogoFile(undefined);
      setBanner(data.banner || "");
    }
  };

  const handleUpdate = () => {
    if (data.banner === banner) {
      setBannerFile(undefined);
    }
    if (data.logo === logo) {
      setLogoFile(undefined);
    }

    if (data.banner === banner && data.logo === logo) {
      onClose();
      return;
    }

    execute({ id: data.id, logo: logoFile, banner: bannerFile, abbreviation: data.abbreviation });
  };

  useOnClickOutside(wrapperRef, () => {
    setIsActive({ logo: false, banner: false });
  });

  useOnClickOutside(bannerRef, () => {
    setIsActive((prev) => ({ ...prev, banner: false }));
  });

  useOnClickOutside(logoRef, () => {
    setIsActive((prev) => ({ ...prev, logo: false }));
  });

  return (
    <div className="mx-auto max-w-4xl space-y-8" ref={wrapperRef}>
      <div className="grid grid-cols-3 gap-8">
        {/* Logo Section */}
        <div className="grid justify-center space-y-4" ref={logoRef}>
          <label className="secondary-text block font-[poppins] text-sm font-semibold">Logo</label>
          <div className="flex flex-col items-center space-y-4">
            <ImagePreview
              onClick={() => {
                setIsActive((prev) => ({ ...prev, logo: true }));
              }}
              url={logo}
              type="logo"
            >
              <UploadImg
                isActive={isActive}
                setIsActive={setIsActive}
                onSave={handleSave}
                type="logo"
              />
            </ImagePreview>
          </div>
        </div>

        {/* Banner Section */}
        <div className="col-span-2 grid justify-center space-y-4" ref={bannerRef}>
          <label className="secondary-text block text-sm font-semibold">Team Banner</label>
          <div className="space-y-4">
            <ImagePreview
              onClick={() => {
                setIsActive((prev) => ({ ...prev, banner: true }));
              }}
              url={banner}
              type="banner"
            >
              <UploadImg
                isActive={isActive}
                setIsActive={setIsActive}
                onSave={handleSave}
                type="banner"
              />
            </ImagePreview>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-6 sm:flex-row">
        <div className="flex w-full items-center gap-3 sm:w-auto">
          <button
            onClick={() => {
              handleReset("logo");
              handleReset("banner");
            }}
            disabled={isLoading}
            className="secondary-btn flex-1 px-4 py-2 text-sm font-semibold transition-colors hover:text-gray-900 disabled:opacity-50 sm:flex-none"
          >
            Reset
          </button>
          <button
            onClick={handleUpdate}
            // disabled={isLoading}
            className={`primary-btn flex flex-1 items-center justify-center rounded-md px-6 py-2 text-sm font-bold text-white hover:opacity-80 active:scale-95 disabled:opacity-70 sm:flex-none`}
          >
            {isLoading ? (
              <Spinner />
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Update
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

const ImagePreview = ({
  url,
  type,
  children,
  className,
  onClick,
}: {
  url: string;
  type: "logo" | "banner";
  children: ReactNode;
  className?: string;
  onClick: () => void;
}) => {
  const isLogo = type === "logo";
  const fallback = `https://placehold.co/${isLogo ? "200x200" : "800x200"}/f3f4f6/a1a1aa?text=${type}`;

  return (
    <div
      onClick={onClick}
      className={cn(
        `border-input relative overflow-hidden border-2 border-dashed bg-gray-600 dark:border-gray-200 dark:bg-gray-100 ${
          isLogo
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

export default UpdateTeamImgModal;
