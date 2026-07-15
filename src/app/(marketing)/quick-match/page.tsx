"use client";

import Link from "next/link";
import { Zap, Shield, Clock, Wifi, ArrowRight, CheckCircle2, Smartphone } from "lucide-react";
import { MatchCard } from "@/app/(platform)/(root)/matches/_components/cards/MatchCard";
import { MatchWithDetails } from "@/lib/types";
import { useQuickMatch } from "@/hooks/useQuickMatch";
import NotFoundParagraph from "@/components/NotFoundParagraph";

const FEATURES = [
  {
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    title: "No Sign-up Needed",
    description: "Jump straight into scoring. No account, no email, no waiting.",
  },
  {
    icon: Shield,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    title: "Full Cricket Engine",
    description: "Wides, no-balls, byes, leg-byes, wickets, run-outs — every law covered.",
  },
  {
    icon: Clock,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    title: "Auto-saved Locally",
    description: "Your match is stored in the browser. Reload the page — it's still there.",
  },
  {
    icon: Wifi,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    title: "Works Offline",
    description: "No internet? No problem. Score your match entirely offline.",
  },
  {
    icon: Smartphone,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    title: "Mobile-friendly",
    description: "Designed for scorers on the boundary — tap-friendly on any device.",
  },
  {
    icon: CheckCircle2,
    color: "text-teal-500",
    bg: "bg-teal-500/10",
    title: "Undo Any Ball",
    description: "Mis-clicked? Hit undo instantly and re-enter the correct delivery.",
  },
] as const;

export default function QuickMatchPage() {
  const { match } = useQuickMatch();

  return (
    <div className="layout-background min-h-screen pb-24">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pt-20 pb-16 text-center">
        {/* Decorative background blob */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-emerald-500/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-2xl">
          {/* Badge */}
          <span className="status-badge status-badge--green mb-6 inline-flex">
            <span className="live-dot bg-emerald-500" />
            Guest Mode • No Login Required
          </span>

          <h1 className="heading-xl mb-4">
            Quick <span className="primary-heading">Match</span>
          </h1>

          <p className="body-text secondary-text mx-auto mb-10 max-w-lg">
            Score a full cricket match in seconds — without creating an account. Set up your teams,
            pick your players, and start scoring immediately. Everything is saved in your browser
            automatically.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/quick-match/create" className="cta-pill rounded-2xl px-10 py-4 text-sm">
              <Zap className="h-4 w-4" />
              Start Quick Match
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Previous Match ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4">
        <div className="mb-10 flex items-center gap-4 px-2">
          <h2 className="heading-lg">
            Previous <span className="primary-heading">Match</span>
          </h2>
          <div className="divider-line" />
        </div>

        {!match ? (
          <NotFoundParagraph description="No previous match" />
        ) : (
          <MatchCard match={match as unknown as MatchWithDetails} />
        )}
      </section>

      {/* ── Features grid ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4">
        <div className="mb-10 flex items-center gap-4 px-2">
          <h2 className="heading-lg">
            Everything you <span className="primary-heading">need</span>
          </h2>
          <div className="divider-line" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, color, bg, title, description }) => (
            <div key={title} className="bento-card group">
              <div className={`mb-4 inline-flex rounded-xl p-3 ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <h3 className="heading-md--poppins mb-2 text-base">{title}</h3>
              <p className="meta-text text-xs leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section className="mx-auto mt-20 max-w-3xl px-4">
        <div className="mb-10 flex items-center gap-4 px-2">
          <h2 className="heading-lg">
            How it <span className="primary-heading">works</span>
          </h2>
          <div className="divider-line" />
        </div>

        <ol className="relative space-y-8 pl-10">
          {[
            {
              step: "1",
              title: "Set up teams",
              desc: "Enter team names and add players manually. No database lookups — all local.",
            },
            {
              step: "2",
              title: "Configure the match",
              desc: "Choose overs, over limit, category (T20, ODI…), and venue.",
            },
            {
              step: "3",
              title: "Toss & start scoring",
              desc: "Decide the toss, pick opening batsmen and bowler, then tap to score every ball.",
            },
            {
              step: "4",
              title: "Only one match allowed",
              desc: "Delete the first match to create a new one. This keeps things simple and storage-efficient.",
            },
          ].map(({ step, title, desc }) => (
            <li key={step} className="relative">
              <div className="absolute -left-10 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-black text-white shadow-lg shadow-emerald-600/30">
                {step}
              </div>
              <h3 className="label-sm mb-1 font-black text-slate-900 dark:text-white">{title}</h3>
              <p className="secondary-text text-sm">{desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── CTA footer ───────────────────────────────────────────────── */}
      <section className="mx-auto mt-20 max-w-xl px-4 text-center">
        <div className="bento-card">
          <Zap className="mx-auto mb-4 h-8 w-8 text-emerald-500" />
          <h2 className="heading-md mb-2">Ready to score?</h2>
          <p className="secondary-text mb-6 text-sm">
            Your match is saved locally and persists across browser refreshes.
          </p>
          <Link href="/quick-match/create" className="cta-pill mx-auto w-fit rounded-2xl text-sm">
            Create Quick Match
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
