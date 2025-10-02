"use client";
import { Bell, ChartNoAxesColumn, Moon, Sun, Sword } from "lucide-react";
import { Group, GroupIcon, Home, Menu, Trophy } from "lucide-react";
import Link from "next/link";
import { user } from "@/constants";
import NavbarDropdown from "./NavbarDropdown";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const navLinks = [
  {
    path: "/",
    name: "Home",
    element: <Home />,
  },
  {
    path: "/teams",
    name: "Teams",
    element: <Group />,
  },
  {
    path: "/matches",
    name: "matches",
    element: <Sword />,
  },
  {
    path: "/tournaments",
    name: "Tournaments",
    element: <Trophy />,
  },
  {
    path: "/profile/stats",
    name: "Stats",
    element: <ChartNoAxesColumn />,
  },
  {
    path: "/groups",
    name: "Groups",
    element: <GroupIcon />,
  },
];
const Navbar = () => {
  const [theme, setTheme] = useState<"light" | "dark">();
  const [isSticky, setIsSticky] = useState(false);

  const handleDarkMode = () => {
    const mode = document.querySelector("html")?.classList.toggle("dark");
    localStorage.setItem("theme", mode ? "dark" : "light");
    setTheme(mode ? "dark" : "light");
  };

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme") as "light" | "dark";
    if (currentTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setTheme(currentTheme);

    const handleScroll = () => {
      setIsSticky(window.scrollY > 0.1);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`primary-background sticky top-0 z-[999] grid min-h-12 w-full items-center px-2 py-3 ${
        isSticky && "shadow-lg shadow-black/60"
      }`}
    >
      <div className="flex w-full items-center">
        <div className="flex w-full items-center justify-between">
          <Link
            href={"/"}
            className="mx-2 font-[poppins] text-2xl font-black text-white drop-shadow-lg dark:brightness-150 dark:contrast-125 dark:saturate-150"
          >
            Scordo
          </Link>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleDarkMode}
              className="primary-btn h-8 w-8 cursor-pointer rounded-full p-2"
            >
              {theme == "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            <Button type="button" className="primary-btn h-8 w-8 cursor-pointer rounded-full">
              <Bell className="h-4 w-4" />
            </Button>
            <NavbarDropdown data={user} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
