"use client";

import Cropper from "react-easy-crop";
import { useState } from "react";
import type { Area } from "@/utils/cropImg";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

type Props = {
  image: string;
  aspect: number;
  onCropComplete: (area: Area) => void;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
};

export default function ImageCropper({
  image,
  aspect,
  onCropComplete,
  isOpen,
  onClose,
  onSave,
}: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crop the image</DialogTitle>
          <DialogDescription>Description</DialogDescription>
        </DialogHeader>
        <div className="relative min-h-[300px] w-full bg-black">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, croppedAreaPixels) => onCropComplete(croppedAreaPixels as Area)}
          />
        </div>
        <button
          onClick={onSave}
          className="z-40 cursor-pointer rounded-md bg-slate-950 px-4 py-2 font-[urbanist] text-sm text-white"
        >
          Save
        </button>
      </DialogContent>
    </Dialog>
  );
}
