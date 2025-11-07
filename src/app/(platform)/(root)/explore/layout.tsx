import { getMetadata } from "@/utils/helper/getMetadata";
import React from "react";

interface layoutProps {
  children: React.ReactNode;
}

export const metadata = getMetadata("Explore | Scordo", "Search for users, teams and tournaments");

const ExploreLayout = ({ children }: layoutProps) => {
  return <>{children}</>;
};

export default ExploreLayout;
