"use client";

import { useState } from "react";
import { X, MenuIcon } from "lucide-react";
import RouteNavigations from "./RouteNavigations";

const Menu = ({ navLinks }: { navLinks: any }) => {
  const [isNavbarActive, setIsNavbarActive] = useState(true);

  const toggleMainNavbar = () => {
    setIsNavbarActive((prev) => !prev);
  };

  return (
    <div className="absolute top-0 right-0 flex items-start py-1">
      <nav
        id="mainNavbar"
        className={`top-0 left-0 z-40 w-full transform px-2 transition-transform duration-500 ease-in-out ${
          isNavbarActive ? "translate-x-0" : "translate-x-96 md:translate-x-[600px]"
        }`}
      >
        <RouteNavigations navLinks={navLinks} />
      </nav>
      <button
        id="showNavbarButton"
        onClick={toggleMainNavbar}
        className={`hover:bg-hover bg-main top-0 right-4 z-[100] w-fit cursor-pointer rounded-md p-2 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:scale-105`}
      >
        {isNavbarActive ? (
          <X className="h-4 w-4 md:h-5 md:w-5" />
        ) : (
          <MenuIcon className="h-4 w-4 md:h-5 md:w-5" />
        )}
      </button>
    </div>
  );
};

export default Menu;
