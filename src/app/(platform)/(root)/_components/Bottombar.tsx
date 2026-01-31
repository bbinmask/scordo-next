"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Swords,
  Search,
  Trophy,
  User,
  Settings,
  Shield,
  MoreHorizontal,
  Bell,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { isTabActive } from "@/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import React, { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";

const Bottombar = () => {
  const pathname = usePathname();
  const moreRef = useRef<HTMLDivElement>(null);
  const navLinks = [
    {
      title: "Home",
      icon: Home,
      path: "/dashboard",
      className: "",
    },
    {
      title: "Explore",
      icon: Search,
      path: "/explore",
      className: "hidden md:block",
    },
    {
      title: "Teams",
      icon: Shield,
      path: "/teams",
      className: "",
    },
    {
      title: "Match",
      icon: Swords,
      path: "/matches",
      className: "",
    },
    {
      title: "Tournament",
      icon: Trophy,
      path: "/tournaments",
      className: "",
    },
    {
      title: "More",
      icon: MoreHorizontal,
      path: "#",
      className: "",
    },
  ];

  const [isMoreActive, setIsMoreActive] = useState(false);

  useOnClickOutside(moreRef as any, () => {
    setIsMoreActive(false);
  });

  return (
    <div className="fixed bottom-0 left-1/2 z-[999] flex h-16 w-full max-w-[800px] -translate-x-1/2 justify-center rounded-t-lg border border-slate-200 bg-gradient-to-r from-green-700 via-green-600 to-green-800 shadow-2xl backdrop-blur-xl transition-all dark:border-white/10 dark:from-gray-900/10 dark:via-slate-900/20 dark:to-green-950/10">
      <div className="m-0 grid w-full grid-cols-5 gap-2 rounded-t-2xl px-2 py-1 shadow-lg shadow-black md:grid-cols-6">
        {navLinks.map((item, i) => {
          const isActive = isTabActive(pathname, item.path);
          const Icon = item.icon;

          return (
            <div className={`${item.className}`} key={i}>
              {item.title.toLowerCase() === "more" ? (
                <MorePopover>
                  <div
                    ref={moreRef as any}
                    onClick={() => setIsMoreActive(true)}
                    className={`center flex flex-col rounded-md px-2 py-1 font-[inter] text-stone-900 shadow-black transition-all duration-300 ease-linear hover:translate-y-0 hover:gap-0 hover:bg-green-600 hover:text-lime-300 hover:shadow-md hover:brightness-125 dark:text-gray-50 dark:hover:bg-green-800 ${isMoreActive ? "translate-y-0 gap-0 bg-green-500 shadow-md" : "translate-y-4 gap-8"}`}
                  >
                    <MoreHorizontal />
                    <span
                      className={`overflow-x-hidden ${isMoreActive ? "font-bold text-lime-300 dark:text-gray-50" : "font-semibold"} font-[inter] text-sm tracking-normal drop-shadow-2xl`}
                    >
                      {item.title}
                    </span>
                  </div>
                </MorePopover>
              ) : (
                <Link
                  className={`center flex flex-col rounded-md px-2 py-1 font-[inter] text-stone-900 shadow-black transition-all duration-300 ease-linear hover:translate-y-0 hover:gap-0 hover:bg-green-600 hover:text-lime-300 hover:shadow-md hover:brightness-125 dark:text-gray-50 dark:hover:bg-green-800 ${isActive ? "translate-y-0 gap-0 bg-green-500 shadow-md" : "translate-y-4 gap-8"}`}
                  href={item.path}
                >
                  {Icon && (
                    <Icon className={`${isActive && "h-6 w-6 text-lime-300 dark:text-white"}`} />
                  )}
                  <span
                    className={`overflow-x-hidden ${isActive ? "font-bold text-lime-300 dark:text-gray-50" : "font-semibold"} font-[inter] text-sm tracking-normal drop-shadow-2xl`}
                  >
                    {item.title}
                  </span>
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface MorePopoverProps {
  children: React.ReactNode;
}
const MorePopover = ({ children }: MorePopoverProps) => {
  const router = useRouter();

  return (
    <Popover>
      <PopoverTrigger className="w-full">{children} </PopoverTrigger>
      <PopoverContent className="relative bg-slate-100 dark:bg-slate-800">
        <div className="mb-2 border-b border-slate-100 p-4 dark:border-white/5">
          <h4 className="font-[poppins] text-sm font-black text-indigo-500 uppercase">
            Quick Portal
          </h4>
        </div>
        <div className="space-y-1 font-[inter]">
          {[
            {
              icon: User,
              label: "My Profile",
              color: "blue",
              onClick: () => {
                router.push("/profile");
              },
            },
            {
              icon: Settings,
              label: "Account Settings",
              color: "slate",
              onClick: () => {
                router.push("/settings");
              },
            },

            { icon: Bell, label: "Notifications", color: "amber", onClick: () => {} },

            {
              icon: HelpCircle,
              label: "About Us",
              color: "green",
              onClick: () => {
                router.push("/help/about-us");
              },
            },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={item.onClick}
              className="group flex w-full items-center gap-3 rounded-2xl p-3 transition-all hover:bg-slate-100 dark:hover:bg-white/5"
            >
              <item.icon className="h-4 w-4 text-slate-400 group-hover:text-indigo-500" />
              <span className="text-sm font-bold tracking-tight text-slate-700 uppercase dark:text-slate-200">
                {item.label}
              </span>
            </button>
          ))}
          <div className="mx-2 my-2 h-px bg-slate-100 dark:bg-white/5" />
          <button className="group flex w-full items-center gap-3 rounded-2xl p-3 transition-all hover:bg-red-50 dark:hover:bg-red-500/10">
            <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
            <span className="text-sm font-bold tracking-tight text-red-600 uppercase">
              Sign Out
            </span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Bottombar;
