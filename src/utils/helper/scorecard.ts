import { Ball } from "@/generated/prisma";
import { CurrentOverBalls } from "@/lib/types";

const getPartnership = (ballData: Ball[]) => {
  return 0;
};

const getStrikeRate = (runs: number, balls: number) => {
  if (balls === 0) return 0;

  return ((runs / balls) * 100).toFixed(1);
};

const getEcon = (runs: number, balls: number): number => {
  if (balls === 0) return 0;

  const economy = runs / (balls / 6);

  return Number(economy.toFixed(2));
};

const getOvers = (overs: number, balls: number) => {
  const leftBalls = balls % 6;

  return `${overs}.${leftBalls}`;
};

const getCRR = (runs: number, balls: number) => {
  if (balls === 0) return runs;
  return ((runs / balls) * 6).toFixed(2);
};

const getRR = (runs: number, balls: number) => {
  if (balls === 0) return runs;

  return ((runs / balls) * 6).toFixed(2);
};

const getBallLabel = (ball: CurrentOverBalls): string => {
  if (ball.isWicket) {
    if (ball.runs === 0) return "W";
    else return `W${ball.runs}`;
  } else if (ball.isBye) return `B${ball.runs}`;
  else if (ball.isLegBye) return `LB${ball.runs}`;
  else if (ball.isNoBall) {
    if (ball.runs === 0) return "NB";
    else return `NB${ball.runs}`;
  } else if (ball.isWide) {
    if (ball.runs === 0) return "WD";
    else return `WD${ball.runs}`;
  }

  return `${ball.runs}`;
};
export { getPartnership, getEcon, getStrikeRate, getCRR, getOvers, getRR, getBallLabel };
