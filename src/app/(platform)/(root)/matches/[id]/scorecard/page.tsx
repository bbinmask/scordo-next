"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { DefaultLoader } from "@/components/Spinner";
import { InningDetails, MatchWithDetails } from "@/lib/types";

// ── helpers ──────────────────────────────────────────────────────────────────

function oversDisplay(overs: number, balls: number) {
  return `${overs}.${balls % 6}`;
}

function sr(runs: number, balls: number) {
  return balls > 0 ? ((runs / balls) * 100).toFixed(1) : "-";
}

function econ(runs: number, overs: number, balls: number) {
  const total = overs * 6 + (balls % 6);
  return total > 0 ? ((runs / total) * 6).toFixed(1) : "-";
}

// ── Batting table ─────────────────────────────────────────────────────────────

function BattingTable({ inning }: { inning: InningDetails }) {
  const sorted = [...(inning.InningBatting ?? [])].sort((a, b) => b.runs - a.runs);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left font-[urbanist] text-[11px] font-black tracking-widest text-slate-400 uppercase dark:border-white/10">
            <th className="py-2 pr-4 font-semibold">Batter</th>
            <th className="px-3 py-2 text-center font-semibold">R</th>
            <th className="px-3 py-2 text-center font-semibold">B</th>
            <th className="px-3 py-2 text-center font-semibold">4s</th>
            <th className="px-3 py-2 text-center font-semibold">6s</th>
            <th className="px-3 py-2 text-center font-semibold">SR</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-6 text-center font-[urbanist] text-sm text-slate-400">
                No batting data yet
              </td>
            </tr>
          ) : (
            sorted.map((b) => (
              <tr key={b.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5">
                <td className="py-2.5 pr-4">
                  <p className="font-[poppins] text-sm font-semibold">
                    {b.player.user.name}
                  </p>
                  <p className="font-[urbanist] text-[11px] text-slate-400">
                    @{b.player.user.username}
                    {b.isOut ? (
                      <span className="ml-2 text-red-400 font-semibold">out</span>
                    ) : (
                      <span className="ml-2 text-green-500 font-semibold">not out</span>
                    )}
                  </p>
                </td>
                <td className="px-3 py-2.5 text-center font-[poppins] font-black">{b.runs}</td>
                <td className="px-3 py-2.5 text-center font-[urbanist] text-slate-500">{b.balls}</td>
                <td className="px-3 py-2.5 text-center font-[urbanist] text-blue-500 font-semibold">{b.fours}</td>
                <td className="px-3 py-2.5 text-center font-[urbanist] text-emerald-500 font-semibold">{b.sixes}</td>
                <td className="px-3 py-2.5 text-center font-[urbanist] text-slate-500">{sr(b.runs, b.balls)}</td>
              </tr>
            ))
          )}
        </tbody>
        <tfoot>
          <tr className="border-t border-slate-200 dark:border-white/10">
            <td className="py-2 font-[poppins] text-xs font-black uppercase text-slate-400">Total</td>
            <td className="px-3 py-2 text-center font-[poppins] text-sm font-black text-emerald-500">
              {inning.runs}/{inning.wickets}
            </td>
            <td colSpan={3} className="px-3 py-2 text-center font-[urbanist] text-xs text-slate-400">
              ({oversDisplay(inning.overs, inning.balls)} ov)
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

// ── Bowling table ─────────────────────────────────────────────────────────────

