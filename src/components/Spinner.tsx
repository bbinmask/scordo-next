import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import React from "react";

const Spinner = ({ className }: { className?: string }) => {
  return <LoaderCircle className={cn("repeat-infinite animate-spin", className)} />;
};

export default Spinner;
