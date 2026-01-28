import React from "react";
import Menu from "../_components/Menu";
import { ListIcon, PlusCircle, Search, Shield, Users } from "lucide-react";
import { getMetadata } from "@/utils/helper/getMetadata";

export const metadata = getMetadata("Teams | Scordo");

const TeamsLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="">{children}</div>;
};

export default TeamsLayout;
