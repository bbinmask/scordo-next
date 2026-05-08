import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  highlight?: string;
  className?: string;
  action?: React.ReactNode;
}

export const SectionHeader = ({ title, highlight, className, action }: SectionHeaderProps) => (
  <div className={cn("mb-6 flex items-center justify-between px-4", className)}>
    <h3 className="flex items-center gap-3 text-2xl font-black tracking-tighter text-slate-900 uppercase italic dark:text-white">
      {title} {highlight && <span className="primary-heading pr-2">{highlight}</span>}
    </h3>
    <div className="mx-6 h-px flex-1 bg-slate-100 dark:bg-white/5" />
    {action}
  </div>
);
