import User from "@/types/user.props";
import React from "react";

const TournamentStats = ({ profile }: { profile: User }) => {
  return (
    <div className="border-input mb-6 h-full w-full rounded-xl border">
      <div className="container-bg h-full rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
        <h6 className="heading-text mb-4 flex items-center text-xl font-bold">
          Tournament Analytics
        </h6>
        <h4 className="mb-4 text-center text-2xl font-bold">Total Tournaments</h4>
        <div className="mb-4">
          <small className="subheading-text font-medium">Won</small>
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
          <p className="subheading-text mt-1 text-right text-sm">{78}%</p>
        </div>
        <div>
          <small className="subheading-text font-medium">Lose</small>
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
          <p className="subheading-text mt-1 text-right text-sm">{22}%</p>
        </div>
      </div>
    </div>
  );
};

export default TournamentStats;
