import React from "react";
import Menu from "../_components/Menu";

const TeamsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="overflow-x-hidden px-4">
      <div className="between relative mb-8 flex h-full w-full">
        <h1>Teams</h1>
        <Menu />
      </div>
      {children}
    </div>
  );
};

export default TeamsLayout;
