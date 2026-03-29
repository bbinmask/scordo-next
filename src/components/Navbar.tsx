"use client";

import React, { useState, useEffect } from "react";
import { Search, User, Bell, Activity, Moon, Sun, ArrowLeft } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useRequestModal } from "@/hooks/store/use-profile";
import RequestsModal from "@/components/modals/RequestsModal";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user } = useUser();

  const router = useRouter();
  const { onOpen } = useRequestModal();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const headingText = pathname.split("/")[1];

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-[1000] transition-all duration-500 ${
        isScrolled ? "px-2 py-3" : "border-b border-slate-200 py-0 dark:border-white/10"
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
          <div className="flex w-full items-center gap-4">
            {headingText !== "dashboard" && headingText !== "" && (
              <button onClick={() => router.back()} className="cursor-pointer">
                <ArrowLeft />
              </button>
            )}
            <Link
              href={`/${headingText === "u" ? "/" : headingText}`}
              className="group flex w-full cursor-pointer items-center gap-2"
            >
              <h1 className="w-full text-[100%] leading-none font-black tracking-tighter text-slate-900 uppercase italic sm:text-[2vw] dark:text-white">
                {headingText === "dashboard" || headingText === ""
                  ? "SCORDO"
                  : headingText === "u"
                    ? "User Details"
                    : headingText}
                <span className="text-emerald-500">.</span>
              </h1>
            </Link>
          </div>
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
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-xl border border-slate-200 bg-white p-3 text-slate-400 shadow-sm transition-all hover:text-emerald-500 dark:border-white/10 dark:bg-slate-900"
              >
                {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              {user && (
                <button
                  onClick={onOpen}
                  className="relative rounded-xl border border-slate-200 bg-white p-3 text-slate-400 shadow-sm transition-all hover:text-indigo-500 dark:border-white/10 dark:bg-slate-900"
                >
                  <Bell size={18} />
                  <div className="absolute top-2 right-2 h-2 w-2 animate-pulse rounded-full border-2 border-white bg-red-500 dark:border-slate-900" />
                </button>
              )}

              {/* User Profile Trigger */}
              {user && (
                <div className="flex items-center gap-3 border-l border-slate-200 pl-3 dark:border-white/10">
                  <div className="hidden text-right md:block">
                    <p className="truncate text-[10px] leading-none font-black overflow-ellipsis text-slate-900 uppercase dark:font-bold dark:text-white">
                      {user?.fullName}
                    </p>
                    <p className="mt-1 text-[8px] font-bold tracking-widest text-emerald-500 uppercase">
                      {user?.username}
                    </p>
                  </div>
                  <UserButton />
                </div>
              )}
            </div>
          }
        </div>
      </div>
      <RequestsModal enabled />
    </nav>
  );
};

export default Navbar;
