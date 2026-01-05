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
import { Dispatch, SetStateAction, useState } from "react";

interface UpdateTeamImgModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  team: Team;
}

const UpdateTeamImgModal = ({ isOpen, setIsOpen, team }: UpdateTeamImgModalProps) => {
  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-sm rounded-lg bg-white font-[poppins] dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {`Update ${team.abbreviation.toUpperCase()} Details`}
          </DialogTitle>
          <DialogDescription className="text-gray-500">{}</DialogDescription>

          <div>
            <UploadExample />
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export function UploadExample() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [cropArea, setCropArea] = useState<Area | null>(null);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) return;

    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(e.target.files[0]);
  }

  async function handleUpload() {
    if (!imageSrc || !cropArea) return;

    const file = await getCroppedImage(
      imageSrc,
      cropArea,
      "logo.jpg" // or banner.jpg
    );

    const formData = new FormData();
    formData.append("file", file);

    await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
  }

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={onSelectFile} />

      {imageSrc && (
        <>
          {/* LOGO */}
          <ImageCropper image={imageSrc} aspect={1 / 1} onCropComplete={setCropArea} />

          {/* BANNER */}
          {/* aspect={16 / 9} or 3 / 1 */}

          <button onClick={handleUpload} className="bg-black px-4 py-2 text-white">
            Upload
          </button>
        </>
      )}
    </div>
  );
}

// function UpdateLogoAndBanner({ initialLogo, initialBanner, onSave }) {
//   const [logo, setLogo] = useState(initialLogo || "");
//   const [banner, setBanner] = useState(initialBanner || "");
//   const [isSaving, setIsSaving] = useState(false);
//   const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null

//   const handleSave = async () => {
//     setIsSaving(true);
//     setSaveStatus(null);

//     try {
//       // Simulate API call delay
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       onSave({ logo, banner });
//       setSaveStatus("success");
//       setTimeout(() => setSaveStatus(null), 3000);
//     } catch (error) {
//       setSaveStatus("error");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleReset = (type) => {
//     if (type === "logo") setLogo(initialLogo || "");
//     if (type === "banner") setBanner(initialBanner || "");
//   };

//   const ImagePreview = ({ url, type }) => {
//     const isLogo = type === "logo";
//     const fallback = `https://placehold.co/${isLogo ? "200x200" : "800x200"}/f3f4f6/a1a1aa?text=No+${type}+set`;

//     return (
//       <div
//         className={`relative overflow-hidden border-2 border-dashed border-gray-200 bg-gray-100 ${
//           isLogo ? "h-32 w-32 rounded-full" : "h-40 w-full rounded-xl"
//         }`}
//       >
//         <img
//           src={url || fallback}
//           alt={`${type} preview`}
//           className="h-full w-full object-cover"
//           onError={(e) => {
//             e.target.src = fallback;
//           }}
//         />
//         {!url && (
//           <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
//             <ImageIcon className="h-8 w-8 text-gray-300" />
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="mx-auto max-w-4xl space-y-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
//       <div>
//         <h2 className="text-2xl font-bold text-gray-900">Team Branding</h2>
//         <p className="text-gray-500">Update your team's visual identity on the platform.</p>
//       </div>

//       <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
//         {/* Logo Section */}
//         <div className="space-y-4">
//           <label className="block text-sm font-semibold text-gray-700">Team Logo</label>
//           <div className="flex flex-col items-center space-y-4">
//             <ImagePreview url={logo} type="logo" />
//             <div className="w-full space-y-2">
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={logo}
//                   onChange={(e) => setLogo(e.target.value)}
//                   placeholder="Logo Image URL"
//                   className="w-full rounded-lg border border-gray-300 py-2 pr-10 pl-3 text-sm transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
//                 />
//                 {logo && (
//                   <button
//                     onClick={() => setLogo("")}
//                     className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     <X size={16} />
//                   </button>
//                 )}
//               </div>
//               <p className="text-center text-[10px] text-gray-400 italic">
//                 Recommended: 512x512px PNG or JPG
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Banner Section */}
//         <div className="space-y-4 md:col-span-2">
//           <label className="block text-sm font-semibold text-gray-700">Team Banner</label>
//           <div className="space-y-4">
//             <ImagePreview url={banner} type="banner" />
//             <div className="space-y-2">
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={banner}
//                   onChange={(e) => setBanner(e.target.value)}
//                   placeholder="Banner Image URL"
//                   className="w-full rounded-lg border border-gray-300 py-2 pr-10 pl-3 text-sm transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
//                 />
//                 {banner && (
//                   <button
//                     onClick={() => setBanner("")}
//                     className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     <X size={16} />
//                   </button>
//                 )}
//               </div>
//               <p className="text-[10px] text-gray-400 italic">
//                 Recommended: 1200x400px high-resolution landscape
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Action Footer */}
//       <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-6 sm:flex-row">
//         <div className="flex items-center gap-2">
//           {saveStatus === "success" && (
//             <span className="animate-in fade-in slide-in-from-left-2 flex items-center text-sm font-medium text-green-600">
//               <CheckCircle size={16} className="mr-1.5" />
//               Assets updated successfully!
//             </span>
//           )}
//           {saveStatus === "error" && (
//             <span className="animate-in fade-in slide-in-from-left-2 flex items-center text-sm font-medium text-red-600">
//               <AlertCircle size={16} className="mr-1.5" />
//               Failed to save changes.
//             </span>
//           )}
//         </div>

//         <div className="flex w-full items-center gap-3 sm:w-auto">
//           <button
//             onClick={() => {
//               handleReset("logo");
//               handleReset("banner");
//             }}
//             disabled={isSaving}
//             className="flex-1 px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:text-gray-900 disabled:opacity-50 sm:flex-none"
//           >
//             Reset
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={isSaving}
//             className={`flex flex-1 items-center justify-center rounded-xl px-6 py-2 text-sm font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-70 sm:flex-none ${
//               isSaving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200"
//             }`}
//           >
//             {isSaving ? (
//               <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
//             ) : (
//               <Save size={18} className="mr-2" />
//             )}
//             {isSaving ? "Saving..." : "Update Branding"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
// export default UpdateTeamImgModal;

export default UpdateTeamImgModal;
