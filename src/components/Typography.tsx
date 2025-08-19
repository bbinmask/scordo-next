import { cn } from "@/lib/utils";
import React from "react";

export const TypographyHeading = ({
  content,
  className,
}: {
  content: string;
  className?: string;
}) => {
  return (
    <h2
      className={cn(
        "flex items-center font-[cal_sans] text-3xl font-extrabold tracking-wide text-lime-600 drop-shadow-lg sm:text-4xl dark:text-lime-300",
        className && className
      )}
    >
      {content}
    </h2>
  );
};
