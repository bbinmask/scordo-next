import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const COLOR_CLASSES: Record<string, string> = {
  green: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  red: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  purple: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
};

interface InfoCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  subValue?: string;
  color?: keyof typeof COLOR_CLASSES;
  className?: string;
}

export const InfoCard = ({
  label,
  value,
  icon: Icon,
  subValue,
  color = "green",
  className,
}: InfoCardProps) => (
  <div
    className={cn(
      "group hover-card relative overflow-hidden rounded-3xl border border-slate-300 p-6 shadow-lg dark:border-white/10",
      className
    )}
  >
    <div className="relative">
      <div
        className={cn(
          "mb-4 flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110",
          COLOR_CLASSES[color] ?? COLOR_CLASSES.green
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">{label}</p>
      <p className="mt-1 text-lg font-black tracking-tight text-slate-900 uppercase dark:text-white">
        {value}
      </p>
      {subValue && <p className="mt-1 text-[10px] font-bold text-slate-400">{subValue}</p>}
    </div>
  </div>
);
