"use client";
import { useState } from "react";
import { ListIcon, PlusCircle, Search, Users, X, MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import RouteNavigations from "./RouteNavigations";

const Menu = ({ navLinks }: { navLinks: any }) => {
  // State to control the visibility of the entire horizontal navbar
  const [isNavbarActive, setIsNavbarActive] = useState(false);

  // Function to toggle the main horizontal navbar's visibility
  const toggleMainNavbar = () => {
    console.log(!isNavbarActive);
    setIsNavbarActive((prev) => !prev);
  };

  return (
    <div className="absolute top-0 right-0 flex items-start">
      {/* Main Navigation Bar */}
      <nav
        id="mainNavbar"
        className={`top-0 left-0 z-40 w-full transform px-2 transition-transform duration-500 ease-in-out ${
          isNavbarActive ? "translate-x-0" : "translate-x-96 md:translate-x-[600px]"
        }`}
      >
        <RouteNavigations navLinks={navLinks} />
      </nav>
      {/* Button to toggle the main navbar visibility */}
      <Button
        id="showNavbarButton"
        onClick={toggleMainNavbar}
        className={`hover:bg-hover bg-main top-0 right-4 z-[100] w-fit cursor-pointer rounded-md px-3 py-2 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:scale-105`}
      >
        {isNavbarActive ? <X /> : <MenuIcon />}
      </Button>
    </div>
  );
};

export default Menu;
