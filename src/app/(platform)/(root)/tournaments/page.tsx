"use client";

import { LinkIcon, LucideIcon, PlusCircle, Search, User, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const navLinks = [
  {
    icon: User,
    title: "My Tournaments",
    description: "View and manage all tournaments you've created or joined.",
    path: "/tournaments/my",
  },
  {
    icon: Users,
    title: "Friend's Tournaments",
    description: "See tournaments your friends are involved in and join the fun.",
    path: "/tournaments/friends",
  },
  {
    icon: LinkIcon,
    title: "Explore All",
    description: "Browse all public tournaments available on Scordo.",
    path: "/tournaments/explore",
  },
];

const NavLinkCard = ({
  icon,
  title,
  description,
  link,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  link: string;
}) => {
  const IconComponent = icon;
  return (
    <Link
      href={link}
      className="container-bg border-input group flex transform cursor-pointer flex-col items-center rounded-2xl border p-6 shadow-sm"
    >
      <div className="mb-4 rounded-full bg-blue-50 p-4 text-green-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-100">
        {IconComponent && <IconComponent className="h-8 w-8" />}
      </div>
      <h3 className="primary-text mb-4 font-[cal_sans] text-xl transition-colors duration-300 group-hover:text-green-500">
        {title}
      </h3>
      <p className="secondary-text text-center font-[poppins] text-[12px] tracking-wide">
        {description}
      </p>
    </Link>
  );
};

const TournamentPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useRouter();

  const handleSearchChange = (event: any) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event: any) => {
    event.preventDefault();
    // In a real application, you would trigger a search API call here
    // You could also navigate to a search results page
    // window.location.href = `/tournaments/search?q=${searchQuery}`;
    // For this demo, we'll just log it.
  };

  const navigateTo = (path: string) => {
    if (path) navigate.push(path);
    else navigate.push("/tournaments");
  };

  return (
    <div className="container-bg center flex rounded-xl p-6 md:p-10">
      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl p-8 md:p-12">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h1 className="mb-4 font-[cal_sans] text-5xl leading-tight font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
            Discover & Organize Tournaments
          </h1>
          <p className="secondary-text mx-auto max-w-2xl font-[urbanist] text-lg dark:text-gray-300">
            Dive into the world of competitive gaming. Explore, create, or join tournaments
            effortlessly.
          </p>
        </div>

        {/* Search Bar Section */}
        <form onSubmit={handleSearchSubmit} className="mx-auto mb-10 w-full max-w-2xl">
          <div className="relative flex items-center font-[urbanist]">
            <Search className="absolute left-4 h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search for tournaments by name or ID..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="secondary-text border-input w-full rounded-xl border py-3 pr-4 pl-14 text-lg shadow-sm transition-all duration-200 outline-none focus:ring-1 focus:ring-gray-400"
            />
            <button
              type="submit"
              className="font-urbanist absolute right-2 rounded-lg bg-blue-600 px-4 py-2 text-base text-white transition-all duration-200 hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </form>

        {/* Navigation Cards */}
        <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {navLinks.map((item, i) => (
            <NavLinkCard
              key={i}
              icon={item.icon}
              title={item.title}
              description={item.description}
              link={item.path}
            />
          ))}
        </div>

        {/* Create Tournament Button */}
        <div className="mt-10 text-center">
          <Link
            href={"/tournaments/create"}
            className="inline-flex transform items-center justify-center rounded-2xl bg-gradient-to-r from-green-500 to-teal-600 px-6 py-4 font-[urbanist] text-lg text-white shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl focus:ring-4 focus:ring-green-300 focus:ring-offset-2 focus:outline-none active:translate-y-0"
          >
            <PlusCircle className="mr-1 h-6 w-6" />
            Create New Tournament
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TournamentPage;
