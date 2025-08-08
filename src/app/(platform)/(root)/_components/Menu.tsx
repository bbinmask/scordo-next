"use client";
import { ListIcon, PlusCircle, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import RouteNavigations from "./RouteNavigations";
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
    icon: <Search className="font-urbanist w-4 transition-all duration-500 md:w-8 md:text-base" />,
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

const Menu = () => {
  // State to control the visibility of the entire horizontal navbar
  const [isNavbarActive, setIsNavbarActive] = useState(false);

  // Function to toggle the main horizontal navbar's visibility
  const toggleMainNavbar = () => {
    setIsNavbarActive((prev) => !prev);
  };

  return (
    <div className="relative flex">
      {/* Button to toggle the main navbar visibility */}
      <button
        id="showNavbarButton"
        onClick={toggleMainNavbar}
        className="absolute top-4 right-4 z-[100] cursor-pointer rounded-md bg-emerald-500 px-3 py-2 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:scale-105 hover:bg-emerald-600"
      >
        <MenuIcon />
      </button>

      {/* Main Navigation Bar */}
      <nav
        id="mainNavbar"
        className={`absolute top-0 left-0 z-40 w-full transform p-4 transition-transform duration-500 ease-in-out ${
          isNavbarActive ? "translate-x-72" : "translate-x-full"
        }`}
      >
        <RouteNavigations navLinks={navLinks} />
      </nav>
    </div>
  );
};

export default Menu;
