"use client";

import DOMPurify from "dompurify";
import { marked } from "marked";
import { MessageSquare, Mic, MicOff, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { getBallClassesFromLabel } from "@/utils/helper/classes";
import axios from "axios";
import { useChannel } from "ably/react";
import { CommentaryWithBall } from "@/types/match.props";
import { getOvers } from "@/utils/helper/scorecard";

export function CommentaryFeed({ matchId, isEnabled }: { matchId: string; isEnabled: boolean }) {
  const [commentary, setCommentary] = useState<CommentaryWithBall[][]>([]);

  const channelName = `match:${matchId}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.post("/api/commentary", { matchId });

        if (!data.success) return;
        setCommentary(data.data);
      } catch (error: any) {
        throw new Error(error?.message || "Something went wrong");
      }
    };
    fetchData();
  }, []);

  useChannel(channelName, "ball-added", async (msg) => {
    const { data } = msg;

    const commentary = [data.commentary];

    setCommentary((prev) => [commentary, ...prev]);
  });

  const enableCommentary = () => {};
  const disableCommentary = () => {};

  return (
    <div className="flex flex-col rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8 dark:border-white/10 dark:bg-slate-900">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500">
            <MessageSquare className="h-5 w-5" />
          </div>
          <h3 className="flex items-center gap-2 font-[poppins] text-base font-black tracking-tight text-slate-800 uppercase italic dark:text-white">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            AI <span className="primary-heading pr-1">Commentary</span>
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={isEnabled ? disableCommentary : enableCommentary}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-[urbanist] text-xs font-bold text-slate-500 transition-all hover:border-red-300 hover:text-red-500 dark:border-white/10 dark:bg-slate-900"
          >
            {isEnabled ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
            {isEnabled ? "Mute" : "Unmute"}
          </button>
        </div>
      </div>

      <div className="custom-scrollbar max-h-[300px] flex-1 space-y-4 overflow-y-auto pr-2">
        {commentary.length > 0 &&
          commentary.map((line) =>
            line?.map((comm) => (
              <div
                key={comm.id}
                className={`animate-in slide-in-from-top-2 flex justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-slate-200 dark:border-white/5 dark:bg-white/5 dark:hover:border-white/10`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`${getBallClassesFromLabel(comm.label)} flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[10px] font-black`}
                  >
                    {comm.label}
                  </div>
                  <div className="pt-1">
                    <p
                      className={`text-sm leading-relaxed font-medium text-slate-700 dark:text-slate-300`}
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(marked.parse(comm.text || "") as string),
                      }}
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  {getOvers(comm.ball.over, comm.ball.ball)} Overs
                </p>
              </div>
            ))
          )}
      </div>
    </div>
  );
}
