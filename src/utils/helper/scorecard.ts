import { Ball } from "@/generated/prisma";
import { CurrentOverBalls } from "@/lib/types";

const getPartnership = (ballData: Ball[]): number => {
  if (!ballData || ballData.length === 0) return 0;

  let partnership = 0;

  // Walk backwards from the most recent ball
  for (let i = ballData.length - 1; i >= 0; i--) {
    const ball = ballData[i];

    if (ball.isWicket) {
      // Stop at the previous wicket — don't include it in this partnership
      break;
    }

    partnership += ball.runs;
    // Add wide/no-ball extras to partnership too
    if (ball.isWide) partnership += 1;
    if (ball.isNoBall) partnership += 1;
  }

  return partnership;
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
