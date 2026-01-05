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
      <MoonLoader className={cn("animate-spin", className)} />
    </div>
  );
};

export default Spinner;
