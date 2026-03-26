import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Cpu,
  GithubIcon,
  Globe,
  LinkedinIcon,
  Lock,
  Mail,
  MonitorPlay,
  Search,
  Shield,
  Trophy,
  TwitterIcon,
  Zap,
} from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Navigation",
      links: [
        { label: "Dashboard", icon: Activity, href: "#" },
        { label: "Explore Hub", icon: Search, href: "#" },
        { label: "Live Fixtures", icon: MonitorPlay, href: "#" },
        { label: "Squad Roster", icon: Shield, href: "#" },
      ],
    },
    {
      title: "Organization",
      links: [
        { label: "Leagues", icon: Trophy, href: "#" },
        { label: "Officials", icon: Lock, href: "#" },
        { label: "Career Portal", icon: Globe, href: "#" },
        { label: "Sponsorships", icon: Zap, href: "#" },
      ],
    },
    {
      title: "Infrastructure",
      links: [
        { label: "API Docs", icon: Cpu, href: "#" },
        { label: "System Status", icon: Activity, href: "#" },
        { label: "Privacy Policy", icon: Shield, href: "#" },
        { label: "Compliance", icon: CheckCircle2, href: "#" },
      ],
    },
  ];

  return (
    <footer className="w-full border-t border-slate-200 bg-slate-50 px-6 pt-10 pb-10 font-sans transition-colors duration-500 md:px-12 dark:border-white/5 dark:bg-[#0f1223]">
      <div className="mx-auto max-w-7xl">
        {/* Top Section: Brand & Newsletter */}
        <div className="flex w-full flex-col justify-between lg:flex-row">
          <div className="mb-8 w-full space-y-6">
            <div className="group flex cursor-pointer items-center gap-3">
              <h1 className="text-3xl leading-none font-black tracking-tighter text-slate-900 uppercase italic dark:text-white">
                SCORDO<span className="text-emerald-500">.</span>
              </h1>
            </div>
            <p className="max-w-sm text-sm leading-relaxed font-medium text-slate-500 dark:text-slate-400">
              Professional digital infrastructure for competitive cricket. Deployed globally to
              manage rosters, fixtures, and tactical intelligence in real-time.
            </p>
          </div>
          {/* Bottom Section: Legal & Credits */}
          <div className="flex w-full flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-6">
              <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                © {currentYear} SCORDO INTERNATIONAL
              </p>
              <div className="hidden h-4 w-px bg-slate-200 md:block dark:bg-white/10" />
              <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Designed by Irfanul Madar
              </p>
            </div>
            <div className="flex items-center gap-4">
              {[
                { icon: TwitterIcon, path: "https://x.com/bbinmask" },
                { icon: GithubIcon, path: "https://github.com/bbinmask" },
                { icon: LinkedinIcon, path: "/" },
              ].map((link, i) => (
                <Link
                  href={link.path}
                  role="link"
                  rel="new"
                  target="_blank"
                  key={i}
                  className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-400 shadow-sm transition-all hover:border-emerald-500/50 hover:text-emerald-500 dark:border-white/10 dark:bg-slate-900"
                >
                  <link.icon size={18} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
