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
    <div className="bg-main fixed bottom-0 left-0 flex h-[84px] w-full justify-center">
      <ul className="m-0 grid w-full max-w-6xl grid-cols-5 gap-1 px-2 py-1 md:grid-cols-6">
        {navLinks.map((item, i) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <li className={`${item.className}`} key={i}>
              <Link
                className={`center hover:bg-hover flex flex-col rounded-md px-2 py-1 font-[urbanist] text-stone-900 shadow-black transition-all duration-500 ease-in-out hover:translate-y-0 hover:gap-1 hover:shadow-md ${isActive ? "bg-active translate-y-0 gap-1 shadow-md" : "translate-y-6 gap-8"}`}
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
