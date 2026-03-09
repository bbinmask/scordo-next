import { DoughnutChart } from "@/app/(platform)/(root)/_components/charts/doughnut-chart";
import { InningBatting, User } from "@/generated/prisma";
import { Clock, Sword, Target, Zap, Swords } from "lucide-react";
import { useMemo } from "react";
import { StatBox } from "./StatBox";

interface StatsProps {
  user: User;
  battingRecords: InningBatting[];
}

export const BattingStats = ({ user, battingRecords }: StatsProps) => {
  const batting = useMemo(() => {
    const runs = battingRecords.reduce((acc, curr) => acc + curr.runs, 0);
    const balls = battingRecords.reduce((acc, curr) => acc + curr.balls, 0);
    const fours = battingRecords.reduce((acc, curr) => acc + curr.fours, 0);
    const sixes = battingRecords.reduce((acc, curr) => acc + curr.sixes, 0);
    const dots = battingRecords.reduce((acc, curr) => acc + curr.dots, 0);
    const outs = battingRecords.filter((r) => r.isOut).length;
    const highScore = battingRecords.reduce((max, curr) => (curr.runs > max ? curr.runs : max), 0);
    const notOuts = battingRecords.filter((r) => !r.isOut).length;
    const ducks = battingRecords.filter((r) => r.runs === 0).length;
    return {
      runs,
      balls,
      matches: battingRecords.length,
      fours,
      sixes,
      dots,
      notOuts,
      ducks,
      highScore,
      avg: outs > 0 ? (runs / outs).toFixed(2) : runs.toFixed(2),
      sr: balls > 0 ? ((runs / balls) * 100).toFixed(2) : "0.00",
      fieldRuns: runs - (fours * 4 + sixes * 6),
    };
  }, [battingRecords]);

  const battingChartData = [
    { name: "Field Runs", value: batting.fieldRuns, fill: "#f59e0b" },
    { name: "Fours", value: batting.fours, fill: "#3b82f6" },
    { name: "Sixes", value: batting.sixes, fill: "#10b981" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 px-4">
        <Sword className="text-emerald-500" />
        <h3 className="text-2xl font-black tracking-tight uppercase italic">Batting Intensity</h3>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <DoughnutChart
          title="Impact Breakdown"
          description="Boundary vs Running Runs"
          data={battingChartData}
          centerValue={batting.runs}
          centerLabel="Total Runs"
          footerText={`Highest score: ${batting.highScore} runs`}
          colorScheme="emerald"
        />
        <div className="grid grid-cols-2 gap-2">
          <StatBox label="Total Matches" value={batting.matches} icon={Swords} color="emerald" />
          <StatBox label="Total Runs" value={batting.runs} icon={Target} color="emerald" />
          <StatBox label="Career Avg" value={batting.avg} icon={Clock} color="emerald" />
          <StatBox label="Strike Rate" value={batting.sr} icon={Zap} color="emerald" />
          <StatBox label="Not out" value={batting.notOuts} icon={Sword} color="emerald" />
          <StatBox label="Ducks" value={batting.ducks} icon={Sword} color="emerald" />
        </div>
      </div>
    </div>
  );
};
