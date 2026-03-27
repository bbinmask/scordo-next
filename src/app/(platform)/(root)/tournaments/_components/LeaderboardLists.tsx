"use client";

import Link from "next/link";
import { Target, Wind, Zap, Star, Flame, Medal, BarChart3 } from "lucide-react";

// ── Shared types ──────────────────────────────────────────────────────────────

export interface BatEntry {
  userId: string;
  name: string;
  username: string;
  avatar: string | null;
  teamName: string;
  teamAbbr: string;
  teamLogo: string | null;
  runs: number;
  sixes: number;
  fours: number;
  balls: number;
  innings: number;
  highScore: number;
  avg: string;
  sr: string;
  notOuts: number;
}

export interface BowlEntry {
  userId: string;
  name: string;
  username: string;
  avatar: string | null;
  teamName: string;
  teamAbbr: string;
  teamLogo: string | null;
  wickets: number;
  runs: number;
  overs: number;
  innings: number;
  bbi: string;
  econ: string;
  avg: string;
  maidens: number;
}

export interface HighScoreEntry {
  userId: string;
  name: string;
  username: string;
  avatar: string | null;
  teamName: string;
  teamAbbr: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isOut: boolean;
  sr: string;
}

export interface BestBowlEntry {
  userId: string;
  name: string;
  username: string;
  avatar: string | null;
  teamName: string;
  teamAbbr: string;
  wickets: number;
  runs: number;
  overs: number;
  figure: string;
  econ: string;
}

// ── Shared atoms ──────────────────────────────────────────────────────────────

const PlayerAvatar = ({ src, name }: { src?: string | null; name: string }) => (
  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-200 font-[poppins] text-xs font-black text-slate-500 dark:bg-slate-700">
    {src ? (
      <img src={src} alt={name} className="h-full w-full object-cover" />
    ) : (
      name[0]?.toUpperCase()
    )}
  </div>
);

const RankBadge = ({ rank }: { rank: number }) => {
  if (rank === 1)
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-400 font-[poppins] text-xs font-black text-white shadow-sm">
        1
      </span>
    );
  if (rank === 2)
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-400 font-[poppins] text-xs font-black text-white shadow-sm">
        2
      </span>
    );
  if (rank === 3)
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-700/80 font-[poppins] text-xs font-black text-white shadow-sm">
        3
      </span>
    );
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center font-[urbanist] text-xs font-black text-slate-400">
      {rank}
    </span>
  );
};

const SecondaryStats = ({ children }: { children: React.ReactNode }) => (
  <div className="hidden shrink-0 flex-col items-end gap-0.5 md:flex">{children}</div>
);

const Sub = ({ children }: { children: React.ReactNode }) => (
  <span className="font-[urbanist] text-xs font-semibold text-slate-400">{children}</span>
);

const EmptyState = ({ label }: { label: string }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
    <div className="rounded-3xl bg-slate-100 p-4 dark:bg-slate-800">
      <BarChart3 className="h-8 w-8 text-slate-300 dark:text-slate-600" />
    </div>
    <p className="font-[urbanist] text-sm font-semibold text-slate-400">
      No {label} data yet — play some matches!
    </p>
  </div>
);

const ListHeading = ({ icon: Icon, title }: { icon: any; title: string }) => (
  <div className="mb-5 flex items-center gap-3">
    <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500">
      <Icon className="h-5 w-5" />
    </div>
    <h3 className="font-[poppins] text-xl font-black tracking-tight text-slate-900 uppercase italic dark:text-white">
      {title}
    </h3>
  </div>
);

// ── Row wrappers ──────────────────────────────────────────────────────────────

const Row = ({ rank, children }: { rank: number; children: React.ReactNode }) => (
  <div
    className={`flex items-center gap-4 rounded-2xl px-4 py-3 transition-all ${
      rank <= 3 ? "bg-green-50/70 dark:bg-green-500/5" : "hover:bg-slate-50 dark:hover:bg-white/5"
    }`}
  >
    <RankBadge rank={rank} />
    {children}
  </div>
);

