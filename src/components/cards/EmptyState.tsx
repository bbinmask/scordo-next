import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmptyStateAction {
  label: string;
  href: string;
}

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  className?: string;
  variant?: "default" | "awaiting";
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  className,
  variant = "default",
}: EmptyStateProps) => (
  <div
    className={cn(
      "animate-in fade-in hover-card flex w-full flex-col items-center justify-center rounded-[2.5rem] border p-8 text-center",
      variant === "awaiting"
        ? "slide-in-from-bottom-2 border-dashed border-slate-200 p-12 duration-1000 dark:border-white/10"
        : "slide-in-from-bottom-2 min-h-[16rem] transition-all duration-700",
      className
    )}
  >
    <div className="relative mb-4">
      <div className="animate-bounce rounded-3xl bg-slate-100 p-4 text-slate-400 duration-[3000ms] dark:bg-slate-800 dark:text-slate-600">
        {icon}
      </div>
    </div>

    <div className="mb-6 max-w-xs">
      <h4 className="mb-1 font-[poppins] text-lg font-black text-slate-900 uppercase dark:text-white">
        {title}
      </h4>
      {description && (
        <p className="text-xs leading-relaxed font-medium text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
    </div>

    {action && (
      <Link
        href={action.href}
        className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-2 text-[10px] font-black tracking-widest text-white uppercase shadow-lg shadow-green-500/20 transition-all hover:scale-105 hover:bg-green-700 active:scale-95"
      >
        <PlusCircle className="h-3 w-3" />
        {action.label}
      </Link>
    )}
  </div>
);
