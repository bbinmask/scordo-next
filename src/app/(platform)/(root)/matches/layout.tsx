import React from "react";
import Menu from "../_components/Menu";
import { ListIcon, PlusCircle, Search, Users } from "lucide-react";

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
      title: "Search",
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
    <div className="overflow-x-hidden px-4">
      <div className="between relative mb-8 flex h-full w-full">
        <h1 className="text-main text-3xl font-black">Match</h1>
        <Menu navLinks={navLinks} />
      </div>
      {children}
    </div>
  );
};

export default TeamsLayout;
