import { Ball } from "@/generated/prisma";
import { CurrentOverBalls, InningDetails, MatchWithDetails } from "@/lib/types";

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

  if (leftBalls === 0) {
    return `${overs - 1}.6`;
  }

  return `${overs}.${leftBalls}`;
};

const getRunRate = (runs: number, balls: number) => {
  if (balls === 0) return runs;
  return ((runs / balls) * 6).toFixed(2);
};

const getBallLabel = (ball: CurrentOverBalls | null): string => {
  if (!ball) return "";
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

const isLegalBall = (ball: CurrentOverBalls) => {
  if (ball.isWide || ball.isNoBall) return false;
  return true;
};

const formatRuns = (runs?: number): string => {
  if (!runs) return "";
  return runs === 1 ? "1 run" : `${runs} runs`;
};

const getPostSummaryData = (match: MatchWithDetails, inning: InningDetails) => {
  const winner =
    match.winnerId === match.teamAId ? match.teamA.abbreviation : match.teamB.abbreviation;
  const result = match.result as string;
  const overs = Math.floor(inning.balls / 6);
  const balls = inning.balls % 6;

  return { winner, result, overs, balls };
};

export interface MatchPlayerStats {
  playerId: string;
  playerName: string;
  teamId: string;
  isWinningTeam: boolean;

  batting: {
    runsScored: number;
    ballsFaced: number;
    fours: number;
    sixes: number;
    dismissal?: boolean;
  };

  bowling: {
    oversBowled: number;
    maidens: number;
    runsConceded: number;
    wickets: number;
  };

  fielding: {
    catches: number;
    stumpings: number;
    runOuts: number;
  };
}

function calculateStrikeRate(runs: number, balls: number) {
  if (balls === 0) return 0;

  return (runs / balls) * 100;
}

function calculateEconomy(runs: number, overs: number) {
  if (overs === 0) return 0;

  return runs / overs;
}

function calculatePlayerPoints(stats: MatchPlayerStats): number {
  let points = 0;

  // =========================
  // Batting
  // =========================

  const { runsScored, ballsFaced, fours, sixes, dismissal } = stats.batting;

  points += runsScored;

  points += fours * 1;
  points += sixes * 2;

  // Milestone bonuses
  if (runsScored >= 100) {
    points += 20;
  } else if (runsScored >= 50) {
    points += 10;
  } else if (runsScored >= 30) {
    points += 5;
  }

  // Duck penalty
  if (dismissal && runsScored === 0 && ballsFaced > 0) {
    points -= 10;
  }

  // Strike rate bonus
  if (ballsFaced >= 10) {
    const strikeRate = calculateStrikeRate(runsScored, ballsFaced);

    if (strikeRate >= 170) {
      points += 10;
    } else if (strikeRate >= 150) {
      points += 6;
    } else if (strikeRate >= 130) {
      points += 3;
    } else if (strikeRate < 70) {
      points -= 6;
    }
  }

  // =========================
  // Bowling
  // =========================

  const { oversBowled, maidens, runsConceded, wickets } = stats.bowling;

  points += wickets * 25;

  points += maidens * 12;

  // Wicket haul bonuses
  if (wickets >= 5) {
    points += 20;
  } else if (wickets >= 4) {
    points += 12;
  } else if (wickets >= 3) {
    points += 6;
  }

  // Economy bonus
  if (oversBowled >= 2) {
    const economy = calculateEconomy(runsConceded, oversBowled);

    if (economy <= 4) {
      points += 10;
    } else if (economy <= 6) {
      points += 6;
    } else if (economy >= 10) {
      points -= 6;
    } else if (economy >= 12) {
      points -= 10;
    }
  }

  // =========================
  // Fielding
  // =========================

  points += stats.fielding.catches * 8;

  points += stats.fielding.stumpings * 12;

  points += stats.fielding.runOuts * 12;

  // Extra fielding bonus
  if (stats.fielding.catches >= 3) {
    points += 6;
  }

  // =========================
  // Match Result Bonus
  // =========================

  if (stats.isWinningTeam) {
    points += 10;
  }

  return points;
}

export function generateManOfTheMatch(playersArray: MatchPlayerStats[]) {
  if (!playersArray.length) {
    throw new Error("No players provided.");
  }

  let bestPlayer = playersArray[0];
  let highestPoints = calculatePlayerPoints(bestPlayer);

  for (let i = 1; i < playersArray.length; i++) {
    const currentPlayer = playersArray[i];

    const currentPoints = calculatePlayerPoints(currentPlayer);

    if (currentPoints > highestPoints) {
      highestPoints = currentPoints;
      bestPlayer = currentPlayer;
    }

    // Tie breaker
    else if (currentPoints === highestPoints) {
      // Prefer winning team player
      if (currentPlayer.isWinningTeam && !bestPlayer.isWinningTeam) {
        bestPlayer = currentPlayer;
      }

      // Prefer all-rounder impact
      else if (currentPlayer.bowling.wickets > 0 && currentPlayer.batting.runsScored > 20) {
        bestPlayer = currentPlayer;
      }
    }
  }

  return {
    player: bestPlayer,
    totalPoints: highestPoints,
  };
}

export {
  getPartnership,
  getEcon,
  getStrikeRate,
  getRunRate,
  getOvers,
  getBallLabel,
  isLegalBall,
  formatRuns,
  getPostSummaryData,
};
