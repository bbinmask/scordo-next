import { cn } from "@/lib/utils";
import { ICON_COLOR_CLASSES } from "@/utils/helper/classes";
import type { LucideIcon } from "lucide-react";

interface StatBoxProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  subLabel?: string;
  color?: keyof typeof ICON_COLOR_CLASSES;
  className?: string;
}

export const StatBox = ({
  label,
  value,
  icon: Icon,
  subLabel,
  color = "emerald",
  className,
}: StatBoxProps) => (
  <div
    className={cn(
      "group rounded-[2rem] border border-slate-200 bg-slate-200 p-5 shadow-sm ring-1 ring-slate-200/50",
      "transition-all duration-300 ease-in-out hover:shadow-md",
      "dark:border-white/5 dark:bg-slate-900 dark:text-slate-300",
      "dark:ring-slate-700/50 dark:hover:bg-slate-800/90 dark:hover:text-white",
      "dark:hover:shadow-lg dark:hover:ring-slate-600",
      className
    )}
  >
    <div className="mb-3 flex items-start justify-between">
      <div
        className={cn(
          "rounded-xl p-2.5 transition-transform group-hover:scale-110",
          ICON_COLOR_CLASSES[color] ?? ICON_COLOR_CLASSES.emerald
        )}
      >
        <Icon size={18} />
      </div>
      {subLabel && (
        <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
          {subLabel}
        </span>
      )}
    </div>
    <p className="mb-1 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">{label}</p>
    <p className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic dark:text-white">
      {value}
    </p>
  </div>
);
