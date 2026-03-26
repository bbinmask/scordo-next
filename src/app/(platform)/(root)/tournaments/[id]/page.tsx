"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { Tournament, Match, Team } from "@/generated/prisma";
import { DefaultLoader } from "@/components/Spinner";
import { BentoCard } from "../../_components/cards/bento-card";
import { StatBox } from "../../_components/cards/StatBox";
import {
  Trophy,
  Calendar,
  Users,
  ArrowUpRight,
  MapPin,
  Activity,
  Target,
  Wind,
  Flame,
  ChevronRight,
  Medal,
  Star,
  Zap,
  BarChart3,
  ShieldCheck,
  Hash,
} from "lucide-react";
import { formatDate } from "@/utils/helper/formatDate";

// ── Types ────────────────────────────────────────────────────────────────────

interface TournamentDetail extends Tournament {
  organizer: { id: string; name: string; username: string; avatar: string | null };
  participatingTeams: { team: { id: string; name: string; abbreviation: string; logo: string | null; _count: { players: number } } }[];
  matches: (Match & {
    teamA: { id: string; name: string; abbreviation: string; logo: string | null };
    teamB: { id: string; name: string; abbreviation: string; logo: string | null };
  })[];
  _count: { participatingTeams: number; matches: number };
}

interface BatEntry {
  userId: string; name: string; username: string; avatar: string | null;
  teamName: string; teamAbbr: string; teamLogo: string | null;
  runs: number; sixes: number; fours: number; balls: number; innings: number;
  highScore: number; avg: string; sr: string; notOuts: number;
}

interface BowlEntry {
  userId: string; name: string; username: string; avatar: string | null;
  teamName: string; teamAbbr: string; teamLogo: string | null;
  wickets: number; runs: number; overs: number; innings: number;
  bbi: string; econ: string; avg: string; maidens: number;
}

interface HighScoreEntry {
  userId: string; name: string; username: string; avatar: string | null;
  teamName: string; teamAbbr: string;
  runs: number; balls: number; fours: number; sixes: number; isOut: boolean; sr: string;
}

interface BestBowlEntry {
  userId: string; name: string; username: string; avatar: string | null;
  teamName: string; teamAbbr: string;
  wickets: number; runs: number; overs: number; figure: string; econ: string;
}

