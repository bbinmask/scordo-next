import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import React from "react";
import { MoonLoader } from "react-spinners";

const Spinner = ({ className }: { className?: string }) => {
  return <LoaderCircle className={cn("repeat-infinite animate-spin", className)} />;
};

export const DefaultLoader = ({ className }: { className?: string }) => {
  return <MoonLoader className={cn("animate-spin", className)} />;
};

export default Spinner;