function BowlingTable({ inning }: { inning: InningDetails }) {
  const sorted = [...(inning.InningBowling ?? [])].sort((a, b) => b.wickets - a.wickets);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left font-[urbanist] text-[11px] font-black tracking-widest text-slate-400 uppercase dark:border-white/10">
            <th className="py-2 pr-4 font-semibold">Bowler</th>
            <th className="px-3 py-2 text-center font-semibold">O</th>
            <th className="px-3 py-2 text-center font-semibold">M</th>
            <th className="px-3 py-2 text-center font-semibold">R</th>
            <th className="px-3 py-2 text-center font-semibold">W</th>
            <th className="px-3 py-2 text-center font-semibold">Econ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-6 text-center font-[urbanist] text-sm text-slate-400">
                No bowling data yet
              </td>
            </tr>
          ) : (
            sorted.map((b) => (
              <tr key={b.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5">
                <td className="py-2.5 pr-4">
                  <p className="font-[poppins] text-sm font-semibold">{b.player.user.name}</p>
                  <p className="font-[urbanist] text-[11px] text-slate-400">@{b.player.user.username}</p>
                </td>
                <td className="px-3 py-2.5 text-center font-[urbanist] text-slate-500">
                  {oversDisplay(b.overs, b.balls)}
                </td>
                <td className="px-3 py-2.5 text-center font-[urbanist] text-slate-500">{b.maidens}</td>
                <td className="px-3 py-2.5 text-center font-[urbanist] text-slate-500">{b.runs}</td>
                <td className="px-3 py-2.5 text-center font-[poppins] font-black text-red-500">{b.wickets}</td>
                <td className="px-3 py-2.5 text-center font-[urbanist] text-slate-500">
                  {econ(b.runs, b.overs, b.balls)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ── Inning section ────────────────────────────────────────────────────────────

function InningSection({ inning, inningNumber }: { inning: InningDetails; inningNumber: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900/40">
      {/* Inning header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4 dark:border-white/5 dark:bg-white/5">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 font-[poppins] text-xs font-black text-white">
            {inningNumber}
          </div>
          <div>
            <p className="font-[poppins] text-base font-black">{inning.battingTeam.name}</p>
            <p className="font-[urbanist] text-xs text-slate-400">
              batting · {inning.bowlingTeam.abbreviation} bowling
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-[poppins] text-2xl font-black text-emerald-500">
            {inning.runs}/{inning.wickets}
          </p>
          <p className="font-[urbanist] text-xs text-slate-400">
            {oversDisplay(inning.overs, inning.balls)} overs
          </p>
        </div>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-white/5">
        {/* Batting */}
        <div className="px-6 py-5">
          <p className="mb-3 font-[urbanist] text-[11px] font-black tracking-widest text-slate-400 uppercase">
            Batting
          </p>
          <BattingTable inning={inning} />
        </div>

        {/* Bowling */}
        <div className="px-6 py-5">
          <p className="mb-3 font-[urbanist] text-[11px] font-black tracking-widest text-slate-400 uppercase">
            Bowling
          </p>
          <BowlingTable inning={inning} />
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ScorecardPage() {
  const { id } = useParams<{ id: string }>();

  const { data: match, isLoading: matchLoading } = useQuery<MatchWithDetails>({
    queryKey: ["match", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/matches/${id}`);
      return data.data;
    },
  });

  const { data: innings, isLoading: inningsLoading } = useQuery<InningDetails[]>({
    queryKey: ["match-innings", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/matches/${id}/innings`);
      if (!data.success) return [];
      return data.data;
    },
  });

  const isLoading = matchLoading || inningsLoading;

  if (isLoading) return <DefaultLoader />;
  if (!match) return <p className="p-8 text-center text-slate-500">Match not found.</p>;

  const sortedInnings = [...(innings ?? [])].sort(
    (a, b) => (a.inningNumber ?? 0) - (b.inningNumber ?? 0)
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans dark:bg-[#020617]">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-green-600 to-green-800 px-4 py-10 md:px-10">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="relative mx-auto max-w-4xl">
          <Link
            href={`/matches/${id}`}
            className="mb-6 inline-flex items-center gap-2 font-[urbanist] text-sm font-semibold text-green-100 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to match
          </Link>

          <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-[urbanist] text-xs font-black tracking-widest text-green-200 uppercase">
                Full Scorecard
              </p>
              <h1 className="mt-1 font-[poppins] text-3xl font-black text-white md:text-4xl">
                {match.teamA.abbreviation}{" "}
                <span className="text-green-300">vs</span>{" "}
                {match.teamB.abbreviation}
              </h1>
              <p className="mt-1 font-[urbanist] text-sm text-green-200">
                {match.teamA.name} · {match.teamB.name}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-3 md:mt-0">
              <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 backdrop-blur-sm">
                <Shield className="h-4 w-4 text-green-200" />
                <span className="font-[urbanist] text-sm font-semibold text-white">
                  {match.category} · {match.overs} ov
                </span>
              </div>
              <div
                className={`rounded-2xl px-4 py-2 font-[urbanist] text-sm font-semibold ${
                  match.status === "completed"
                    ? "bg-white/20 text-white"
                    : match.status === "in_progress"
                      ? "bg-red-500/80 text-white"
                      : "bg-white/10 text-green-200"
                }`}
              >
                {match.status === "completed"
                  ? "Final"
                  : match.status === "in_progress"
                    ? "Live"
                    : match.status.replace("_", " ")}
              </div>
            </div>
          </div>

          {match.result && (
            <div className="mt-4 inline-block rounded-xl bg-white/15 px-4 py-2 font-[poppins] text-sm font-semibold text-white backdrop-blur-sm">
              {match.result}
            </div>
          )}
        </div>
      </div>

      {/* Innings */}
      <div className="mx-auto mt-8 max-w-4xl space-y-6 px-4 md:px-6">
        {sortedInnings.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-white/10 dark:bg-slate-900/40">
            <p className="font-[poppins] text-lg font-black text-slate-400">
              No innings data yet
            </p>
            <p className="mt-1 font-[urbanist] text-sm text-slate-400">
              The scorecard will appear once the match is initialized.
            </p>
          </div>
        ) : (
          sortedInnings.map((inning, i) => (
            <InningSection key={inning.id} inning={inning} inningNumber={i + 1} />
          ))
        )}
      </div>
    </div>
  );
}
