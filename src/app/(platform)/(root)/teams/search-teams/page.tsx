"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { mockTeams as teams } from "@/constants";
import NotFoundParagraph from "@/components/NotFoundParagraph";
const SearchPage = () => {
  const data = teams;

  return (
    <div className="mt-10 flex w-full flex-col gap-4">
      <div className="bg-background h-full w-full rounded-md px-2 py-4">
        <h1 className="text-main dark:text-hover mb-8 w-full text-center font-[cal_sans] text-2xl font-black">
          Search Teams
        </h1>
        <div className="relative mb-8 flex w-full items-center gap-2">
          <Input required placeholder="Search for a team" className="py-6 text-lg" />
          <Button
            type="submit"
            className="bg-main hover:bg-hover active:bg-hover/70 absolute right-0 py-6 text-white dark:brightness-125"
          >
            <Search className="" />
          </Button>
        </div>
        <div className="center flex flex-col">
          {data.length === 0 ? (
            <NotFoundParagraph description="No teams found" />
          ) : (
            data.map((team) => (
              <div className="" key={team.id}>
                {team.name}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
