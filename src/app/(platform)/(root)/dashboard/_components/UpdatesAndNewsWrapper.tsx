"use client";

import { useState } from "react";
import { VideoList } from "../../_components/VideoList";
import NewsList, { NewList } from "./NewsList";
import { Newspaper, Video } from "lucide-react";

const UpdatesAndNewsWrapper = () => {
  const [activeTab, setActiveTab] = useState("updates");

  const contentTabs = [
    { id: "updates", label: "Latest Updates", icon: <Newspaper className="mr-2 h-5 w-5" /> },
    { id: "videos", label: "Featured Videos", icon: <Video className="mr-2 h-5 w-5" /> },
  ];

  return (
    <div className="rounded-xl bg-white p-4 shadow-md sm:p-6 dark:bg-gray-800/50">
      <div className="mb-6 flex justify-center border-b border-gray-200 sm:justify-start dark:border-gray-700">
        {contentTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-3 font-semibold transition-colors duration-300 ${
              activeTab === tab.id
                ? "border-b-2 border-green-500 text-green-600 dark:text-green-400"
                : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === "updates" && <NewList />}
        {activeTab === "videos" && <VideoList />}
      </div>
    </div>
  );
};

export default UpdatesAndNewsWrapper;
