"use client";

import { useRef } from "react";
import { Calendar, ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import { LiveMatchCard, UpcomingMatchCard } from "./CarouselCard";

const matches = [
  {
    title: "India vs Australia",
    date: "2025-06-05",
    image: "/images/ind-aus.jpg",
  },
  {
    title: "England vs Pakistan",
    date: "2025-06-07",
    image: "/images/eng-pak.jpg",
  },
  {
    title: "South Africa vs New Zealand",
    date: "2025-06-09",
    image: "/images/sa-nz.jpg",
  },
  {
    title: "Sri Lanka vs Bangladesh",
    date: "2025-06-10",
    image: "/images/sl-ban.jpg",
  },
  {
    title: "West Indies vs Afghanistan",
    date: "2025-06-12",
    image: "/images/wi-afg.jpg",
  },
];

export function CarouselSpacing({
  matches,
  status,
}: {
  matches: any[];
  status: "Live" | "Upcoming";
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    const container = scrollRef.current;
    if (!container) return;

    const cardWidth =
      container.firstChild instanceof HTMLElement
        ? container.firstChild.offsetWidth + 16 // 16px = gap-4
        : 336; // default w-80 + gap

    container.scrollBy({ left: dir * cardWidth, behavior: "smooth" });
  };

  return (
    <div className="">
      <div className="relative px-2">
        {/* Scroll Buttons */}
        {matches.length > 3 && (
          <>
            <button
              onClick={() => scroll(-1)}
              className="bg-prime bg-opacity-80 hover:bg-opacity-80 absolute top-1/2 -left-7 z-10 hidden -translate-y-1/2 cursor-pointer rounded-full border-none p-1 text-white lg:block"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll(1)}
              className="bg-prime bg-opacity-80 hover:bg-opacity-80 absolute top-1/2 -right-7 z-10 hidden -translate-y-1/2 cursor-pointer rounded-full border-none p-1 text-white lg:block"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Scroll Container */}

        <h3 className="mb-6 flex items-center text-3xl font-bold text-gray-800 dark:text-gray-100">
          {status === "Live" && (
            <>
              <PlayCircle className="mr-3 h-8 w-8 text-green-600" /> Live Matches
            </>
          )}

          {status === "Upcoming" && (
            <>
              <Calendar className="mr-3 h-8 w-8 text-green-600" /> Upcoming Matches
            </>
          )}
        </h3>
        {matches.length === 0 ? (
          <h3 className="heading-text mb-6 flex items-center text-base font-bold">
            No matches found.
          </h3>
        ) : (
          <div
            ref={scrollRef}
            className="hide_scrollbar flex flex-row justify-start gap-4 overflow-x-auto overflow-y-hidden scroll-smooth p-2"
          >
            {status === "Live" &&
              matches.map((match, i) => (
                <LiveMatchCard
                  key={i}
                  match={match}
                  className="w-72 flex-shrink-0 transform rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-transform duration-300 hover:scale-105 md:w-96 dark:border-gray-700 dark:bg-gray-800"
                />
              ))}
            {status === "Upcoming" &&
              matches.map((match, i) => (
                <UpcomingMatchCard
                  key={i}
                  match={match}
                  className="w-72 flex-shrink-0 transform rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-transform duration-300 hover:scale-105 md:w-96 dark:border-gray-700 dark:bg-gray-800"
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
