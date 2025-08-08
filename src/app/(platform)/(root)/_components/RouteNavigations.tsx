import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const RouteNavigations = ({ navLinks }: { navLinks: any }) => {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 transition-all duration-500 md:gap-3">
      {/* Nav Items */}
      {navLinks.map((link: any, index: number) => (
        <Button
          variant={"default"}
          key={index}
          className={`center relative min-w-16 transform gap-2 rounded-full p-0 shadow-xl transition-all duration-500 ease-in-out hover:scale-105 md:px-5 md:py-3 ${
            pathname === link.path
              ? "bg-gradient-to-r from-emerald-700 to-green-900 px-4 text-white shadow-emerald-500/50 dark:shadow-emerald-800/50"
              : "hover:bg-hover/60 bg-main/20 text-green-800 hover:text-gray-50 dark:bg-emerald-800 dark:text-lime-300 dark:hover:bg-emerald-700"
          }`}
        >
          <Link href={link.path || "#"} className="center flex h-full w-full gap-1">
            {link.icon}
            <span
              className={`text-xs font-bold transition-all duration-500 md:text-base ${pathname === link.path ? "block" : "hidden"}`}
            >
              {link.title}
            </span>
            {pathname === link.path && (
              <span className="animate-in absolute bottom-0 left-1/2 h-1 w-10 -translate-x-1/2 translate-y-1/2 rounded-full bg-lime-400 opacity-0 transition-all duration-300 dark:bg-lime-500"></span>
            )}
          </Link>
        </Button>
      ))}
    </nav>
  );
};

export default RouteNavigations;
