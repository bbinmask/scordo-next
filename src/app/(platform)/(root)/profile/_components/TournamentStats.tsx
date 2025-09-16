import { User } from "@/generated/prisma";
import React from "react";

const TournamentStats = ({ user }: { user: User }) => {
  return (
    <div className="container-bg h-full rounded-xl p-6">
      <h6 className="mb-4 flex items-center font-[cal_sans] text-xl">Tournament Analytics</h6>
      <h4 className="mb-4 text-center font-[poppins] text-lg font-semibold">Total Tournaments</h4>
      <div className="mb-4">
        <small className="font-[poppins] font-semibold">Won</small>
        <div
          className="h-3 w-full rounded-full bg-gray-300"
          role="progressbar"
          aria-label="Tournaments Won Progress"
          aria-valuenow={14}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-3 rounded-full bg-green-500 shadow-md"
            style={{ width: `${"78"}%` }}
          ></div>
        </div>
        <p className="mt-1 text-right font-[poppins] text-sm">{78}%</p>
      </div>
      <div>
        <small className="font-[poppins] font-semibold">Lose</small>
        <div
          className="h-3 w-full rounded-full bg-gray-300"
          role="progressbar"
          aria-label="Tournaments Lose Progress"
          aria-valuenow={22}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-3 rounded-full bg-red-500 shadow-md"
            style={{ width: `${"22"}%` }}
          ></div>
        </div>
        <p className="mt-1 text-right font-[poppins] text-sm">{22}%</p>
      </div>
    </div>
  );
};

export default TournamentStats;
