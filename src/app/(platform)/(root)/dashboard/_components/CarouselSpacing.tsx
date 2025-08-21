"use client";

import { useRef } from "react";
import { Calendar, ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import { LiveMatchCard, UpcomingMatchCard } from "./CarouselCard";
import { Button } from "@/components/ui/button";
import NotFoundParagraph from "@/components/NotFoundParagraph";

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
    <div className="relative lg:px-4">
      {/* Scroll Buttons */}
      {matches.length > 3 && (
        <>
          <button
            onClick={() => scroll(-1)}
            className="bg-main absolute top-1/2 left-4 z-10 hidden aspect-square -translate-y-1/2 cursor-pointer rounded-full border-none p-1 text-white opacity-80 hover:opacity-90 md:block"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll(1)}
            className="bg-main absolute top-1/2 right-2 z-10 hidden aspect-square -translate-y-1/2 cursor-pointer rounded-full border-none p-1 text-white opacity-80 hover:opacity-90 md:block"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Scroll Container */}

      {matches.length === 0 ? (
        <NotFoundParagraph description="No matches found." />
      ) : (
        <div
          ref={scrollRef}
          className="hide_scrollbar flex flex-row justify-start gap-3 overflow-x-auto overflow-y-hidden scroll-smooth px-3"
        >
          {status === "Live" &&
            matches.map((match, i) => (
              <LiveMatchCard
                key={i}
                match={match}
                className="mb-1 w-72 flex-shrink-0 transform rounded-xl border border-gray-200 bg-white p-4 shadow-md transition-transform duration-300 hover:scale-95 dark:border-gray-700 dark:bg-gray-800"
              />
            ))}
          {status === "Upcoming" &&
            matches.map((match, i) => (
              <UpcomingMatchCard
                key={i}
                match={match}
                className="mb-1 w-72 flex-shrink-0 transform rounded-xl border border-gray-200 bg-white p-4 shadow-md transition-transform duration-300 hover:scale-95 dark:border-gray-700 dark:bg-gray-800"
              />
            ))}
        </div>
      )}
    </div>
  );
}
