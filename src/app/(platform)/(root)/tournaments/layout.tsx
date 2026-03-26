import React from "react";
import Menu from "../_components/Menu";
import { LinkIcon, ShieldEllipsisIcon, User, Users } from "lucide-react";
import { getMetadata } from "@/utils/helper/getMetadata";

export const metadata = getMetadata("Teams | Scordo");

const TeamsLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="overflow-x-hidden px-4">{children}</div>;
};

export default TeamsLayout;
