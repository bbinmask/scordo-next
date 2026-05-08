import { CurrentOverBalls } from "@/lib/types";
import { getBallClassesFromLabel } from "@/utils/helper/classes";
import { getBallLabel, getOvers } from "@/utils/helper/scorecard";
import { Clock, History } from "lucide-react";

export const HistoryTimeline = ({ history }: { history: CurrentOverBalls[] }) => (
  <div className="group bg-card relative overflow-hidden rounded-[3rem] border border-white/5 p-8 font-[poppins] shadow-xl">
    <div className="mb-6 flex items-center gap-2">
      <Clock className="h-4 w-4 text-emerald-500" />
      <span className="text-[10px] font-black tracking-[0.3em] text-emerald-500 uppercase">
        Timeline
      </span>
    </div>
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
      {history.length === 0 ? (
        <div className="text-[10px] font-bold text-slate-300 uppercase italic">
          Waiting for kickoff...
        </div>
      ) : (
        history.map((ball, i) => {
          const label = getBallLabel(ball);

          return (
            <div key={i} className="relative">
              <p className="truncate text-center text-[10px] font-normal">
                {getOvers(Math.floor(ball.ball / 6), ball.ball)}
              </p>
              <p
                className={`${getBallClassesFromLabel(label)} relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-[cal_sans] text-[10px] font-black`}
              >
                {label}
              </p>
            </div>
          );
        })
      )}
    </div>
  </div>
);
