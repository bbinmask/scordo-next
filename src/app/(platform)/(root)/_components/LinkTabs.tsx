"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isTabActive } from "@/utils";
import path from "path";

interface LinkTabsProps {
  tabs: {
    id: string;
    label: string;
    href: string;
    icon: React.ReactNode;
  }[];
}

const LinkTabs = ({ tabs }: LinkTabsProps) => {
  const pathname = usePathname();

  return (
    <div className="container-bg rounded-xl p-4 shadow-md sm:p-6">
      <div className="mb-6 flex justify-center border-b border-gray-200 sm:justify-start dark:border-gray-700">
        {tabs.map((tab) => (
          <Link key={tab.id} href={tab.href}>
            <button
              className={`flex items-center px-4 py-3 font-semibold transition-colors duration-300 ${
                isTabActive(pathname, tab.id, false)
                  ? "border-b-2 border-green-500 text-green-600 dark:text-green-400"
                  : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LinkTabs;
