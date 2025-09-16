"use client";

import { JSX, useState } from "react";
import { VideoList } from "./VideoList";
import { UpdatesList } from "../dashboard/_components/NewsList";
import StatsChart from "../profile/_components/StatsChart";
import { user } from "@/constants";

interface TabsProps {
  tabs: {
    id: string;
    label: string;
    icon: JSX.Element;
  }[];
  currentTab: string;
  setCurrentTab: (tabId: string) => void;
}

const Tabs = ({ tabs, currentTab, setCurrentTab }: TabsProps) => {
  const length = tabs.length;

  return (
    <div
      className={`mb-6 flex w-full items-center justify-between border-b border-gray-200 dark:border-gray-700 ${"px-4"}`}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setCurrentTab(tab.id)}
          className={`flex items-center px-4 py-3 font-semibold transition-colors duration-300 ${
            currentTab === tab.id
              ? "border-b-2 border-green-500 text-green-600 dark:text-green-400"
              : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
