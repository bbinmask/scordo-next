import {
  Activity,
  Code,
  Database,
  Network,
  Rocket,
  Shield,
  Trophy,
  Undo2,
  User,
} from "lucide-react";
import Link from "next/link";

interface pageProps {}

const page = ({}: pageProps) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-10 min-h-screen bg-slate-50 font-sans transition-all duration-700 dark:bg-[#020617]">
      {/* Cinematic Hero Section */}
      <div className="relative flex h-[65vh] flex-col items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-emerald-600/20 via-indigo-600/30 to-slate-900" />
        {/* Abstract Stadium Overlay */}
        <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

        <div className="relative z-20 max-w-5xl px-6 text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 backdrop-blur-md">
            <Trophy className="h-4 w-4 text-emerald-400" />
            <span className="text-[10px] font-black tracking-[0.4em] text-emerald-300 uppercase">
              Sports-Tech Infrastructure
            </span>
          </div>
          <h1 className="mb-6 text-6xl font-black tracking-tighter text-white uppercase italic md:text-8xl">
            SCORDO<span className="text-emerald-500">.</span>
          </h1>
          <h2 className="mb-8 text-3xl font-black tracking-tight text-slate-100 uppercase md:text-5xl">
            The Digital Heart of{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">
              Modern Cricket
            </span>
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed font-medium text-slate-400 md:text-xl">
            More than just a scorecard. We are a structured ecosystem connecting players, teams, and
            tournament organizers through professional-grade digital intelligence.
          </p>
        </div>

        {/* Dynamic Background Glows */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 opacity-30">
          <div className="absolute top-0 left-1/4 h-[500px] w-[500px] animate-pulse rounded-full bg-emerald-600 blur-[150px]" />
          <div className="absolute right-1/4 bottom-0 h-[500px] w-[500px] animate-pulse rounded-full bg-indigo-600 blur-[150px] delay-1000" />
        </div>
      </div>

      {/* Product Pillars Bento Grid */}
      <div className="relative z-30 mx-auto -mt-24 max-w-7xl px-6 pb-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Scoring Engine Card */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-[3rem] border border-slate-200 bg-white p-10 shadow-2xl md:col-span-8 dark:border-white/10 dark:bg-slate-900">
            <Undo2 className="absolute -top-10 -right-10 h-48 w-48 rotate-12 text-emerald-500/5" />
            <div>
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-emerald-100 transition-transform group-hover:scale-110 dark:bg-emerald-900/30">
                <Activity className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="mb-4 text-3xl font-black tracking-tighter uppercase italic">
                Ball-by-Ball Intelligence
              </h3>
              <p className="max-w-2xl text-lg leading-relaxed font-medium text-slate-600 dark:text-slate-400">
                Our precision scoring engine records every action on the field. Built with advanced
                data structures, we support seamless{" "}
                <span className="font-bold text-emerald-500">Undo Functionality</span>, ensuring
                that your match history is as reliable as it is detailed.
              </p>
            </div>
            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-white bg-slate-200 dark:border-slate-800 dark:bg-slate-700"
                  />
                ))}
              </div>
              <p className="text-xs font-black tracking-widest text-slate-400 uppercase">
                100% Data Reliability Guaranteed
              </p>
            </div>
          </div>

          {/* Careers Card */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-[3rem] bg-indigo-600 p-8 text-white shadow-2xl md:col-span-4">
            <Network className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 text-white/5 opacity-50 transition-transform duration-1000 group-hover:scale-125" />
            <div>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                <User className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-3 text-2xl font-black tracking-tighter uppercase italic">
                Career Profiles
              </h3>
              <p className="text-sm leading-relaxed font-medium text-indigo-100 opacity-90">
                Transform raw runs and wickets into meaningful career narratives. Players track
                stats, build reputations, and define their roles—from reliable bowlers to
                power-hitters.
              </p>
            </div>
            <div className="border-t border-white/10 pt-6">
              <p className="text-[10px] font-black tracking-widest uppercase">
                Digital Identities Secured
              </p>
            </div>
          </div>

          {/* Tournament Architect */}
          <div className="group rounded-[3rem] border border-slate-200 bg-white p-8 shadow-xl md:col-span-4 dark:border-white/10 dark:bg-slate-900">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 transition-transform group-hover:rotate-12 dark:bg-amber-900/30">
              <Shield className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="mb-2 text-xl font-black tracking-tighter uppercase italic">
              Tournament Architect
            </h3>
            <p className="text-sm leading-relaxed font-medium text-slate-500 dark:text-slate-400">
              Custom rules, sponsorship integrations, and complete league control. We empower local
              organizers with the tools of the world's biggest professional leagues.
            </p>
          </div>

          {/* The Stack */}
          <div className="relative flex flex-col items-center gap-10 overflow-hidden rounded-[3rem] bg-slate-900 p-8 text-white shadow-2xl md:col-span-8 md:flex-row">
            <div className="flex-1">
              <div className="mb-6 flex items-center gap-2">
                <div className="rounded-lg bg-indigo-500/20 p-2">
                  <Code className="h-4 w-4 text-indigo-400" />
                </div>
                <span className="text-[10px] font-black tracking-widest text-indigo-400 uppercase">
                  Enterprise Stack
                </span>
              </div>
              <h3 className="mb-4 text-2xl font-black tracking-tighter uppercase italic">
                Scalability by Design
              </h3>
              <p className="text-sm leading-relaxed font-medium text-slate-400">
                Engineered with{" "}
                <span className="text-white">Next.js, Redux, Express, and MongoDB</span>. Secured by{" "}
                <span className="text-white">Auth0</span>. Scordo is built to handle thousands of
                concurrent matches without losing a single ball.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-4">
                <Database className="mb-2 h-5 w-5 text-indigo-400" />
                <span className="text-[10px] font-black tracking-widest uppercase">MongoDB</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-4">
                <Rocket className="mb-2 h-5 w-5 text-emerald-400" />
                <span className="text-[10px] font-black tracking-widest uppercase">Next.js</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Impact CTA */}
        <div className="relative mt-32 overflow-hidden rounded-[4rem] border border-slate-200 bg-white p-12 text-center shadow-2xl dark:border-white/10 dark:bg-slate-900">
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-500" />
          <h2 className="mb-6 text-4xl font-black tracking-tighter uppercase italic md:text-6xl">
            Empowering Every <span className="text-emerald-500">League</span>
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg font-medium text-slate-500 dark:text-slate-400">
            Scordo is not just an application. It's the professional digital infrastructure for
            every local league, organizer, and aspiring player.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={"/dashboard"}
              className="rounded-2xl bg-emerald-600 px-10 py-4 text-xs font-black tracking-widest text-white uppercase shadow-xl shadow-emerald-500/20 transition-all hover:bg-emerald-700 active:scale-95"
            >
              Launch Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
