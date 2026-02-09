import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { InningDetails } from "@/lib/types";
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

  const currentInning = innings[activeInningIdx];

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="max-h-[80vh] max-w-full overflow-x-hidden overflow-y-scroll p-0">
        {/* Modal Header */}
        <div className="flex shrink-0 items-center justify-between bg-gradient-to-br from-green-500/10 to-transparent p-8 pb-4">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-green-600 p-3 shadow-lg">
              <LayoutList className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-[poppins] text-xl font-black text-slate-900 uppercase italic dark:text-white">
                Full Scorecard
              </h2>
              <p className="font-[urbanist] text-[10px] font-bold text-green-500 uppercase">
                {innings[activeInningIdx].battingTeam.name} Innings
              </p>
            </div>
          </div>
        </div>

        <div className="shrink-0 space-y-4 px-8 py-4 font-sans">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
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

          {/* Active Inning Score Summary */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-indigo-500" />
              <span className="truncate font-[poppins] text-sm font-bold text-slate-900 uppercase dark:text-white">
                {String(currentInning?.battingTeam.name || "TBD")}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xl font-black tracking-tighter text-indigo-600 dark:text-indigo-400">
                {String(currentInning?.runs || 0)}/{String(currentInning?.wickets || 0)}
              </span>
              <span className="ml-2 text-[10px] font-bold text-slate-400 uppercase">
                ({String(currentInning?.overs || "0.0")} Overs)
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-4">
          {/* Summary Banner */}
          <div className="relative flex items-center justify-between overflow-hidden rounded-3xl bg-slate-900 p-6 text-white">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Trophy className="h-16 w-16" />
            </div>
            <div>
              <p className="mb-1 text-[10px] font-black tracking-widest text-green-400 uppercase">
                Total Score
              </p>
              <h3 className="text-4xl font-black tracking-tighter italic">
                {innings[activeInningIdx].runs}/{innings[activeInningIdx].wickets}
              </h3>
            </div>
            <div className="text-right">
              <p className="mb-1 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                Overs
              </p>
              <p className="text-xl font-black tracking-tight">
                {innings[activeInningIdx].overs}.{innings[activeInningIdx].balls % 6}
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
                    {/* Mocking squad breakdown based on total runs for UI demo */}
                    {[
                      {
                        name: "Virat Kohli",
                        runs: Math.floor(innings[activeInningIdx].runs * 0.4),
                        balls: 28,
                        fours: 4,
                        sixes: 1,
                        status: "Not Out",
                      },
                      {
                        name: "Faf du Plessis",
                        runs: Math.floor(innings[activeInningIdx].runs * 0.25),
                        balls: 15,
                        fours: 2,
                        sixes: 1,
                        status: "c. Bumrah b. Pandya",
                      },
                      {
                        name: "Glenn Maxwell",
                        runs: Math.floor(innings[activeInningIdx].runs * 0.15),
                        balls: 10,
                        fours: 1,
                        sixes: 1,
                        status: "b. Bumrah",
                      },
                    ].map((player, i) => (
                      <tr key={i} className="group">
                        <td className="px-6 py-4">
                          <p className="text-xs font-bold tracking-tight text-slate-900 uppercase dark:text-white">
                            {player.name}
                          </p>
                          <p className="mt-0.5 text-[9px] font-semibold text-slate-400 italic">
                            {player.status}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-center text-xs font-bold">{player.runs}</td>
                        <td className="px-4 py-4 text-center text-xs font-semibold text-slate-500">
                          {player.balls}
                        </td>
                        <td className="px-4 py-4 text-center text-xs font-semibold text-slate-500">
                          {player.fours}
                        </td>
                        <td className="px-4 py-4 text-center text-xs font-semibold text-slate-500">
                          {player.sixes}
                        </td>
                        <td className="px-4 py-4 text-center text-[10px] font-bold text-green-500">
                          {((player.runs / player.balls) * 100).toFixed(1)}
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
                    {[
                      { name: "Jasprit Bumrah", overs: 4, maidens: 0, runs: 24, wickets: 2 },
                      { name: "Hardik Pandya", overs: 3.2, maidens: 0, runs: 31, wickets: 1 },
                    ].map((bowler, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4">
                          <p className="text-xs font-bold tracking-tight text-slate-900 uppercase dark:text-white">
                            {bowler.name}
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
                          {(bowler.runs / bowler.overs).toFixed(2)}
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
