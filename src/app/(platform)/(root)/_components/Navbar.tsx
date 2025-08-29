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
  const handleDarkMode = () => {
    const mode = document.querySelector("html")?.classList.toggle("dark");
    localStorage.setItem("theme", mode ? "dark" : "light");
    setTheme(mode ? "dark" : "light");
  };

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    if (!currentTheme) return;

    setTheme(currentTheme);

    if (currentTheme === "dark") {
      document.querySelector("html")?.classList.add(currentTheme);
    }
  }, []);

  return (
    <div className="primary-background fixed top-0 z-[999] grid min-h-16 w-full items-center px-2 py-2 shadow-lg shadow-black/60">
      <div className="flex w-full items-center">
        <div className="flex w-full items-center justify-between">
          <Link
            href={"/"}
            className="mx-2 font-[poppins] text-3xl font-black text-white drop-shadow-lg dark:brightness-150 dark:contrast-125 dark:saturate-150"
          >
            Scordo
          </Link>
          <div className="flex items-center gap-4">
            <Button onClick={handleDarkMode} className="primary-btn cursor-pointer rounded-full">
              {theme == "dark" ? <Moon /> : <Sun />}
            </Button>
            <Button type="button" className="primary-btn cursor-pointer rounded-full">
              <Bell className="text-3xl" />
            </Button>
            <NavbarDropdown data={user} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
