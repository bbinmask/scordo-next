import { Ball } from "@/generated/prisma";
import { CurrentOverBalls } from "@/lib/types";

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
export { getPartnership, getEcon, getStrikeRate, getCRR, getRR, getBallLabel };
