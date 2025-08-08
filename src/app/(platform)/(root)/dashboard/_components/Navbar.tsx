import { Bell, ChartNoAxesColumn, Sword } from "lucide-react";
import { Group, GroupIcon, Home, Menu, Trophy } from "lucide-react";
import Link from "next/link";
import { user } from "@/constants";
import NavbarDropdown from "./NavbarDropdown";

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
  return (
    <div className="bg-main fixed top-0 z-[999] grid min-h-16 w-full items-center px-2 py-2">
      <div className="flex w-full items-center">
        <div className="flex w-full items-center justify-between">
          <Link href={"/"} className="mx-2 font-[poppins] text-3xl font-bold text-white">
            Scordo
          </Link>
          <div className="flex items-center gap-4">
            <button type="button" className="btn border-none">
              <Bell color="white" className="text-3xl" />
            </button>
            <NavbarDropdown data={user} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
