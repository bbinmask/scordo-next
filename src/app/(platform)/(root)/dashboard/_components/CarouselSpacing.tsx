"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LiveMatchCard, UpcomingMatchCard } from "./CarouselCard";
import NotFoundParagraph from "@/components/NotFoundParagraph";

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
      container.firstChild instanceof HTMLElement ? container.firstChild.offsetWidth + 12 : 252;

    container.scrollBy({ left: dir * cardWidth, behavior: "smooth" });
  };

  return (
    <div className="relative">
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
                className="mb-1 w-60 flex-shrink-0 transform rounded-xl bg-white p-4 shadow-md transition-transform duration-300 hover:scale-95 dark:bg-gray-800"
              />
            ))}
          {status === "Upcoming" &&
            matches.map((match, i) => (
              <UpcomingMatchCard
                key={i}
                match={match}
                className="mb-1 w-60 flex-shrink-0 transform rounded-xl bg-white p-4 shadow-md transition-transform duration-300 hover:scale-95 dark:bg-gray-800"
              />
            ))}
        </div>
      )}
    </div>
  );
}
