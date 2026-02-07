import { Ball } from "@/generated/prisma";
import { History } from "lucide-react";

export const HistoryTimeline = ({ history }: { history: Ball[] }) => (
  <div className="px-8 pb-8">
    <div className="mb-4 flex items-center gap-2">
      <History className="h-3.5 w-3.5 text-slate-400" />
      <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
        Match Timeline
      </span>
    </div>
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
      {history.length === 0 ? (
        <div className="text-[10px] font-bold text-slate-300 uppercase italic">
          Waiting for kickoff...
        </div>
      ) : (
        history.map((ball) => (
          <div
            key={ball.id}
            className={`animate-in zoom-in flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border text-xs font-black transition-all ${
              ball.isWicket
                ? "border-rose-600 bg-rose-500 text-white"
                : ball.isNoBall || ball.isWide || ball.isWicket
                  ? "border-amber-600 bg-amber-500 text-white"
                  : ball.runs >= 4
                    ? "border-emerald-600 bg-emerald-500 text-white"
                    : "border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {ball.isWicket ? "W" : ball.isWide ? "Wd" : ball.isNoBall ? "Nb" : ball.runs}
          </div>
        ))
      )}
    </div>
  </div>
);
