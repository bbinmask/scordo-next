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
import { Flame, LayoutList, Shield, Sword, Trophy } from "lucide-react";
import { useState } from "react";

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

  const { data: wicketsMap, isLoading } = useQuery<Map<string, string> | null>({
    queryKey: ["inning-wickets", innings[activeInningIdx].id],
    queryFn: async function () {
      const { data } = await axios.get(
        `/api/matches/innings/${innings[activeInningIdx].id}/wickets`
      );

      if (!data.success) return null;

      const dismissalMap = new Map<string, string>();

      for (const ball of data.data) {
        let text = "";

        switch (ball.dismissalType) {
          case "CAUGHT":
            text = `c. ${ball.fielder?.user.name} b. ${ball.bowler.user.name}`;
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
        }

        dismissalMap.set(ball.batsmanId, text);
      }

      return dismissalMap;
    },
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
                              {wicketsMap?.get(batsman.playerId)}
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
                        <td className="px-4 py-4 text-center text-xs font-bold">{bowler.overs}</td>
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
                          {getEcon(bowler.runs, bowler.overs, bowler.balls)}
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

export default ScorecardModal;
