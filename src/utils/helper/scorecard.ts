import { Ball } from "@/generated/prisma";

const getPartnership = (ballData: Ball[]) => {
  return 0;
};

const getStrikeRate = (runs: number, balls: number) => {
  if (balls === 0) return 0;

  return ((runs / balls) * 100).toFixed(1);
};

const getEcon = (runs: number, overs: number, balls: number) => {
  if (overs === 0) {
    if (balls === 0) return 0;
    return (runs / (balls / 6)).toFixed(2);
  } else {
    return (runs / overs).toFixed(2);
  }
};

const getCRR = (runs: number, balls: number) => {
  return Number(0).toFixed(2);
};

const getRR = (runs: number, balls: number) => {
  return Number(0).toFixed(2);
};

export { getPartnership, getEcon, getStrikeRate, getCRR, getRR };
