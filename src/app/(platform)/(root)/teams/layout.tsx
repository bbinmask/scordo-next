import React from "react";
import Menu from "../_components/Menu";
import { ListIcon, PlusCircle, Search, Users } from "lucide-react";
import { BreadcrumbDemo } from "../_components/BreadScrumb";

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
        <BreadcrumbDemo
          links={[
            { href: "/my-teams", name: "My Teams" },
            { href: "search", name: "Search" },
          ]}
        />
        <Menu navLinks={navLinks} />
      </div>
      {children}
    </div>
  );
};

export default TeamsLayout;
