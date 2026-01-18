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
    <h1
      className={cn(
        "primary-heading flex items-center font-[poppins] text-3xl font-extrabold tracking-wide drop-shadow-lg sm:text-4xl",
        className && className
      )}
    >
      {content}
    </h1>
  );
};
