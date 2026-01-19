"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";

interface CarouselProps {
  children: React.ReactNode;
  className?: ClassNameValue;
}

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function Carousel({ children, className }: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isScrollable, setIsScrollable] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  /**
   * Manually animate scroll with easing
   */
  const smoothScroll = (distance: number, duration = 300) => {
    const el = scrollRef.current;
    if (!el) return;

    const start = el.scrollLeft;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeInOutCubic(progress);

      el.scrollLeft = start + distance * ease;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  /**
   * Update arrow visibility
   */
  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;

    setIsScrollable(scrollWidth > clientWidth);
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  /**
   * Scroll by one card
   */
  const scroll = (dir: number) => {
    const el = scrollRef.current;
    if (!el) return;

    const cardWidth = el.firstChild instanceof HTMLElement ? el.firstChild.offsetWidth * 2 : 252;

    smoothScroll(dir * cardWidth);
  };

  useEffect(() => {
    updateScrollState();

    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [children]);

  return (
    <div className={cn("relative", className)}>
      {/* Left Arrow */}
      {isScrollable && canScrollLeft && (
        <button
          onClick={() => scroll(-1)}
          className="bg-main absolute top-1/2 left-0 z-50 hidden -translate-y-1/2 rounded-full p-1.5 text-white opacity-80 transition-transform duration-500 hover:scale-125 hover:opacity-90 md:block"
        >
          <ChevronLeft size={18} />
        </button>
      )}

      {/* Right Arrow */}
      {isScrollable && canScrollRight && (
        <button
          onClick={() => scroll(1)}
          className="bg-main absolute top-1/2 right-0 z-50 hidden -translate-y-1/2 rounded-full p-1.5 text-white opacity-80 transition-transform duration-500 hover:scale-125 hover:opacity-90 md:block"
        >
          <ChevronRight size={18} />
        </button>
      )}

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="hide_scrollbar flex gap-2 overflow-x-auto overflow-y-hidden scroll-smooth px-2 py-2"
      >
        {children}
      </div>
    </div>
  );
}
