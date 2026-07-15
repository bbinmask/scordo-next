import React from "react";
import {
  Trophy,
  Users,
  BarChart2,
  PlayCircle,
  Zap,
  Activity,
  ChevronRight,
  Smartphone,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

const TICKER_ITEMS = [
  "🏏 Live Scores",
  "📊 Player Stats",
  "🏆 Tournaments",
  "⚡ Quick Match",
  "👥 Team Manager",
  "📅 Match Schedule",
  "🎯 Bowling Analysis",
  "🔥 Top Performers",
];
import "./Marketing.css";

const MarketingPage = () => (
  <div className="mp-root">
    {/* Animated grid background */}
    <div className="mp-grid-bg" />

    {/* ── Hero ── */}
    <section className="mp-hero">
      <div className="mp-orb mp-orb-1" />
      <div className="mp-orb mp-orb-2" />

      {/* Left copy */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <h1 className="primary-heading mp-wordmark">Scordo</h1>

        <h2 className="mp-tagline">
          Organize. Score. <em>Dominate.</em>
        </h2>

        <p className="secondary-text mb-10 max-w-md font-[poppins] text-sm leading-relaxed font-light tracking-wider">
          The all-in-one platform to run cricket tournaments, track live scores, and analyze player
          performance — from a friendly gully match to a state-level league.
        </p>

        <div className="mp-cta-group">
          <Link href="/auth/sign-up" className="mp-btn-primary">
            <PlayCircle size={18} /> Get Started Free
          </Link>
          <Link href="/quick-match" className="mp-btn-ghost">
            <Zap size={16} /> Quick Match
          </Link>
        </div>
        <div className="secondary-text mt-10 flex items-center gap-6 text-sm font-semibold text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-green-500" /> Verified Profiles
          </div>
          <div className="flex items-center gap-2">
            <Smartphone size={18} className="text-green-500" /> Mobile Ready
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="mp-scroll-cue">
        <span>Scroll</span>
        <ChevronDown size={16} />
      </div>
    </section>

    {/* --- STATS / SOCIAL PROOF --- */}
    <div className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {[
            { label: "Active Players", value: "10,000+" },
            { label: "Matches Scored", value: "45,000+" },
            { label: "Tournaments", value: "1,200+" },
            { label: "Data Accuracy", value: "99.9%" },
          ].map((stat, i) => (
            <div key={i}>
              <p className="primary-text mb-1 text-3xl font-black sm:text-4xl">{stat.value}</p>
              <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="mp-ticker-wrap">
      <div className="mp-ticker-track">
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span key={i} className="mp-ticker-item">
            {item}
            <span style={{ opacity: 0.45 }}>•</span>
          </span>
        ))}
      </div>
    </div>

    {/* --- FEATURES BENTO GRID --- */}
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <h2 className="mb-3 text-sm font-bold tracking-widest text-green-600 uppercase dark:text-green-500">
          Core Infrastructure
        </h2>
        <h3 className="primary-text mb-6 text-3xl font-black tracking-tight md:text-5xl">
          Everything you need to manage the game.
        </h3>
        <p className="secondary-text text-lg">
          From gully cricket to professional regional leagues, Scordo provides the digital tools to
          elevate your tournaments.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Feature 1: Large Span */}
        <div className="group bento-card relative overflow-hidden rounded-3xl border p-8 shadow-md md:col-span-2 md:p-12">
          <div className="relative z-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
              <Activity size={28} />
            </div>
            <h4 className="primary-text mb-4 text-2xl font-bold">Pro-Level Scoring Engine</h4>
            <p className="secondary-text max-w-md text-sm leading-relaxed">
              A high-fidelity, ball-by-ball scoring interface. Handles complex scenarios including
              byes, leg-byes, no-balls, and undo functionality with real-time cloud synchronization.
            </p>
            <div className="group/link mt-8 flex cursor-pointer items-center gap-2 font-semibold text-green-600">
              Explore Match Center{" "}
              <ChevronRight
                size={18}
                className="transition-transform group-hover/link:translate-x-1"
              />
            </div>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="group bento-card rounded-3xl border p-8 shadow-md">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <Trophy size={28} />
          </div>
          <h4 className="primary-text mb-3 text-xl font-bold">Tournament Architect</h4>
          <p className="secondary-text text-sm leading-relaxed">
            Create massive leagues with custom rulesets, entry fees, and automated standings. Get
            schedules and results instantly.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="group bento-card rounded-3xl border p-8 shadow-md">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
            <Users size={28} />
          </div>
          <h4 className="primary-text mb-3 text-xl font-bold">Squad Management</h4>
          <p className="secondary-text text-sm leading-relaxed">
            Build your roster, send invites, and manage playing XIs. Maintain a persistent history
            of your team&apos;s legacy.
          </p>
        </div>

        {/* Feature 4: Medium Span */}
        <div className="primary-text bento-card relative overflow-hidden rounded-3xl border p-8 shadow-md md:col-span-2 md:p-10">
          <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
            <div>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white">
                <BarChart2 size={28} />
              </div>
              <h4 className="mb-3 text-2xl font-bold">Deep Player Analytics</h4>
              <p className="max-w-sm leading-relaxed text-slate-400">
                Access comprehensive stats for every match. We turn raw runs and wickets into
                beautiful career profiles.
              </p>
            </div>
            <div className="w-full flex-shrink-0 md:w-auto">
              <div className="border-input rounded-2xl border bg-green-700 p-6 shadow-2xl">
                <div className="mb-4 flex items-end justify-between gap-12">
                  <div>
                    <p className="mb-1 text-xs tracking-widest text-slate-400 uppercase">
                      Career Runs
                    </p>
                    <p className="text-4xl font-black text-white">2,405</p>
                  </div>
                  <BarChart2 className="h-8 w-8 text-green-300" />
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
                  <div className="h-full w-[75%] bg-green-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div className="mp-qm-band">
      <div style={{ position: "relative", zIndex: 1 }}>
        <div className="mp-qm-eyebrow">⚡ New Feature</div>
        <h3 className="mp-qm-title">Jump Into a Quick Match</h3>
        <p className="max-w-md font-[poppins] text-xs leading-relaxed font-light tracking-wider text-slate-300">
          No setup required. Choose teams, set overs, and start scoring in seconds. Perfect for
          casual games on the fly.
        </p>
      </div>
      <Link href="/quick-match" className="mp-btn-qm" style={{ position: "relative", zIndex: 1 }}>
        <Zap size={18} /> Start Quick Match
      </Link>
    </div>

    {/* --- CTA SECTION --- */}
    <section className="mp-final-cta">
      <div className="mp-final-cta-bg" />
      <h2>
        Ready to run your
        <br />
        best tournament yet?
      </h2>
      <p>
        Join thousands of organizers who trust Scordo to manage their cricket leagues, tournaments,
        and friendlies.
      </p>
      <div className="mp-final-buttons">
        <Link
          href="/auth/sign-up"
          className="mp-btn-primary"
          style={{ padding: "1rem 2.4rem", fontSize: "1.05rem" }}
        >
          <PlayCircle size={20} /> Create Free Account
        </Link>
        <Link href="/auth/sign-in" className="mp-btn-ghost" style={{ padding: "1rem 2rem" }}>
          Sign In
        </Link>
      </div>
    </section>
  </div>
);

export default MarketingPage;
