import type { Availability } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { getAvailabilityConfig } from "@/utils/helper/availibility";

interface AvailabilityBadgeProps {
  availability: Availability;
  className?: string;
}

export const AvailabilityBadge = ({ availability, className }: AvailabilityBadgeProps) => {
  const { label, className: colorClass } = getAvailabilityConfig(availability);

  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", colorClass, className)}>
      {label}
    </span>
  );
};
