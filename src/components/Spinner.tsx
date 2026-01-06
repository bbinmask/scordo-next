import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import React from "react";
import { MoonLoader } from "react-spinners";
import { LoaderSizeProps } from "react-spinners/helpers/props";

const Spinner = ({ className }: LoaderSizeProps) => {
  return <LoaderCircle className={cn("repeat-infinite animate-spin", className)} />;
};

export const DefaultLoader = ({ className }: LoaderSizeProps) => {
  return (
    <div className="center flex min-h-[calc(100vh-9rem)]">
      <span className="relative h-[78px] w-[78px] animate-spin">
        <span className="absolute top-[25px] h-[10px] w-[10px] animate-spin rounded-full bg-black dark:bg-white" />
        <span className="absolute box-content h-[60px] w-[60px] rounded-full border-[9px] border-black opacity-30 dark:border-white" />
      </span>
    </div>
  );
};

export default Spinner;
