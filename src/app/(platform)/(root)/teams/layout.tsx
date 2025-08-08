import React from "react";
import RouteNavigations from "../_components/RouteNavigations";
import { ListIcon, PlusCircle, Search, Users } from "lucide-react";
import Menu from "../_components/Menu";

const TeamsLayout = ({ children }: { children: React.ReactNode }) => {
  const navLinks = [
    {
      title: "All",
      id: 1,
      path: "/teams",
      className: "",
      icon: (
        <ListIcon className="font-urbanist w-4 transition-all duration-500 md:w-8 md:text-base" />
      ),
    },
    {
      title: "Joined",
      id: 2,
      path: "/teams/my-teams",
      className: "",
      icon: <Users className="font-urbanist w-4 transition-all duration-500 md:w-8 md:text-base" />,
    },
    {
      title: "Find",
      id: 3,
      path: "/teams/search-teams",
      className: "",
      icon: (
        <Search className="font-urbanist w-4 transition-all duration-500 md:w-8 md:text-base" />
      ),
    },
    {
      title: "Create",
      id: 4,
      path: "/teams/create",
      className: "",
      icon: (
        <PlusCircle className="font-urbanist w-4 transition-all duration-500 md:w-8 md:text-base" />
      ),
    },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden px-4">
      {/* Button to toggle the main navbar visibility */}
      <Menu />

      <div className="w-full">
        <h1>Teams</h1>
        {children}
      </div>
    </div>
  );
};

export default TeamsLayout;
