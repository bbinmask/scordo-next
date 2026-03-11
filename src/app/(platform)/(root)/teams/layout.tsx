import React from "react";
import { ListIcon, PlusCircle, Search, Shield } from "lucide-react";
import { Metadata } from "next";
import { getMetadata } from "@/utils/helper/getMetadata";

export const metadata = getMetadata("Teams | Scordo");

const TeamsLayout = ({ children }: { children: React.ReactNode }) => {
  const navLinks = [
    {
      title: "Home",
      id: 1,
      path: "/teams",
      className: "",
      icon: <ListIcon className="h-4 w-4 md:h-5 md:w-5" />,
    },
    {
      title: "Squad",
      id: 2,
      path: "/teams/my-teams",
      className: "",
      icon: <Shield className="h-4 w-4 md:h-5 md:w-5" />,
    },
    {
      title: "Search",
      id: 3,
      path: "/teams/search-teams",
      className: "",
      icon: <Search className="h-4 w-4 md:h-5 md:w-5" />,
    },
    {
      title: "Create",
      id: 4,
      path: "/teams/create",
      className: "",
      icon: <PlusCircle className="h-4 w-4 md:h-5 md:w-5" />,
    },
  ];

  return <div className="relative overflow-x-hidden">{children}</div>;
};

export default TeamsLayout;
