import { Availability } from "@/generated/prisma";
import { CurrentOverBalls } from "@/lib/types";

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
  if (label.startsWith("WD")) {
    return "bg-orange-500 text-white font-semibold";
  }

  if (label.startsWith("W")) {
    return "bg-red-600 text-white font-bold";
  }

  if (label.startsWith("NB")) {
    return "bg-yellow-500 text-black font-semibold";
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

export const ICON_COLOR_CLASSES: Record<string, string> = {
  emerald: "bg-emerald-500/10 text-emerald-500",
  green: "bg-green-500/10 text-green-500",
  blue: "bg-blue-500/10 text-blue-500",
  red: "bg-red-500/10 text-red-500",
  amber: "bg-amber-500/10 text-amber-500",
  purple: "bg-purple-500/10 text-purple-500",
  slate: "bg-slate-500/10 text-slate-500",
};
