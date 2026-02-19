import { LucideIcon } from "lucide-react";

interface InfoCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  subValue: string;
}

export const InfoCard = ({
  label,
  value,
  icon: Icon,
  color = "green",
  subValue = "",
}: InfoCardProps) => (
  <div className="group hover-card relative overflow-hidden rounded-3xl p-6">
    <div className="relative">
      <div
        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600 transition-transform group-hover:scale-110 dark:bg-green-500/10 dark:text-green-400`}
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
