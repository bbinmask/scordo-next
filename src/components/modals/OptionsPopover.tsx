"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { MoreVertical } from "lucide-react";

interface OptionsPopoverProps {
  data: {
    onClose: () => void;
    onOpen: () => void;
    label: string;
  }[];
}

const OptionsPopover = ({ data }: OptionsPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="primary-text cursor-pointer rounded-xl border border-slate-400/50 bg-white p-2 shadow-sm ring-slate-400 transition-colors duration-300 ease-in-out focus:ring-1 dark:border-white/10 dark:bg-slate-800 dark:ring-slate-400">
          <MoreVertical className="h-5 w-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="border-input border bg-gray-50 p-0 shadow-xl dark:bg-gray-800"
      >
        <h1 className="primary-text px-4 pt-4 font-[poppins] text-base font-semibold tracking-wide">
          Options
        </h1>
        <Separator />

        <ul className="rounded-xl">
          {data.map((d, i) => (
            <li
              key={i}
              onClick={d.onOpen}
              className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-300 hover:opacity-80 dark:hover:bg-gray-700"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-gray-800 dark:bg-gray-500"></span>
              <span className="primary-text font-[urbanist] text-sm font-semibold">{d.label}</span>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default OptionsPopover;
