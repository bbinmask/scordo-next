import React from "react";
import Menu from "../_components/Menu";
import { LinkIcon, User, Users } from "lucide-react";

const TeamsLayout = ({ children }: { children: React.ReactNode }) => {
  const navLinks: {
    icon: React.ReactElement;
    title: string;
    description: string;
    path: string;
  }[] = [
    {
      icon: <User />,
      title: "My Tournaments",
      description: "View and manage all tournaments you've created or joined.",
      path: "/tournaments/my",
    },
    {
      icon: <Users />,
      title: "Friend's Tournaments",
      description: "See tournaments your friends are involved in and join the fun.",
      path: "/tournaments/friends",
    },
    {
      icon: <LinkIcon />,
      title: "Explore All",
      description: "Browse all public tournaments available on Scordo.",
      path: "/tournaments/explore",
    },
  ];

  return (
    <div className="overflow-x-hidden px-4">
      <div className="between relative mb-8 flex h-full w-full">
        <h1 className="text-main text-4xl font-black">Tournaments</h1>
        <Menu navLinks={navLinks} />
      </div>
      {children}
    </div>
  );
};

export default TeamsLayout;
