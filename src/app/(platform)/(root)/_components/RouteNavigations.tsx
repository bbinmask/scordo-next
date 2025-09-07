import { isTabActive } from "@/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const RouteNavigations = ({ navLinks }: { navLinks: any }) => {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 transition-all duration-500 md:gap-3">
      {/* Nav Items */}
      {navLinks.map((link: any, index: number) => {
        return (
          <Link
            href={link.path || "#"}
            key={index}
            className={`center relative min-w-12 transform gap-2 rounded-full px-0 py-2 shadow-xl transition-all duration-500 ease-in-out hover:scale-95 md:px-5 ${
              isTabActive(pathname, link.path, false)
                ? "bg-gradient-to-r from-emerald-700 to-green-900 px-4 text-white shadow-emerald-500/50 dark:shadow-emerald-800/50"
                : "hover:bg-hover/60 bg-main/20 text-green-800 hover:text-gray-50 dark:bg-emerald-800 dark:text-lime-300 dark:hover:bg-emerald-700"
            }`}
          >
            <div className="center flex h-full w-full gap-1">
              {link.icon}
              <span
                className={`font-[urbanist] text-xs font-bold transition-all duration-500 md:text-base ${isTabActive(pathname, link.path, false) ? "block" : "hidden"}`}
              >
                {link.title}
              </span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
};

export default RouteNavigations;
