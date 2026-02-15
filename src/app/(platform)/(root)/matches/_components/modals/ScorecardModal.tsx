import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InningDetails } from "@/lib/types";
import { getEcon, getStrikeRate } from "@/utils/helper/scorecard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Flame, LayoutList, Shield, Star, Sword, Trophy } from "lucide-react";
import { useMemo, useState } from "react";

const ScorecardModal = ({
  isOpen,
  onClose,
  innings,
}: {
  isOpen: boolean;
  onClose: () => void;
  innings: InningDetails[];
}) => {
  const [activeInningIdx, setActiveInningIdx] = useState(0);
  const { data: wicketsMap, isLoading } = useQuery<Record<string, string> | null>({
    queryKey: ["inning-wickets", innings[activeInningIdx].id],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/matches/innings/${innings[activeInningIdx].id}/wickets`
      );

      if (!data.success) return null;

      const dismissalMap: Record<string, string> = {};

      for (const ball of data.data) {
        let text = "";

        switch (ball.dismissalType) {
          case "CAUGHT":
            if (ball.fielder?.user.username === ball.bowler?.user.username)
              text = `c&b ${ball.bowler.user.name}`;
            else text = `c. ${ball.fielder?.user.name} b. ${ball.bowler.user.name}`;
            break;

          case "BOWLED":
            text = `b. ${ball.bowler.user.name}`;
            break;

          case "LBW":
            text = `lbw b. ${ball.bowler.user.name}`;
            break;

          case "RUN_OUT":
            text = `run out (${ball.fielder?.user.name})`;
            break;

          case "STUMPED":
            text = `st ${ball.fielder?.user.name} b. ${ball.bowler.user.name}`;
            break;

          case "HIT_WICKET":
            text = `hit wicket b. ${ball.bowler.user.name}`;
            break;

          default:
            text = "";
        }

        dismissalMap[ball.batsmanId] = text;
      }

      return dismissalMap;
    },
    enabled: !!innings[activeInningIdx]?.id,
  });

  const currentInning = innings[activeInningIdx];

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="max-h-[80vh] p-0">
        {/* Modal Header */}
        <DialogHeader className="bg-gradient-to-br from-green-500/10 to-transparent p-4 pb-4">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-green-600 p-3 shadow-lg">
              <LayoutList className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="font-[poppins] text-xl font-black text-slate-900 uppercase italic dark:text-white">
                Full Scorecard
              </DialogTitle>
              <DialogDescription className="font-[urbanist] text-[10px] font-bold text-green-500 uppercase">
                {currentInning.battingTeam.name} Innings
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="shrink-0 space-y-4 px-4 font-sans">
          <div className="no-scrollbar flex flex-wrap gap-2 pb-2">
            {innings.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveInningIdx(idx)}
                className={`min-w-[120px] flex-1 rounded-2xl border py-3 font-[inter] text-xs font-bold tracking-wider uppercase transition-all ${
                  activeInningIdx === idx
                    ? "border-green-600 bg-green-600 text-white"
                    : "border-slate-100 bg-slate-50 text-slate-400 hover:border-green-500/50 dark:border-white/5 dark:bg-white/5"
                }`}
              >
                Inning {idx + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-[55vh] max-w-full flex-1 overflow-x-hidden overflow-y-scroll px-8 py-4">
          {/* Summary Banner */}
          <div className="relative flex items-end justify-between overflow-hidden rounded-3xl bg-slate-900 p-6 text-white">
            <div className="grid gap-2">
              <h2 className="truncate font-[inter] text-sm font-bold text-slate-900 uppercase dark:text-white">
                {String(currentInning?.battingTeam.name || "TBD")}
              </h2>

              <h3 className="font-[poppins] text-2xl font-bold">
                {currentInning.runs}/{currentInning.wickets}
              </h3>
            </div>
            <div className="text-right">
              <p className="mb-2 font-[urbanist] text-[10px] font-bold tracking-widest text-green-600">
                Inning {activeInningIdx + 1}
              </p>
              <p className="font-[urbanist] text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                Overs
              </p>
              <p className="font-[poppins] text-lg font-bold">
                {currentInning.overs}.{currentInning.balls % 6}
              </p>
            </div>
          </div>

          <>
            {/* Batting Section */}
            <section className="my-4 space-y-4">
              <div className="flex items-center gap-2 px-2">
                <Sword className="h-4 w-4 text-emerald-500" />
                <h4 className="font-[inter] text-[11px] font-black tracking-wider text-slate-400 uppercase">
                  Batting Statistics
                </h4>
              </div>
              <div className="overflow-hidden rounded-3xl border border-slate-100 bg-slate-50/50 dark:border-white/5 dark:bg-white/5">
                <table className="w-full text-left">
                  <thead className="border-b border-slate-100 font-[inter] text-[9px] font-black tracking-widest text-slate-400 uppercase dark:border-white/5">
                    <tr>
                      <th className="px-6 py-4">Batsman</th>
                      <th className="px-4 py-4 text-center">R</th>
                      <th className="px-4 py-4 text-center">B</th>
                      <th className="px-4 py-4 text-center">4s</th>
                      <th className="px-4 py-4 text-center">6s</th>
                      <th className="px-4 py-4 text-center text-green-500">SR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-[urbanist] dark:divide-white/10">
                    {/* Players with runs and details*/}
                    {currentInning.InningBatting.map((batsman, i) => (
                      <tr key={i} className="group">
                        <td className="px-6 py-4">
                          <p className="text-xs font-bold tracking-tight text-slate-900 uppercase dark:text-white">
                            {batsman.player.user.name}
                          </p>
                          {wicketsMap && (
                            <p className="mt-0.5 text-[9px] font-medium text-slate-400 italic">
                              {wicketsMap?.[batsman.playerId]}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center text-xs font-bold">{batsman.runs}</td>
                        <td className="px-4 py-4 text-center text-xs font-semibold text-slate-500">
                          {batsman.balls}
                        </td>
                        <td className="px-4 py-4 text-center text-xs font-semibold text-slate-500">
                          {batsman.fours}
                        </td>
                        <td className="px-4 py-4 text-center text-xs font-semibold text-slate-500">
                          {batsman.sixes}
                        </td>
                        <td className="px-4 py-4 text-center text-[10px] font-bold text-green-500">
                          {getStrikeRate(batsman.runs, batsman.balls)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Bowling Section */}
            <section className="space-y-4 pb-4">
              <div className="flex items-center gap-2 px-2">
                <Flame className="h-4 w-4 text-red-700" />
                <h4 className="font-[inter] text-[11px] font-black tracking-wider text-slate-400 uppercase">
                  Bowling Figures
                </h4>
              </div>
              <div className="overflow-hidden rounded-3xl border border-slate-100 bg-slate-50/50 dark:border-white/5 dark:bg-white/5">
                <table className="w-full text-left">
                  <thead className="border-b border-slate-100 font-[inter] text-[9px] font-black tracking-widest text-slate-400 uppercase dark:border-white/5">
                    <tr>
                      <th className="px-6 py-4">Bowler</th>
                      <th className="px-4 py-4 text-center">O</th>
                      <th className="px-4 py-4 text-center">M</th>
                      <th className="px-4 py-4 text-center">R</th>
                      <th className="px-4 py-4 text-center text-emerald-500">W</th>
                      <th className="px-4 py-4 text-center">ECON</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-[urbanist] dark:divide-white/10">
                    {currentInning.InningBowling.map((bowler, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4">
                          <p className="text-xs font-bold tracking-tight text-slate-900 uppercase dark:text-white">
                            {bowler.player.user.name}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-center text-xs font-bold">{`${bowler.overs}.${bowler.balls % 6}`}</td>
                        <td className="px-4 py-4 text-center text-xs font-semibold text-slate-400">
                          {bowler.maidens}
                        </td>
                        <td className="px-4 py-4 text-center text-xs font-semibold text-slate-500">
                          {bowler.runs}
                        </td>
                        <td className="px-4 py-4 text-center text-xs font-bold text-emerald-500">
                          {bowler.wickets}
                        </td>
                        <td className="px-4 py-4 text-center text-[10px] font-bold text-slate-400">
                          {getEcon(bowler.runs, bowler.balls)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Scoreboard = ({ state, syncing }: { state: any; syncing: boolean }) => {
  const runRate = useMemo(() => {
    const totalBalls = Number(state.totalOversBowled) * 6 + Number(state.ballsInCurrentOver);
    return totalBalls === 0 ? "0.00" : ((Number(state.totalRuns) / totalBalls) * 6).toFixed(2);
  }, [state.totalRuns, state.totalOversBowled, state.ballsInCurrentOver]);

  return (
    <div className="group relative overflow-hidden rounded-t-[2.5rem] bg-indigo-600 p-8 font-sans text-white">
      <div className="absolute top-0 right-0 p-6">
        <div
          className={`rounded-full border border-white/20 px-3 py-1 text-[10px] font-black tracking-widest uppercase backdrop-blur-md ${syncing ? "animate-pulse bg-white/10" : "border-emerald-500/30 bg-emerald-500/20 text-emerald-300"}`}
        >
          {syncing ? "Syncing..." : "Live Cloud"}
        </div>
      </div>

      <div className="relative z-10 mb-6">
        <p className="mb-1 text-[10px] font-black tracking-[0.3em] text-indigo-100 uppercase">
          Scordo Match Engine
        </p>
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-black tracking-tighter uppercase italic">
            {String(state.battingTeam)}
          </h2>
          <span className="font-bold text-indigo-300 italic">vs</span>
          <span className="text-lg font-medium text-indigo-200">{String(state.bowlingTeam)}</span>
        </div>
      </div>

      <div className="relative z-10 flex items-baseline gap-3">
        <span className="text-8xl font-black tracking-tighter drop-shadow-lg">
          {String(state.totalRuns)}
        </span>
        <span className="text-4xl font-light tracking-tighter text-indigo-200">
          / {String(state.wickets)}
        </span>
      </div>

      <div className="relative z-10 mt-8 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/5 bg-indigo-700/40 p-4 backdrop-blur-sm">
          <span className="mb-1 block text-[10px] font-black tracking-widest text-indigo-300 uppercase">
            Overs
          </span>
          <p className="font-mono text-2xl font-black tracking-tighter">
            {String(state.totalOversBowled)}.{String(state.ballsInCurrentOver)}{" "}
            <span className="text-sm opacity-40">/ {String(state.maxOvers)}</span>
          </p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-indigo-700/40 p-4 text-right backdrop-blur-sm">
          <span className="mb-1 block text-[10px] font-black tracking-widest text-indigo-300 uppercase">
            CRR
          </span>
          <p className="font-mono text-2xl font-black tracking-tighter text-emerald-400">
            {String(runRate)}
          </p>
        </div>
      </div>

      <Star className="absolute -right-6 -bottom-6 h-32 w-32 -rotate-12 text-white/5 transition-transform duration-700 group-hover:rotate-0" />
    </div>
  );
};

export default ScorecardModal;
