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
    return {
      runs,
      balls,
      matches: battingRecords.length,
      fours,
      sixes,
      dots,
      highScore,
      avg: outs > 0 ? (runs / outs).toFixed(2) : runs.toFixed(2),
      sr: balls > 0 ? ((runs / balls) * 100).toFixed(2) : "0.00",
      sixesRuns: sixes,
      foursRuns: fours,
      fieldRuns: runs - (fours * 4 + sixes * 6),
    };
  }, [battingRecords]);

  const battingChartData = [
    { name: "Sixes", value: batting.sixesRuns, fill: "#10b981" },
    { name: "Fours", value: batting.foursRuns, fill: "#3b82f6" },
    { name: "Field Runs", value: batting.fieldRuns, fill: "#f59e0b" },
  ];

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      {/* Batting Stats */}
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
          <div className="grid grid-cols-1 gap-4">
            <StatBox label="Total Matches" value={batting.matches} icon={Swords} color="emerald" />
            <StatBox
              label="Career Avg"
              value={batting.avg}
              icon={Target}
              color="emerald"
              subLabel="Elite"
            />
            <StatBox label="Strike Rate" value={batting.sr} icon={Zap} color="emerald" />
          </div>
        </div>
      </div>
    </div>
  );
};
