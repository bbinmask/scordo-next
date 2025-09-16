import { User } from "@/generated/prisma";
import React from "react";

const MatchStats = ({ user }: { user: User }) => {
  return (
    <div className="container-bg p-6">
      <h6 className="mb-4 flex items-center font-[cal_sans] text-xl">Matches Analytics</h6>
      <h4 className="mb-4 text-center font-[poppins] text-lg font-semibold">Winning Percentage</h4>
      <div className="mb-4">
        <small className="font-[poppins] font-semibold">Won</small>
        <div
          className="h-3 w-full rounded-full bg-gray-300"
          role="progressbar"
          aria-label="Matches Won Progress"
          aria-valuenow={60}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-3 rounded-full bg-green-500 shadow-md"
            style={{ width: `${"60"}%` }} // profile.won
          ></div>
        </div>
        <p className="mt-1 text-right font-[poppins] text-sm">{60}%</p>
      </div>
      <div>
        <small className="font-[poppins] font-semibold">Lose</small>
        <div
          className="h-3 w-full rounded-full bg-gray-300"
          role="progressbar"
          aria-label="Matches Lose Progress"
          aria-valuenow={40}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-3 rounded-full bg-red-500 shadow-md"
            style={{ width: `${"40"}%` }}
          ></div>
        </div>
        <p className="mt-1 text-right font-[poppins] text-sm">40%</p>
      </div>
    </div>
  );
};

export default MatchStats;
