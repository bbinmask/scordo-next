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
      icon: <ListIcon />,
    },
    {
      title: "Squad",
      id: 2,
      path: "/teams/my-teams",
      className: "",
      icon: <Users />,
    },
    {
      title: "Find",
      id: 3,
      path: "/teams/search-teams",
      className: "",
      icon: <Search />,
    },
    {
      title: "Create",
      id: 4,
      path: "/teams/create",
      className: "",
      icon: <PlusCircle />,
    },
  ];

  return (
    <div className="overflow-x-hidden px-4">
      <div className="between relative mb-8 flex h-full w-full">
        <h1 className="text-main dark:text-hover font-[poppins] text-3xl font-black">
          Teams{" "}
          <span className="animate-in absolute bottom-0 left-1/2 h-1 w-10 -translate-x-1/2 translate-y-1/2 rounded-full bg-lime-400 opacity-0 transition-all duration-300 dark:bg-lime-500"></span>
        </h1>
        <Menu navLinks={navLinks} />
      </div>
      {children}
    </div>
  );
};

export default TeamsLayout;
