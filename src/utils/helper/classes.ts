import { Availability } from "@/generated/prisma";

export const getAvailabilityClass = (availability: Availability) => {
  switch (availability) {
    case "available":
      return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
    case "injured":
      return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
    case "on_break":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
    default:
      return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200";
  }
};
