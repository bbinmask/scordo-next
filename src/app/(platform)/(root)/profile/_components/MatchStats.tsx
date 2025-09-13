import User from "@/types/user.props";
import React from "react";

const MatchStats = ({ profile }: { profile: User }) => {
  return (
    <div className="border-input mb-6 h-full w-full rounded-xl border">
      <div className="container-bg h-full rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
        <h6 className="heading-text mb-4 flex items-center text-xl font-bold">Matches Analytics</h6>
        <h4 className="mb-4 text-center text-2xl font-bold">Total Match</h4>
        <div className="mb-4">
          <small className="subheading-text font-medium">Won</small>
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
          <p className="subheading-text mt-1 text-right text-sm">{60}%</p>
        </div>
        <div>
          <small className="subheading-text font-medium">Lose</small>
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
          <p className="subheading-text mt-1 text-right text-sm">40%</p>
        </div>
      </div>
    </div>
  );
};

export default MatchStats;
