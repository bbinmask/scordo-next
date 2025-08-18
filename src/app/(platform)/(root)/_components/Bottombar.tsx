"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, PlusCircle, Trophy, User, Settings } from "lucide-react";

const Bottombar = () => {
  const pathname = usePathname();

  const navLinks = [
    {
      title: "Home",
      icon: Home,
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
    <div className="primary-background fixed bottom-0 left-0 z-[999] flex h-[84px] w-full justify-center rounded-t-lg shadow-lg transition-all">
      <ul className="m-0 grid w-full grid-cols-5 gap-1 rounded-t-2xl px-2 py-1 shadow-lg shadow-black md:grid-cols-6">
        {navLinks.map((item, i) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <li className={`${item.className}`} key={i}>
              <Link
                className={`center flex flex-col rounded-md px-2 py-1 font-[urbanist] text-stone-900 shadow-black transition-all duration-300 ease-linear hover:translate-y-0 hover:gap-1 hover:bg-emerald-600 hover:text-lime-300 hover:shadow-md hover:brightness-125 dark:text-gray-50 dark:hover:bg-emerald-800 ${isActive ? "translate-y-0 gap-1 bg-emerald-500 shadow-md" : "translate-y-6 gap-8"}`}
                href={item.path}
              >
                {/* <a
                  href="#"
                  className="flex flex-col items-center rounded-lg p-2 text-sm font-semibold text-white "
                >
                  Dashboard
                </a> */}
                {Icon && (
                  // <div className="bg-blue-600">
                  <Icon size={28} className={`${isActive && "text-lime-300 dark:text-white"}`} />
                  // </div>
                )}
                <span
                  className={`overflow-x-hidden ${isActive ? "font-black text-lime-300 dark:text-gray-50" : "font-semibold"} font-[urbanist] text-base tracking-normal drop-shadow-2xl md:text-sm`}
                >
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
