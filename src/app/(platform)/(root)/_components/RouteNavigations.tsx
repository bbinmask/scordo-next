"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const AnimatedNavbar = ({ navLinks }: { navLinks: any }) => {
  const pathname = usePathname();
  // useEffect(() => {
  //   const el = itemRefs.current[activeIndex];
  //   if (el) {
  //     const { offsetLeft, offsetWidth } = el;
  //     setHighlighterStyle({
  //       left: offsetLeft,
  //       width: offsetWidth,
  //     });
  //   }
  // }, [activeIndex]);

  return (
    <nav className="flex gap-1 transition-all duration-500 md:gap-6">
      {/* Nav Items */}
      {navLinks.map((link: any, index: number) => (
        <Link
          key={index}
          href={link.path || "#"}
          className={`center relative flex min-w-16 transform gap-2 rounded-full px-3 py-2 shadow-xl transition-all duration-500 ease-in-out hover:scale-105 md:px-5 md:py-3 ${
            pathname === link.path
              ? "bg-gradient-to-r from-emerald-700 to-green-900 text-white shadow-emerald-500/50 dark:shadow-emerald-800/50"
              : "bg-green-100 text-green-800 hover:bg-green-50 dark:bg-emerald-800 dark:text-lime-300 dark:hover:bg-emerald-700"
          }`}
        >
          <link.icon className="font-urbanist w-4 transition-all duration-500 md:w-8 md:text-base" />
          <span
            className={`text-xs font-bold transition-all duration-500 md:text-base ${pathname === link.path ? "block" : "hidden"}`}
          >
            {link.title}
          </span>
          {pathname === link.path && (
            <span className="animate-in absolute bottom-0 left-1/2 h-1 w-10 -translate-x-1/2 translate-y-1/2 rounded-full bg-lime-400 opacity-0 transition-all duration-300 dark:bg-lime-500"></span>
          )}
        </Link>
      ))}
    </nav>
  );
};

export default AnimatedNavbar;
