"use client";
import { ListIcon, PlusCircle, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import React, { useState } from "react";
import RouteNavigations from "./RouteNavigations";

const Menu = () => {
  const [toggle, setToggle] = useState(false);

  const toggleMenu = () => {
    setToggle((tog) => !tog);
  };
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
    <div className="relative">
      <Button onClick={toggleMenu} variant="ghost" className="h-full w-full">
        <MenuIcon className="h-8 w-8" size={undefined} />
      </Button>

      <div
        className={`absolute -top-2 right-6 list-none flex-row gap-2 rounded-md bg-white p-2 transition-all duration-500 ease-in-out ${toggle ? "flex w-fit -translate-x-4 opacity-100" : "hidden translate-x-0 overflow-hidden opacity-0"}`}
      >
        <RouteNavigations navLinks={navLinks} />
      </div>
    </div>
  );
};

export default Menu;
