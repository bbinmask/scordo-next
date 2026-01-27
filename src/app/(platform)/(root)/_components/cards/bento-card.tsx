import { LucideIcon } from "lucide-react";

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  title: string;
  icon?: LucideIcon;
}

export const BentoCard = ({
  children,
  className = "",
  title = "",
  icon: IconComponent,
}: BentoCardProps) => (
  <div
    className={`hover-card rounded-3xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-md transition-all hover:shadow-md dark:border-white/10 dark:bg-slate-900/50 ${className}`}
  >
    {title && (
      <div className="mb-4 flex items-center gap-2 text-sm font-medium tracking-wider text-slate-400 uppercase">
        {IconComponent && <IconComponent className="h-4 w-4" />}
        {title}
      </div>
    )}
    {children}
  </div>
);
