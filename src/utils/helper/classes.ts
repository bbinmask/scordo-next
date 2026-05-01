import { Availability } from "@/generated/prisma";
import { CurrentOverBalls } from "@/lib/types";

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

export const getBallClasses = (ball: CurrentOverBalls): string => {
  if (ball.isWicket) {
    return "bg-red-600 text-white font-bold";
  }

  if (ball.isNoBall) {
    return "bg-yellow-500 text-black font-semibold";
  }

  if (ball.isWide) {
    return "bg-orange-500 text-white font-semibold";
  }

  if (ball.isBye || ball.isLegBye) {
    return "bg-blue-500 text-white";
  }

  if (ball.runs === 6) {
    return "bg-purple-600 text-white font-bold";
  }

  if (ball.runs === 4) {
    return "bg-green-600 text-white font-bold";
  }

  if (ball.runs > 0) {
    return "bg-slate-300 text-black";
  }

  return "bg-gray-200 text-black";
};

export const getBallClassesFromLabel = (label: string): string => {
  // Wicket (W or W1, W2...)
  if (label.startsWith("W")) {
    return "bg-red-600 text-white font-bold";
  }

  if (label.startsWith("NB")) {
    return "bg-yellow-500 text-black font-semibold";
  }

  if (label.startsWith("WD")) {
    return "bg-orange-500 text-white font-semibold";
  }

  if (label.startsWith("B")) {
    return "bg-blue-500 text-white";
  }

  if (label.startsWith("LB")) {
    return "bg-cyan-500 text-white";
  }

  if (label === "6") {
    return "bg-purple-600 text-white font-bold";
  }

  if (label === "4") {
    return "bg-green-600 text-white font-bold";
  }

  if (label === "0") {
    return "bg-gray-300 text-black";
  }

  return "bg-slate-300 text-black";
};
