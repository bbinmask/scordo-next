import NotFoundParagraph from "@/components/NotFoundParagraph";
import Spinner from "@/components/Spinner";
import { Team, Tournament, User as UserProps } from "@/generated/prisma";
import { ArrowRight, LucideProps, Shield, Trophy, User, X } from "lucide-react";
import Link from "next/link";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface AfterSearchProps {
  results: {
    users: UserProps[];
    teams: Team[];
    tournaments: Tournament[];
  };
  query: string;
  isLoading: boolean;
  clearSearch: () => void;
}

interface SearchResultItemProps {
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  title: string;
  subtitle: string;
  href?: string;
}

const AfterSearch = ({ results, isLoading = true, query, clearSearch }: AfterSearchProps) => {
  const { tournaments, teams, users } = results;
  const totalResults = tournaments?.length + teams?.length + users?.length;

  console.log({ tournaments, teams, users });
  return (
    <div className="min-h-[400px] rounded-xl border border-white/20 bg-white/30 p-4 shadow-lg backdrop-blur-lg md:p-6 dark:bg-white/10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Results for "{query}" ({totalResults})
        </h2>
        <button
          onClick={clearSearch}
          className="flex items-center text-sm font-semibold text-gray-700 hover:text-green-500 dark:text-gray-300 dark:hover:text-green-400"
        >
          <X className="mr-1 h-4 w-4" />
          Clear
        </button>
      </div>
      {isLoading ? (
        <Spinner className="mx-auto" />
      ) : totalResults === 0 ? (
        <NotFoundParagraph
          description="
          No results found. Try Link different search term."
        />
      ) : (
        <div className="space-y-4">
          {users.length > 0 && (
            <div className="space-y-2">
              {users.map((user) => (
                <SearchResultItem
                  key={user.id}
                  icon={User}
                  title={user.name}
                  subtitle={user.bio || "Go to"}
                  href={`/users/${user.username}`}
                />
              ))}
            </div>
          )}

          {teams.length > 0 && (
            <div className="space-y-2">
              {teams.map((team) => (
                <SearchResultItem
                  key={team.id}
                  icon={Shield}
                  title={team.name}
                  subtitle={
                    team.address?.city ? `${team.address?.city} (${team.address.state})` : "Go to"
                  }
                  href={`/teams/${team.abbreviation}`}
                />
              ))}
            </div>
          )}

          {tournaments.length > 0 && (
            <div className="space-y-2">
              {tournaments.map((item) => (
                <SearchResultItem
                  key={item.id}
                  icon={Trophy}
                  title={item.title}
                  subtitle={`${item.startDate}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SearchResultItem = ({ icon: Icon, title, subtitle, href = "#" }: SearchResultItemProps) => (
  <Link
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex items-center rounded-lg p-3 transition-colors duration-200 hover:bg-white/20 dark:hover:bg-black/20"
  >
    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 dark:bg-black/20">
      <Icon className="h-5 w-5 text-yellow-500" />
    </div>
    <div>
      <p className="font-bold text-gray-900 dark:text-white">{title}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
    </div>
    <ArrowRight className="ml-auto h-5 w-5 text-gray-500 opacity-0 transition-opacity group-hover:opacity-100 dark:text-gray-400" />
  </Link>
);

export default AfterSearch;
