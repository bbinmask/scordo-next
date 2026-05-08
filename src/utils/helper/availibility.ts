// src/utils/helper/availability.ts
import type { Availability } from "@/generated/prisma";

interface AvailabilityConfig {
  label: string;
  className: string;
}

const AVAILABILITY_CONFIG: Record<Availability, AvailabilityConfig> = {
  available: {
    label: "Available",
    className: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
  },
  injured: {
    label: "Injured",
    className: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  },
  on_break: {
    label: "On Break",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
  },
};

const AVAILABILITY_FALLBACK: AvailabilityConfig = {
  label: "Unknown",
  className: "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200",
};

export const getAvailabilityConfig = (availability: Availability): AvailabilityConfig =>
  AVAILABILITY_CONFIG[availability] ?? AVAILABILITY_FALLBACK;

export const checkAvailability = (a: Availability) => getAvailabilityConfig(a).label;
export const getAvailabilityClass = (a: Availability) => getAvailabilityConfig(a).className;
