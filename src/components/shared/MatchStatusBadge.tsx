import type { MatchStatus } from "@/generated/prisma";
import { cn } from "@/lib/utils";

interface StatusConfig {
  label: string;
  className: string;
  live: boolean;
}

const STATUS_CONFIG: Partial<Record<MatchStatus | string, StatusConfig>> = {
  in_progress: { label: "Live Feed", className: "text-red-500", live: true },
  inning_completed: { label: "Live", className: "text-red-500", live: true },
  not_started: {
    label: "Not Started",
    className: "text-slate-500",
    live: false,
  },
  completed: { label: "Completed", className: "text-slate-500", live: false },
  stopped: { label: "Stopped", className: "text-yellow-500", live: false },
};

const FALLBACK: StatusConfig = {
  label: "Unknown",
  className: "text-slate-400",
  live: false,
};

interface MatchStatusBadgeProps {
  status: string;
  className?: string;
}

export const MatchStatusBadge = ({ status, className }: MatchStatusBadgeProps) => {
  const config = STATUS_CONFIG[status] ?? FALLBACK;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[9px] font-black uppercase italic",
        config.className,
        className
      )}
    >
      {config.live && <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />}
      {config.label}
    </span>
  );
};
