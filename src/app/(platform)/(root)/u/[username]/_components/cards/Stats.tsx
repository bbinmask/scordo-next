import { DoughnutChart } from "@/app/(platform)/(root)/_components/charts/doughnut-chart";
import { User } from "@/generated/prisma";
import { Activity, AlertCircle, Clock, Flame, ShieldCheck, Sword, Target, Zap } from "lucide-react";
import { useMemo } from "react";

interface RawBattingStat {
  id: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isOut: boolean;
  dots: number;
}

interface RawBowlingStat {
  id: string;
  overs: number;
  balls: number;
  runs: number;
  wickets: number;
  maidens: number;
  noBalls: number;
  wides: number;
}

interface StatsProps {
  user: User;
  battingRecords: RawBattingStat[];
  bowlingRecords: RawBowlingStat[];
}

export const Stats = ({ user, battingRecords, bowlingRecords }: StatsProps) => {
  const batting = useMemo(() => {
    const runs = battingRecords.reduce((acc, curr) => acc + curr.runs, 0);
    const balls = battingRecords.reduce((acc, curr) => acc + curr.balls, 0);
    const fours = battingRecords.reduce((acc, curr) => acc + curr.fours, 0);
    const sixes = battingRecords.reduce((acc, curr) => acc + curr.sixes, 0);
    const dots = battingRecords.reduce((acc, curr) => acc + curr.dots, 0);
    const outs = battingRecords.filter((r) => r.isOut).length;

    return {
      runs,
      balls,
      fours,
      sixes,
      dots,
      avg: outs > 0 ? (runs / outs).toFixed(2) : runs.toFixed(2),
      sr: balls > 0 ? ((runs / balls) * 100).toFixed(2) : "0.00",
      boundaryRuns: fours * 4 + sixes * 6,
      fieldRuns: runs - (fours * 4 + sixes * 6),
    };
  }, [battingRecords]);

  const bowling = useMemo(() => {
    const wickets = bowlingRecords.reduce((acc, curr) => acc + curr.wickets, 0);
    const runsConceded = bowlingRecords.reduce((acc, curr) => acc + curr.runs, 0);
    const totalBalls = bowlingRecords.reduce((acc, curr) => acc + (curr.overs * 6 + curr.balls), 0);
    const extras = bowlingRecords.reduce((acc, curr) => acc + curr.wides + curr.noBalls, 0);

    return {
      wickets,
      runsConceded,
      extras,
      econ: totalBalls > 0 ? ((runsConceded / totalBalls) * 6).toFixed(2) : "0.00",
      pressureShare:
        totalBalls > 0 ? Math.round(((totalBalls - runsConceded / 4) / totalBalls) * 100) : 0,
    };
  }, [bowlingRecords]);

  // Chart Data Constructions
  const battingChartData = [
    { name: "Boundary Runs", value: batting.boundaryRuns, fill: "#10b981" },
    { name: "Field Runs", value: batting.fieldRuns, fill: "#3b82f6" },
  ];

  const bowlingChartData = [
    { name: "Legal Runs", value: bowling.runsConceded, fill: "#ef4444" },
    { name: "Extras", value: bowling.extras, fill: "#f59e0b" },
  ];

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      {/* Batting Section */}
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
            footerText="Power output increased by 12%"
            colorScheme="emerald"
          />
          <div className="grid grid-cols-1 gap-4">
            <StatBox
              label="Career Avg"
              value={batting.avg}
              icon={Target}
              color="emerald"
              subLabel="Elite"
            />
            <StatBox label="Strike Rate" value={batting.sr} icon={Zap} color="emerald" />
            <StatBox label="Dot Balls" value={batting.dots} icon={Clock} color="emerald" />
          </div>
        </div>
      </div>

      {/* Bowling Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-4">
          <Flame className="text-indigo-500" />
          <h3 className="text-2xl font-black tracking-tight uppercase italic">Bowling Precision</h3>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <DoughnutChart
            title="Control Analysis"
            description="Runs vs Extra Distribution"
            data={bowlingChartData}
            centerValue={bowling.wickets}
            centerLabel="Wickets"
            footerText="Accuracy stable at 94%"
            colorScheme="indigo"
          />
          <div className="grid grid-cols-1 gap-4">
            <StatBox
              label="Economy"
              value={bowling.econ}
              icon={Activity}
              color="indigo"
              subLabel="RPO"
            />
            <StatBox
              label="Total Extras"
              value={bowling.extras}
              icon={AlertCircle}
              color="indigo"
            />
            <StatBox
              label="Pressure"
              value={`${bowling.pressureShare}%`}
              icon={ShieldCheck}
              color="indigo"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ label, value, subLabel, icon: Icon, color = "emerald" }: any) => (
  <div className="group rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-white/5 dark:bg-slate-900">
    <div className="mb-3 flex items-start justify-between">
      <div
        className={`rounded-xl p-2.5 bg-${color}-500/10 text-${color}-500 transition-transform group-hover:scale-110`}
      >
        <Icon size={18} />
      </div>
      {subLabel && (
        <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
          {subLabel}
        </span>
      )}
    </div>
    <p className="mb-1 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">{label}</p>
    <p className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic dark:text-white">
      {value}
    </p>
  </div>
);