interface Leaderboard {
  mostRuns: BatEntry[];
  mostWickets: BowlEntry[];
  mostSixes: BatEntry[];
  mostFours: BatEntry[];
  highestScores: HighScoreEntry[];
  bestBowling: BestBowlEntry[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const TABS = [
  { id: "overview",        label: "Overview" },
  { id: "matches",         label: "Matches" },
  { id: "most-runs",       label: "Most Runs" },
  { id: "most-wickets",    label: "Most Wickets" },
  { id: "most-sixes",      label: "Most Sixes" },
  { id: "most-fours",      label: "Most Fours" },
  { id: "highest-scores",  label: "Highest Scores" },
  { id: "best-bowling",    label: "Best Bowling" },
] as const;

type Tab = (typeof TABS)[number]["id"];

const statusBadge = (start: Date, end: Date) => {
  const now = new Date();
  if (now < new Date(start)) return { label: "Upcoming", cls: "bg-blue-500/10 text-blue-500 border-blue-500/20" };
  if (now > new Date(end))   return { label: "Ended",    cls: "bg-slate-500/10 text-slate-400 border-slate-500/20" };
  return                            { label: "Live",     cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" };
};

const Avatar = ({ src, name, size = "md" }: { src?: string | null; name: string; size?: "sm" | "md" }) => {
  const dim = size === "sm" ? "h-8 w-8 text-[10px]" : "h-10 w-10 text-xs";
  return (
    <div className={`${dim} flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-200 font-black text-slate-500 dark:bg-slate-700`}>
      {src ? <img src={src} alt={name} className="h-full w-full object-cover" /> : name[0]?.toUpperCase()}
    </div>
  );
};

const RankBadge = ({ rank }: { rank: number }) => {
  if (rank === 1) return <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 font-[poppins] text-xs font-black text-white">1</span>;
  if (rank === 2) return <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-400 font-[poppins] text-xs font-black text-white">2</span>;
  if (rank === 3) return <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-700 font-[poppins] text-xs font-black text-white">3</span>;
  return <span className="flex h-6 w-6 items-center justify-center font-[urbanist] text-xs font-black text-slate-400">{rank}</span>;
};

// ── Leaderboard row components ────────────────────────────────────────────────

const BatRow = ({ entry, rank, statKey, statLabel }: { entry: BatEntry; rank: number; statKey: keyof BatEntry; statLabel: string }) => (
  <div className={`flex items-center gap-4 rounded-2xl px-4 py-3 transition-all ${rank <= 3 ? "bg-green-50/60 dark:bg-green-500/5" : "hover:bg-slate-50 dark:hover:bg-white/5"}`}>
    <RankBadge rank={rank} />
    <Avatar src={entry.avatar} name={entry.name} />
    <div className="flex-1 min-w-0">
      <Link href={`/u/${entry.username}`} className="block font-[poppins] text-sm font-black text-slate-800 hover:text-green-600 dark:text-white dark:hover:text-green-400 truncate">
        {entry.name}
      </Link>
      <p className="font-[urbanist] text-xs font-semibold text-slate-400 truncate">{entry.teamAbbr}</p>
    </div>
    <div className="text-right shrink-0">
      <p className="font-[poppins] text-lg font-black text-slate-900 dark:text-white">{entry[statKey] as string | number}</p>
      <p className="font-[urbanist] text-[10px] font-semibold uppercase tracking-widest text-slate-400">{statLabel}</p>
    </div>
    <div className="hidden text-right shrink-0 md:block">
      <p className="font-[urbanist] text-xs font-semibold text-slate-500">{entry.innings} inn</p>
      <p className="font-[urbanist] text-xs font-semibold text-slate-400">SR {entry.sr}</p>
    </div>
  </div>
);

const BowlRow = ({ entry, rank }: { entry: BowlEntry; rank: number }) => (
  <div className={`flex items-center gap-4 rounded-2xl px-4 py-3 transition-all ${rank <= 3 ? "bg-green-50/60 dark:bg-green-500/5" : "hover:bg-slate-50 dark:hover:bg-white/5"}`}>
    <RankBadge rank={rank} />
    <Avatar src={entry.avatar} name={entry.name} />
    <div className="flex-1 min-w-0">
      <Link href={`/u/${entry.username}`} className="block font-[poppins] text-sm font-black text-slate-800 hover:text-green-600 dark:text-white dark:hover:text-green-400 truncate">
        {entry.name}
      </Link>
      <p className="font-[urbanist] text-xs font-semibold text-slate-400 truncate">{entry.teamAbbr}</p>
    </div>
    <div className="text-right shrink-0">
      <p className="font-[poppins] text-lg font-black text-slate-900 dark:text-white">{entry.wickets}</p>
      <p className="font-[urbanist] text-[10px] font-semibold uppercase tracking-widest text-slate-400">wkts</p>
    </div>
    <div className="hidden text-right shrink-0 md:block">
      <p className="font-[urbanist] text-xs font-semibold text-slate-500">BBI {entry.bbi}</p>
      <p className="font-[urbanist] text-xs font-semibold text-slate-400">Econ {entry.econ}</p>
    </div>
  </div>
);

const HighScoreRow = ({ entry, rank }: { entry: HighScoreEntry; rank: number }) => (
  <div className={`flex items-center gap-4 rounded-2xl px-4 py-3 transition-all ${rank <= 3 ? "bg-green-50/60 dark:bg-green-500/5" : "hover:bg-slate-50 dark:hover:bg-white/5"}`}>
    <RankBadge rank={rank} />
    <Avatar src={entry.avatar} name={entry.name} />
    <div className="flex-1 min-w-0">
      <Link href={`/u/${entry.username}`} className="block font-[poppins] text-sm font-black text-slate-800 hover:text-green-600 dark:text-white dark:hover:text-green-400 truncate">
        {entry.name}
      </Link>
      <p className="font-[urbanist] text-xs font-semibold text-slate-400 truncate">{entry.teamAbbr}</p>
    </div>
    <div className="text-right shrink-0">
      <p className="font-[poppins] text-lg font-black text-slate-900 dark:text-white">
        {entry.runs}{!entry.isOut && <span className="text-green-500">*</span>}
      </p>
      <p className="font-[urbanist] text-[10px] font-semibold uppercase tracking-widest text-slate-400">{entry.balls}b · SR {entry.sr}</p>
    </div>
    <div className="hidden items-center gap-3 shrink-0 md:flex">
      <span className="font-[urbanist] text-xs font-semibold text-blue-500">{entry.fours}×4</span>
      <span className="font-[urbanist] text-xs font-semibold text-emerald-500">{entry.sixes}×6</span>
    </div>
  </div>
);

const BestBowlRow = ({ entry, rank }: { entry: BestBowlEntry; rank: number }) => (
  <div className={`flex items-center gap-4 rounded-2xl px-4 py-3 transition-all ${rank <= 3 ? "bg-green-50/60 dark:bg-green-500/5" : "hover:bg-slate-50 dark:hover:bg-white/5"}`}>
    <RankBadge rank={rank} />
    <Avatar src={entry.avatar} name={entry.name} />
    <div className="flex-1 min-w-0">
      <Link href={`/u/${entry.username}`} className="block font-[poppins] text-sm font-black text-slate-800 hover:text-green-600 dark:text-white dark:hover:text-green-400 truncate">
        {entry.name}
      </Link>
      <p className="font-[urbanist] text-xs font-semibold text-slate-400 truncate">{entry.teamAbbr}</p>
    </div>
    <div className="text-right shrink-0">
      <p className="font-[poppins] text-lg font-black text-slate-900 dark:text-white">{entry.figure}</p>
      <p className="font-[urbanist] text-[10px] font-semibold uppercase tracking-widest text-slate-400">figure</p>
    </div>
    <div className="hidden text-right shrink-0 md:block">
      <p className="font-[urbanist] text-xs font-semibold text-slate-500">{entry.overs} ov</p>
      <p className="font-[urbanist] text-xs font-semibold text-slate-400">Econ {entry.econ}</p>
    </div>
  </div>
);

const EmptyLeaderboard = ({ label }: { label: string }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
    <div className="rounded-3xl bg-slate-100 p-4 dark:bg-slate-800">
      <BarChart3 className="h-8 w-8 text-slate-300 dark:text-slate-600" />
    </div>
    <p className="font-[urbanist] text-sm font-semibold text-slate-400">No {label} data yet. Play some matches!</p>
  </div>
);

// ── Main page ─────────────────────────────────────────────────────────────────

export default function TournamentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState<Tab>("overview");

  const { data: tournament, isLoading } = useQuery<TournamentDetail>({
    queryKey: ["tournament", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/tournaments/${id}`);
      if (!data.success) throw new Error("Not found");
      return data.data;
    },
  });

  const { data: leaderboard, isLoading: lbLoading } = useQuery<Leaderboard>({
    queryKey: ["tournament-leaderboard", id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await axios.get(`/api/tournaments/leaderboard?tournamentId=${id}`);
      if (!data.success) return null;
      return data.data;
    },
  });

  if (isLoading || !tournament) return <DefaultLoader />;

  const badge = statusBadge(tournament.startDate, tournament.endDate);
  const details = tournament.details;
  const completedMatches = tournament.matches.filter((m) => m.status === "completed");
  const liveMatches     = tournament.matches.filter((m) => m.status === "in_progress");
  const upcomingMatches = tournament.matches.filter((m) => m.status === "not_started");

  return (
    <div className="min-h-screen bg-slate-100 pb-24 font-sans transition-colors dark:bg-[#020617]">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="relative h-52 w-full overflow-hidden bg-gradient-to-r from-emerald-700 via-green-600 to-teal-700 md:h-64">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-100 to-transparent dark:from-[#020617]" />
        <div className="absolute inset-0 flex items-end px-6 pb-8 md:px-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`rounded-full border px-3 py-0.5 font-[urbanist] text-[10px] font-black uppercase tracking-widest ${badge.cls}`}>
                {badge.label}
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-0.5 font-[urbanist] text-[10px] font-black uppercase tracking-widest text-white">
                {details.totalOvers} Overs
              </span>
            </div>
            <h1 className="font-[poppins] text-3xl font-black tracking-tight text-white md:text-4xl">
              {tournament.title}
            </h1>
            <p className="font-[urbanist] text-sm font-semibold text-green-200">
              by{" "}
              <Link href={`/u/${tournament.organizer.username}`} className="hover:underline">
                {tournament.organizer.name}
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-6 px-4 pt-4 md:px-6">

        {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 font-[urbanist] text-xs font-semibold text-slate-400">
          <Link href="/tournaments" className="hover:text-green-500 transition-colors">Tournaments</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-600 dark:text-slate-300 truncate">{tournament.title}</span>
        </div>

        {/* ── Quick stat strip ───────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatBox label="Teams" value={tournament._count.participatingTeams} icon={Users} color="emerald" subLabel={`of ${details.maxTeams}`} />
          <StatBox label="Matches" value={tournament._count.matches} icon={Activity} color="emerald" />
          <StatBox label="Total Overs" value={details.totalOvers} icon={Hash} color="emerald" />
          <StatBox label="Entry Fee" value={details.entryFee ? `₹${details.entryFee}` : "Free"} icon={Trophy} color="emerald" />
        </div>

        {/* ── Scrollable tab bar ─────────────────────────────────────────── */}
        <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-2xl bg-slate-200/60 p-1 dark:bg-white/5">
          {TABS.map(({ id: tid, label }) => (
            <button
              key={tid}
              onClick={() => setTab(tid)}
              className={`shrink-0 rounded-xl px-4 py-2 font-[urbanist] text-xs font-bold whitespace-nowrap transition-all ${
                tab === tid
                  ? "bg-white text-green-600 shadow dark:bg-green-600 dark:text-white"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Tab content ────────────────────────────────────────────────── */}

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="space-y-6">
            {tournament.description && (
              <BentoCard title="About" icon={Trophy}>
                <p className="font-[urbanist] text-sm font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
                  {tournament.description}
                </p>
              </BentoCard>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Dates */}
              <BentoCard title="Schedule" icon={Calendar}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-[urbanist] text-xs font-semibold text-slate-400 uppercase tracking-widest">Start Date</span>
                    <span className="font-[urbanist] text-sm font-bold text-slate-700 dark:text-white">{formatDate(new Date(tournament.startDate))}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-[urbanist] text-xs font-semibold text-slate-400 uppercase tracking-widest">End Date</span>
                    <span className="font-[urbanist] text-sm font-bold text-slate-700 dark:text-white">{formatDate(new Date(tournament.endDate))}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-[urbanist] text-xs font-semibold text-slate-400 uppercase tracking-widest">Matches / Team</span>
                    <span className="font-[urbanist] text-sm font-bold text-slate-700 dark:text-white">{details.matchesPerTeam}</span>
                  </div>
                </div>
              </BentoCard>

              {/* Prize + fees */}
              <BentoCard title="Prizes & Fees" icon={Medal}>
                <div className="space-y-3">
                  {details.winnerPrice != null && (
                    <div className="flex items-center justify-between">
                      <span className="font-[urbanist] text-xs font-semibold text-slate-400 uppercase tracking-widest">Winner Prize</span>
                      <span className="font-[poppins] text-sm font-black text-amber-500">₹{details.winnerPrice}</span>
                    </div>
                  )}
                  {details.runnerUpPrice != null && (
                    <div className="flex items-center justify-between">
                      <span className="font-[urbanist] text-xs font-semibold text-slate-400 uppercase tracking-widest">Runner-up</span>
                      <span className="font-[poppins] text-sm font-black text-slate-500">₹{details.runnerUpPrice}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-[urbanist] text-xs font-semibold text-slate-400 uppercase tracking-widest">Entry Fee</span>
                    <span className="font-[urbanist] text-sm font-bold text-slate-700 dark:text-white">
                      {details.entryFee ? `₹${details.entryFee}` : "Free"}
                    </span>
                  </div>
                </div>
              </BentoCard>
            </div>

            {/* Location + rules */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {details.location && (
                <BentoCard title="Location" icon={MapPin}>
                  <p className="font-[urbanist] text-sm font-bold text-slate-700 dark:text-white">
                    {details.location.city}, {details.location.state}
                  </p>
                  <p className="font-[urbanist] text-xs font-semibold text-slate-400">{details.location.country}</p>
                </BentoCard>
              )}
              {tournament.rules.length > 0 && (
                <BentoCard title="Rules" icon={ShieldCheck}>
                  <ul className="space-y-2">
                    {tournament.rules.map((rule, i) => (
                      <li key={i} className="flex items-start gap-2 font-[urbanist] text-sm font-semibold text-slate-600 dark:text-slate-300">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </BentoCard>
              )}
            </div>

            {/* Participating Teams */}
            <BentoCard title={`Teams (${tournament.participatingTeams.length})`} icon={Users}>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {tournament.participatingTeams.map(({ team }) => (
                  <Link key={team.id} href={`/teams/${team.abbreviation}`}>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 transition-all hover:border-green-200 hover:bg-green-50 dark:border-white/5 dark:bg-white/5 dark:hover:bg-green-500/10">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow dark:bg-slate-800">
                        {team.logo ? (
                          <img src={team.logo} alt={team.name} className="h-full w-full object-cover" />
                        ) : (
                          <span className="font-[poppins] text-xs font-black text-slate-500">{team.abbreviation.slice(0, 2)}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-[poppins] text-xs font-black text-slate-800 dark:text-white">{team.abbreviation}</p>
                        <p className="font-[urbanist] text-[10px] font-semibold text-slate-400">{team._count.players} players</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </BentoCard>
          </div>
        )}

        {/* MATCHES */}
        {tab === "matches" && (
          <div className="space-y-6">
            {[
              { label: "Live", items: liveMatches, color: "text-red-500", dot: true },
              { label: "Upcoming", items: upcomingMatches, color: "text-blue-500", dot: false },
              { label: "Completed", items: completedMatches, color: "text-slate-400", dot: false },
            ].map(({ label, items, color, dot }) =>
              items.length ? (
                <div key={label}>
                  <h3 className={`mb-3 flex items-center gap-2 font-[poppins] text-sm font-black uppercase tracking-widest ${color}`}>
                    {dot && <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />}
                    {label}
                  </h3>
                  <div className="space-y-3">
                    {items.map((match) => (
                      <Link key={match.id} href={`/matches/${match.id}`}>
                        <div className="hover-card flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900/50">
                          <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                              {match.teamA.logo ? <img src={match.teamA.logo} alt="" className="h-full w-full object-cover" /> : <span className="font-[poppins] text-[10px] font-black">{match.teamA.abbreviation.slice(0,2)}</span>}
                            </div>
                            <span className="font-[poppins] text-xs font-black text-slate-400">vs</span>
                            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                              {match.teamB.logo ? <img src={match.teamB.logo} alt="" className="h-full w-full object-cover" /> : <span className="font-[poppins] text-[10px] font-black">{match.teamB.abbreviation.slice(0,2)}</span>}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-[poppins] text-sm font-black text-slate-800 dark:text-white">
                              {match.teamA.abbreviation} <span className="primary-heading">vs</span> {match.teamB.abbreviation}
                            </p>
                            {match.result && <p className="font-[urbanist] text-xs font-semibold text-slate-400 truncate">{match.result}</p>}
                            {match.date && !match.result && (
                              <p className="font-[urbanist] text-xs font-semibold text-slate-400">{formatDate(new Date(match.date))}</p>
                            )}
                          </div>
                          <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-300" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null
            )}
            {tournament.matches.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <div className="rounded-3xl bg-slate-100 p-4 dark:bg-slate-800">
                  <Activity className="h-9 w-9 text-slate-300 dark:text-slate-600" />
                </div>
                <p className="font-[urbanist] text-sm font-semibold text-slate-400">No matches scheduled yet.</p>
              </div>
            )}
          </div>
        )}

        {/* LEADERBOARD TABS */}
        {["most-runs","most-wickets","most-sixes","most-fours","highest-scores","best-bowling"].includes(tab) && (
          <div className="hover-card overflow-hidden rounded-[2rem] border border-slate-200 p-6 dark:border-white/10 dark:bg-slate-900/30">
            {lbLoading ? (
              <div className="flex h-48 items-center justify-center">
                <BarChart3 className="h-8 w-8 animate-pulse text-green-500" />
              </div>
            ) : (
              <>
                {tab === "most-runs" && (
                  <>
                    <h3 className="mb-5 flex items-center gap-2 font-[poppins] text-xl font-black uppercase italic tracking-tight dark:text-white">
                      <Target className="h-5 w-5 text-emerald-500" /> Most Runs
                    </h3>
                    {leaderboard?.mostRuns.length ? (
                      <div className="space-y-1">
                        {leaderboard.mostRuns.map((e, i) => <BatRow key={e.userId} entry={e} rank={i+1} statKey="runs" statLabel="runs" />)}
                      </div>
                    ) : <EmptyLeaderboard label="batting" />}
                  </>
                )}
                {tab === "most-wickets" && (
                  <>
                    <h3 className="mb-5 flex items-center gap-2 font-[poppins] text-xl font-black uppercase italic tracking-tight dark:text-white">
                      <Wind className="h-5 w-5 text-emerald-500" /> Most Wickets
                    </h3>
                    {leaderboard?.mostWickets.length ? (
                      <div className="space-y-1">
                        {leaderboard.mostWickets.map((e, i) => <BowlRow key={e.userId} entry={e} rank={i+1} />)}
                      </div>
                    ) : <EmptyLeaderboard label="bowling" />}
                  </>
                )}
                {tab === "most-sixes" && (
                  <>
                    <h3 className="mb-5 flex items-center gap-2 font-[poppins] text-xl font-black uppercase italic tracking-tight dark:text-white">
                      <Zap className="h-5 w-5 text-emerald-500" /> Most Sixes
                    </h3>
                    {leaderboard?.mostSixes.length ? (
                      <div className="space-y-1">
                        {leaderboard.mostSixes.map((e, i) => <BatRow key={e.userId} entry={e} rank={i+1} statKey="sixes" statLabel="sixes" />)}
                      </div>
                    ) : <EmptyLeaderboard label="sixes" />}
                  </>
                )}
                {tab === "most-fours" && (
                  <>
                    <h3 className="mb-5 flex items-center gap-2 font-[poppins] text-xl font-black uppercase italic tracking-tight dark:text-white">
                      <Star className="h-5 w-5 text-emerald-500" /> Most Fours
                    </h3>
                    {leaderboard?.mostFours.length ? (
                      <div className="space-y-1">
                        {leaderboard.mostFours.map((e, i) => <BatRow key={e.userId} entry={e} rank={i+1} statKey="fours" statLabel="fours" />)}
                      </div>
                    ) : <EmptyLeaderboard label="fours" />}
                  </>
                )}
                {tab === "highest-scores" && (
                  <>
                    <h3 className="mb-5 flex items-center gap-2 font-[poppins] text-xl font-black uppercase italic tracking-tight dark:text-white">
                      <Flame className="h-5 w-5 text-emerald-500" /> Highest Individual Scores
                    </h3>
                    {leaderboard?.highestScores.length ? (
                      <div className="space-y-1">
                        {leaderboard.highestScores.map((e, i) => <HighScoreRow key={`${e.userId}-${i}`} entry={e} rank={i+1} />)}
                      </div>
                    ) : <EmptyLeaderboard label="scores" />}
                  </>
                )}
                {tab === "best-bowling" && (
                  <>
                    <h3 className="mb-5 flex items-center gap-2 font-[poppins] text-xl font-black uppercase italic tracking-tight dark:text-white">
                      <Medal className="h-5 w-5 text-emerald-500" /> Best Bowling Figures
                    </h3>
                    {leaderboard?.bestBowling.length ? (
                      <div className="space-y-1">
                        {leaderboard.bestBowling.map((e, i) => <BestBowlRow key={`${e.userId}-${i}`} entry={e} rank={i+1} />)}
                      </div>
                    ) : <EmptyLeaderboard label="bowling figures" />}
                  </>
                )}
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
