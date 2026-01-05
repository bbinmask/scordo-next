"use client";

import Cropper from "react-easy-crop";
import { useState } from "react";
import type { Area } from "@/utils/cropImg";

type Props = {
  image: string;
  aspect: number;
  onCropComplete: (area: Area) => void;
};

export default function ImageCropper({ image, aspect, onCropComplete }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  return (
    <div className="relative h-[400px] w-full bg-black">
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
  );
}
