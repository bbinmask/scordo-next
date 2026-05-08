import { cn } from "@/lib/utils";

interface TeamAvatarProps {
  name: string;
  logo?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
  zIndex?: boolean;
}

const SIZES = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
} as const;

const TeamAvatar = ({ name, logo, size = "md", className, zIndex }: TeamAvatarProps) => {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("");

  const src = logo || `https://placehold.co/48x48/A62626/FFFFFF?text=${initials}`;

  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden rounded-xl",
        "border-2 border-slate-50 bg-white shadow-lg",
        "dark:border-[#020617] dark:bg-slate-800",
        SIZES[size],
        zIndex && "z-10",
        className
      )}
    >
      <img src={src} className="h-full w-full object-cover" alt={`${name} logo`} />
    </div>
  );
};

export default TeamAvatar;
