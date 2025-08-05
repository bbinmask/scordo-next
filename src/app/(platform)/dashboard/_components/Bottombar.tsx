"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, Users, PlusCircle, Trophy, User, Settings } from "lucide-react";

const Bottombar = () => {
  const pathname = usePathname();

  const navLinks = [
    {
      title: "Home",
      icon: HomeIcon,
      path: "/dashboard",
      className: "",
    },
    {
      title: "Teams",
      icon: Users,
      path: "/teams",
      className: "",
    },
    {
      title: "Match",
      icon: PlusCircle,
      path: "/matches",
      className: "",
    },
    {
      title: "Profile",
      icon: User,
      path: "/profile",
      className: "hidden md:block",
    },
    {
      title: "Tournament",
      icon: Trophy,
      path: "/tournaments",
      className: "",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/settings",
      className: "",
    },
  ];

  return (
    <div className="bg-main/90 fixed bottom-0 left-0 flex h-[84px] w-full justify-center">
      <ul className="m-0 grid w-full max-w-6xl grid-cols-5 gap-1 px-2 py-1 md:grid-cols-6">
        {navLinks.map((item, i) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <li className={`${item.className}`} key={i}>
              <Link
                className={`center flex flex-col rounded-md px-2 py-1 shadow-black transition-all duration-500 ease-in-out hover:translate-y-0 hover:gap-1 hover:bg-white hover:shadow-md ${isActive ? "translate-y-0 gap-1 bg-white shadow-md" : "translate-y-6 gap-8 group-hover:bg-emerald-500/90"}`}
                href={item.path}
              >
                {Icon && <Icon size={28} className="" />}
                <span className={`overflow-x-hidden font-[poppins] text-sm font-semibold`}>
                  {item.title}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Bottombar;
