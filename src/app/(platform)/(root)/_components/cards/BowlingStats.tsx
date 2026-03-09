import { InningBowling, User } from "@/generated/prisma";
import { useMemo } from "react";
import { DoughnutChart } from "../charts/doughnut-chart";
import { StatBox } from "./StatBox";
import { Activity, AlertCircle, Flame, ShieldCheck, Swords } from "lucide-react";

interface StatsProps {
  user: User;
  bowlingRecords: InningBowling[];
}

export const BowlingStats = ({ user, bowlingRecords }: StatsProps) => {
  const bowling = useMemo(() => {
    const wickets = bowlingRecords.reduce((acc, curr) => acc + curr.wickets, 0);
    const runsConceded = bowlingRecords.reduce((acc, curr) => acc + curr.runs, 0);
    const totalBalls = bowlingRecords.reduce((acc, curr) => acc + (curr.overs * 6 + curr.balls), 0);
    const overs = Math.floor(totalBalls / 6);
    const maidens = bowlingRecords.reduce((acc, curr) => acc + curr.maidens, 0);
    const bbi = bowlingRecords.reduce((best, curr) => {
      const currentBest = `${curr.wickets}/${curr.runs}`;
      return currentBest > best ? currentBest : best;
    }, "0/0");
    const extras = bowlingRecords.reduce((acc, curr) => acc + curr.wides + curr.noBalls, 0);

    return {
      wickets,
      overs,
      maidens,
      bbi,
      runsConceded,
      extras,
      accuracy: totalBalls > 0 ? ((wickets / totalBalls) * 6).toFixed(2) : "0.00",
      econ: totalBalls > 0 ? ((runsConceded / totalBalls) * 6).toFixed(2) : "0.00",
    };
  }, [bowlingRecords]);

  const bowlingChartData = [
    { name: "Legal Runs", value: bowling.runsConceded, fill: "#ef4444" },
    { name: "Extras", value: bowling.extras, fill: "#f59e0b" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 px-4">
        <Flame className="text-emerald-500" />
        <h3 className="text-2xl font-black tracking-tight uppercase italic">Bowling Stats</h3>
      </div>

      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        <DoughnutChart
          title="Control Analysis"
          description={`${bowling.runsConceded} runs conceded`}
          data={bowlingChartData}
          centerValue={bowling.wickets}
          centerLabel="Wickets"
          footerText={`Best bowling: ${bowling.bbi}`}
          colorScheme="emerald"
        />
        <div className="grid grid-cols-2 gap-2">
          <StatBox
            label="Matches"
            value={`${bowlingRecords.length}`}
            icon={Swords}
            color="emerald"
          />
          <StatBox label="Overs" value={bowling.overs} icon={Activity} color="emerald" />
          <StatBox
            label="Bowling Avg"
            value={bowling.accuracy}
            icon={ShieldCheck}
            color="emerald"
          />

          <StatBox
            label="Economy"
            value={bowling.econ}
            icon={Activity}
            color="emerald"
            subLabel="RPO"
          />
          <StatBox label="Maidens" value={bowling.maidens} icon={Flame} color="emerald" />
          <StatBox label="Total Extras" value={bowling.extras} icon={AlertCircle} color="emerald" />
        </div>
      </div>
    </div>
  );
};
