import { apiFetch } from "@/services/api.service";
import { MatchPlayerStats } from "@/utils/helper/scorecard";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, AwardIcon, ClipboardList, CloudUpload, RotateCcw, Trophy } from "lucide-react";
import Link from "next/link";

interface PostMatchSummaryProps {
  matchId: string;
  data: { winner: string; result: string; overs: number; balls: number };
}

interface ManOfTheMatchResponse {
  player: MatchPlayerStats;
  totalPoints: number;
}

export const PostMatchSummary = ({ data, matchId }: PostMatchSummaryProps) => {
  const { data: manOfTheMatch } = useQuery({
    queryKey: ["man-of-the-match", matchId],
    queryFn: async () => {
      const { data: manOfTheMatchData } = await apiFetch<ManOfTheMatchResponse>(
        `/api/matches/${matchId}/man-of-the-match`,
        "POST",
        {
          data: {
            winner: data.winner,
          },
        }
      );
      return manOfTheMatchData;
    },
  });

  const renderMOMInfo = () => {
    if (!manOfTheMatch) return "";

    const { batting, bowling, fielding } = manOfTheMatch.player;
    const { ballsFaced, runsScored } = batting;
    const { wickets, runsConceded } = bowling;

    const wicketsInfo = wickets > 0 ? `${wickets} wicket${wickets > 1 ? "s" : ""}` : "";
    const runsInfo = runsConceded > 0 ? `${runsConceded} run${runsConceded > 1 ? "s" : ""}` : "";

    return `${runsScored}* (
                ${ballsFaced}) ${wicketsInfo !== "" && " & " + wicketsInfo + " (" + runsInfo + ") "}`;
  };

  return (
    <div className="group animate-in fade-in zoom-in bg-card relative space-y-6 overflow-hidden rounded-[3rem] border p-8 font-sans shadow-2xl duration-500 md:p-10 lg:col-span-4">
      <div className="relative z-10">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/20 p-2">
            <Trophy className="h-5 w-5 text-emerald-400" />
          </div>
          <h3 className="text-sm font-black text-emerald-400">Match Summary</h3>
        </div>

        <p className="mb-2 text-4xl leading-none font-black tracking-tighter uppercase italic">
          {data.winner} wins!
        </p>
        <p className="pr-2 font-[urbanist] text-sm font-semibold tracking-wide text-green-700">
          {data.result}
        </p>
        <p className="accent-accent mt-4 text-xs font-semibold tracking-wide">
          Target reached in {data.overs}.{data.balls} Overs
        </p>

        {/* Player of the Match Bento */}
        <div className="mt-10 flex items-center justify-between rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500 text-xl font-black shadow-inner">
              VK
            </div>
            <div>
              <p className="mb-1 text-[9px] font-black tracking-widest text-indigo-300 uppercase">
                Player of the Match
              </p>
              <p className="text-lg font-black tracking-tight uppercase">
                {manOfTheMatch?.player.playerName}
              </p>
              <p className="mt-1 text-xs font-bold text-emerald-400">{renderMOMInfo()}</p>
            </div>
          </div>
          <AwardIcon className="hidden h-8 w-8 text-amber-400 opacity-80 sm:block" />
        </div>

        {/* Actions */}
        <div className="mt-10 space-y-4">
          <Link
            href={`/matches/${matchId}/scorecard`}
            className="primary-btn flex w-full flex-1 items-center justify-center gap-2 rounded-[1.5rem] border border-white/10 bg-white/10 py-4 text-[10px] font-black tracking-widest uppercase transition-all active:scale-95"
          >
            <ClipboardList className="h-4 w-4" /> View Scorecard
          </Link>
          <Link
            href={`/matches`}
            className="flex w-full flex-1 items-center justify-center gap-2 rounded-[1.5rem] border border-white/5 bg-white/5 py-4 text-[10px] font-black tracking-widest uppercase transition-all hover:bg-white/10 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Matches
          </Link>
        </div>
      </div>
    </div>
  );
};
