import { ERROR_CODES } from "@/constants";
import { db } from "@/lib/db";
import { ApiError, ApiResponse } from "@/utils/ApiResponse";
import { generateManOfTheMatch } from "@/utils/helper/scorecard";
import { NextResponse } from "next/server";

export const POST = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;

    const { winner }: { winner: string } = await req.json();

    const match = await db.match.findUnique({
      where: {
        id,
      },
      include: {
        innings: {
          include: {
            InningBatting: {
              include: {
                player: {
                  select: {
                    user: {
                      select: {
                        name: true,
                        username: true,
                      },
                    },
                  },
                },
              },
            },
            InningBowling: {
              include: {
                player: {
                  select: {
                    user: {
                      select: {
                        name: true,
                        username: true,
                      },
                    },
                  },
                },
              },
            },
            battingTeam: true,
            bowlingTeam: true,
          },
        },
      },
    });

    if (!match) {
      return NextResponse.json(new ApiError(ERROR_CODES.NOT_FOUND), { status: 404 });
    }

    const playerStatsMap = new Map();

    for (const inning of match.innings) {
      // =========================
      // Batting Stats
      // =========================

      for (const batter of inning.InningBatting) {
        const playerId = batter.playerId;

        if (!playerStatsMap.has(playerId)) {
          playerStatsMap.set(playerId, {
            playerId,
            playerName: batter.player.user.name,
            teamId: inning.battingTeam.id,

            isWinningTeam: inning.battingTeam.abbreviation === winner,

            batting: {
              runsScored: 0,
              ballsFaced: 0,
              fours: 0,
              sixes: 0,
            },

            bowling: {
              oversBowled: 0,
              maidens: 0,
              runsConceded: 0,
              wickets: 0,
            },

            fielding: {
              catches: 0,
              stumpings: 0,
              runOuts: 0,
            },
          });
        }

        const player = playerStatsMap.get(playerId);

        player.batting.runsScored += batter.runs;
        player.batting.ballsFaced += batter.balls;
        player.batting.fours += batter.fours;
        player.batting.sixes += batter.sixes;
      }

      // =========================
      // Bowling Stats
      // =========================

      for (const bowler of inning.InningBowling) {
        const playerId = bowler.playerId;

        if (!playerStatsMap.has(playerId)) {
          playerStatsMap.set(playerId, {
            playerId,
            playerName: bowler.player.user.name,
            teamId: inning.bowlingTeam.id,

            isWinningTeam: inning.bowlingTeam.abbreviation === winner,

            batting: {
              runsScored: 0,
              ballsFaced: 0,
              fours: 0,
              sixes: 0,
            },

            bowling: {
              oversBowled: 0,
              maidens: 0,
              runsConceded: 0,
              wickets: 0,
            },

            fielding: {
              catches: 0,
              stumpings: 0,
              runOuts: 0,
            },
          });
        }

        const player = playerStatsMap.get(playerId);

        player.bowling.oversBowled += bowler.overs;
        player.bowling.maidens += bowler.maidens;
        player.bowling.runsConceded += bowler.runs;
        player.bowling.wickets += bowler.wickets;
      }
    }

    const playersArray = Array.from(playerStatsMap.values());

    const manOfTheMatch = generateManOfTheMatch(playersArray);

    // =========================
    // Save Match Result
    // =========================

    // await db.match.update({
    //   where: {
    //     id,
    //   },
    //   data: {
    //     winner,
    //     manOfTheMatchPlayerId: manOfTheMatch.player.playerId,
    //   },
    // });

    return NextResponse.json(new ApiResponse(manOfTheMatch));
  } catch (error) {
    return NextResponse.json(new ApiError(ERROR_CODES.INTERNAL_SERVER_ERROR), { status: 500 });
  }
};
