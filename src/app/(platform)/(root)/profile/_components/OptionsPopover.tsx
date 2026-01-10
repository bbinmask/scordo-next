"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { User } from "@/generated/prisma";
import {
  useDetailsModal,
  useProfileModal,
  useRequestModal,
  useSettingModal,
} from "@/hooks/store/use-profile";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";

const OptionsPopover = () => {
  const { onOpen: onProfileOpen } = useProfileModal();
  const { onOpen: onDetailOpen } = useDetailsModal();
  const { onOpen: onRequestOpen } = useRequestModal();
  const { onOpen: onSettingOpen } = useSettingModal();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <EllipsisVertical className="h-8 w-8 cursor-pointer rounded-full p-1" />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="border-input border bg-gray-50 p-0 shadow-xl dark:bg-gray-800"
      >
        <h1 className="primary-text px-4 py-2 font-[poppins] text-lg font-semibold tracking-wide">
          Options
        </h1>
        <Separator />

        <ul className="rounded-xl">
          <li
            onClick={onDetailOpen}
            className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-300 hover:opacity-80 dark:hover:bg-gray-700"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-gray-800 dark:bg-gray-500"></span>
            <span className="primary-text font-[urbanist] text-base font-semibold">
              Edit Details
            </span>
          </li>

          <li
            onClick={onProfileOpen}
            className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-300 hover:opacity-80 dark:hover:bg-gray-700"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-gray-800 dark:bg-gray-500"></span>
            <span className="primary-text font-[urbanist] text-base font-semibold">
              Update Profile
            </span>
          </li>

          <li
            onClick={onRequestOpen}
            className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-300 hover:opacity-80 dark:hover:bg-gray-700"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-gray-800 dark:bg-gray-500"></span>
            <span className="primary-text font-[urbanist] text-base font-semibold">Requests</span>
          </li>

          <li
            onClick={onSettingOpen}
            className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-300 hover:opacity-80 dark:hover:bg-gray-700"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-gray-800 dark:bg-gray-500"></span>
            <span className="primary-text font-[urbanist] text-base font-semibold">Settings</span>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default OptionsPopover;