// ── Most Runs ─────────────────────────────────────────────────────────────────

export function MostRunsList({ data }: { data: BatEntry[] }) {
  return (
    <div>
      <ListHeading icon={Target} title="Most Runs" />
      {!data.length ? (
        <EmptyState label="batting" />
      ) : (
        <div className="space-y-1">
          {data.map((e, i) => (
            <Row key={e.userId} rank={i + 1}>
              <PlayerAvatar src={e.avatar} name={e.name} />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/u/${e.username}`}
                  className="block truncate font-[poppins] text-sm font-black text-slate-800 hover:text-green-600 dark:text-white dark:hover:text-green-400"
                >
                  {e.name}
                </Link>
                <p className="truncate font-[urbanist] text-xs font-semibold text-slate-400">
                  {e.teamAbbr}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-[poppins] text-xl font-black text-slate-900 dark:text-white">
                  {e.runs}
                </p>
                <p className="font-[urbanist] text-[9px] font-black tracking-widest text-slate-400 uppercase">
                  runs
                </p>
              </div>
              <SecondaryStats>
                <Sub>
                  {e.innings} inn · HS {e.highScore}
                </Sub>
                <Sub>
                  Avg {e.avg} · SR {e.sr}
                </Sub>
              </SecondaryStats>
            </Row>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Most Wickets ──────────────────────────────────────────────────────────────

export function MostWicketsList({ data }: { data: BowlEntry[] }) {
  return (
    <div>
      <ListHeading icon={Wind} title="Most Wickets" />
      {!data.length ? (
        <EmptyState label="bowling" />
      ) : (
        <div className="space-y-1">
          {data.map((e, i) => (
            <Row key={e.userId} rank={i + 1}>
              <PlayerAvatar src={e.avatar} name={e.name} />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/u/${e.username}`}
                  className="block truncate font-[poppins] text-sm font-black text-slate-800 hover:text-green-600 dark:text-white dark:hover:text-green-400"
                >
                  {e.name}
                </Link>
                <p className="truncate font-[urbanist] text-xs font-semibold text-slate-400">
                  {e.teamAbbr}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-[poppins] text-xl font-black text-slate-900 dark:text-white">
                  {e.wickets}
                </p>
                <p className="font-[urbanist] text-[9px] font-black tracking-widest text-slate-400 uppercase">
                  wkts
                </p>
              </div>
              <SecondaryStats>
                <Sub>BBI {e.bbi}</Sub>
                <Sub>
                  Econ {e.econ} · {e.innings} inn
                </Sub>
              </SecondaryStats>
            </Row>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Most Sixes ────────────────────────────────────────────────────────────────

export function MostSixesList({ data }: { data: BatEntry[] }) {
  return (
    <div>
      <ListHeading icon={Zap} title="Most Sixes" />
      {!data.length ? (
        <EmptyState label="sixes" />
      ) : (
        <div className="space-y-1">
          {data.map((e, i) => (
            <Row key={e.userId} rank={i + 1}>
              <PlayerAvatar src={e.avatar} name={e.name} />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/u/${e.username}`}
                  className="block truncate font-[poppins] text-sm font-black text-slate-800 hover:text-green-600 dark:text-white dark:hover:text-green-400"
                >
                  {e.name}
                </Link>
                <p className="truncate font-[urbanist] text-xs font-semibold text-slate-400">
                  {e.teamAbbr}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-[poppins] text-xl font-black text-emerald-500">{e.sixes}</p>
                <p className="font-[urbanist] text-[9px] font-black tracking-widest text-slate-400 uppercase">
                  sixes
                </p>
              </div>
              <SecondaryStats>
                <Sub>
                  {e.runs} runs · {e.innings} inn
                </Sub>
                <Sub>SR {e.sr}</Sub>
              </SecondaryStats>
            </Row>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Most Fours ────────────────────────────────────────────────────────────────

export function MostFoursList({ data }: { data: BatEntry[] }) {
  return (
    <div>
      <ListHeading icon={Star} title="Most Fours" />
      {!data.length ? (
        <EmptyState label="fours" />
      ) : (
        <div className="space-y-1">
          {data.map((e, i) => (
            <Row key={e.userId} rank={i + 1}>
              <PlayerAvatar src={e.avatar} name={e.name} />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/u/${e.username}`}
                  className="block truncate font-[poppins] text-sm font-black text-slate-800 hover:text-green-600 dark:text-white dark:hover:text-green-400"
                >
                  {e.name}
                </Link>
                <p className="truncate font-[urbanist] text-xs font-semibold text-slate-400">
                  {e.teamAbbr}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-[poppins] text-xl font-black text-blue-500">{e.fours}</p>
                <p className="font-[urbanist] text-[9px] font-black tracking-widest text-slate-400 uppercase">
                  fours
                </p>
              </div>
              <SecondaryStats>
                <Sub>
                  {e.runs} runs · {e.innings} inn
                </Sub>
                <Sub>SR {e.sr}</Sub>
              </SecondaryStats>
            </Row>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Highest Scores ────────────────────────────────────────────────────────────

export function HighestScoresList({ data }: { data: HighScoreEntry[] }) {
  return (
    <div>
      <ListHeading icon={Flame} title="Highest Individual Scores" />
      {!data.length ? (
        <EmptyState label="scores" />
      ) : (
        <div className="space-y-1">
          {data.map((e, i) => (
            <Row key={`${e.userId}-${i}`} rank={i + 1}>
              <PlayerAvatar src={e.avatar} name={e.name} />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/u/${e.username}`}
                  className="block truncate font-[poppins] text-sm font-black text-slate-800 hover:text-green-600 dark:text-white dark:hover:text-green-400"
                >
                  {e.name}
                </Link>
                <p className="truncate font-[urbanist] text-xs font-semibold text-slate-400">
                  {e.teamAbbr}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-[poppins] text-xl font-black text-slate-900 dark:text-white">
                  {e.runs}
                  {!e.isOut && <span className="text-emerald-500">*</span>}
                </p>
                <p className="font-[urbanist] text-[9px] font-black tracking-widest text-slate-400 uppercase">
                  {e.balls}b · SR {e.sr}
                </p>
              </div>
              <SecondaryStats>
                <Sub>
                  <span className="text-blue-500">{e.fours}×4</span>
                </Sub>
                <Sub>
                  <span className="text-emerald-500">{e.sixes}×6</span>
                </Sub>
              </SecondaryStats>
            </Row>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Best Bowling ──────────────────────────────────────────────────────────────

export function BestBowlingList({ data }: { data: BestBowlEntry[] }) {
  return (
    <div>
      <ListHeading icon={Medal} title="Best Bowling Figures" />
      {!data.length ? (
        <EmptyState label="bowling figures" />
      ) : (
        <div className="space-y-1">
          {data.map((e, i) => (
            <Row key={`${e.userId}-${i}`} rank={i + 1}>
              <PlayerAvatar src={e.avatar} name={e.name} />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/u/${e.username}`}
                  className="block truncate font-[poppins] text-sm font-black text-slate-800 hover:text-green-600 dark:text-white dark:hover:text-green-400"
                >
                  {e.name}
                </Link>
                <p className="truncate font-[urbanist] text-xs font-semibold text-slate-400">
                  {e.teamAbbr}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-[poppins] text-xl font-black text-slate-900 dark:text-white">
                  {e.figure}
                </p>
                <p className="font-[urbanist] text-[9px] font-black tracking-widest text-slate-400 uppercase">
                  figure
                </p>
              </div>
              <SecondaryStats>
                <Sub>{e.overs} overs</Sub>
                <Sub>Econ {e.econ}</Sub>
              </SecondaryStats>
            </Row>
          ))}
        </div>
      )}
    </div>
  );
}
