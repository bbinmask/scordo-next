"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutGrid,
  Search,
  Shield,
  Trophy,
  MonitorPlay,
  User,
  Bell,
  Menu,
  X,
  Settings,
  LogOut,
  ChevronDown,
  Activity,
  Flame,
  Zap,
  Star,
  LucideIcon,
  Moon,
  Sun,
} from "lucide-react";
import { SignOutButton, useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { isTabActive } from "@/utils";
interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  view: string;
}

const NavLink = ({
  item,
  onClick,
  pathname,
}: {
  item: NavItem;
  onClick: () => void;
  pathname: string;
}) => {
  const active = isTabActive(pathname, item.path);

  console.log({ item, active });

  return (
    <button
      onClick={onClick}
      className={`group relative flex items-center gap-2.5 rounded-xl px-4 py-2 font-sans transition-all duration-300 ${
        active ? "text-emerald-500" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
      }`}
    >
      <item.icon
        size={18}
        className={active ? "animate-pulse" : "transition-transform group-hover:scale-110"}
      />
      <span className="text-[11px] font-black tracking-widest uppercase">{item.label}</span>

      {/* Active Underline Glow */}
      {active && (
        <div className="absolute right-4 -bottom-1 left-4 h-0.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
      )}
    </button>
  );
};

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-[1000] transition-all duration-500 ${
        isScrolled ? "px-2 py-3" : "border border-slate-200 py-0 dark:border-white/10"
      }`}
    >
      <div
        className={`mx-auto rounded-[2rem] border shadow-2xl transition-all duration-500 ${
          isScrolled
            ? "border-slate-200 bg-white/80 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/80"
            : "border-transparent bg-transparent shadow-none"
        }`}
      >
        <div
          className={`flex h-16 items-center justify-between transition-all duration-500 ${isScrolled ? "px-6" : "px-2"}`}
        >
          {/* LOGO */}
          <Link href={"/"} className="group flex cursor-pointer items-center gap-2">
            <div className="rounded-xl bg-emerald-600 p-2 shadow-lg shadow-emerald-500/20 transition-transform duration-700 ease-in-out group-hover:rotate-12">
              <Activity size={20} className="text-white" />
            </div>
            <h1 className="text-2xl leading-none font-black tracking-tighter text-slate-900 uppercase italic dark:text-white">
              SCORDO<span className="text-emerald-500">.</span>
            </h1>
          </Link>
          {/* ACTION AREA */}
          {
            <div className="flex items-center gap-3">
              {/* EXPLORE */}
              {!user && pathname !== "/explore" && (
                <Link
                  href={"/explore"}
                  className="relative rounded-xl border border-slate-200 bg-white p-3 text-slate-400 shadow-sm transition-all hover:text-indigo-500 dark:border-white/10 dark:bg-slate-900"
                >
                  <Search size={18} />
                </Link>
              )}
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hidden rounded-xl border border-slate-200 bg-white p-3 text-slate-400 shadow-sm transition-all hover:text-emerald-500 md:flex dark:border-white/10 dark:bg-slate-900"
              >
                {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              <button className="relative rounded-xl border border-slate-200 bg-white p-3 text-slate-400 shadow-sm transition-all hover:text-indigo-500 dark:border-white/10 dark:bg-slate-900">
                <Bell size={18} />
                <div className="absolute top-2 right-2 h-2 w-2 animate-pulse rounded-full border-2 border-white bg-red-500 dark:border-slate-900" />
              </button>

              {/* User Profile Trigger */}
              {user && (
                <div className="flex items-center gap-3 border-l border-slate-200 pl-3 dark:border-white/10">
                  <div className="hidden text-right md:block">
                    <p className="text-[10px] leading-none font-black tracking-tighter text-slate-900 uppercase dark:text-white">
                      {user?.fullName}
                    </p>
                    <p className="mt-1 text-[8px] font-bold tracking-widest text-emerald-500 uppercase">
                      {user?.username}
                    </p>
                  </div>
                  <button className="group relative h-10 w-10 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-inner transition-all hover:border-emerald-500 dark:border-white/10 dark:bg-slate-800">
                    {user?.imageUrl ? (
                      <img src={user?.imageUrl} className="h-full w-full object-cover" alt="User" />
                    ) : (
                      <User
                        size={18}
                        className="m-auto text-slate-400 transition-colors group-hover:text-emerald-500"
                      />
                    )}
                  </button>
                </div>
              )}
            </div>
          }
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
