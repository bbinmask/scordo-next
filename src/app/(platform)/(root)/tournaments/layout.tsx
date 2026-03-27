import React from "react";
import { getMetadata } from "@/utils/helper/getMetadata";

export const metadata = getMetadata("Tournaments | Scordo");

const TournamentsLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="overflow-x-hidden px-4">{children}</div>;
};

export default TournamentsLayout;
