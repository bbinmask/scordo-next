import { heroImages } from "@/constants/urls";
import TeamProps from "@/types/teams.props";
import { PlayCircle } from "lucide-react";
import Link from "next/link";

const TeamCard = ({ team }: { team: TeamProps }) => {
  const video = {
    title: "This is my title",
    thumbnail: heroImages[2],
    duration: 20.5,
  };
  return (
    <>
      <Link
        href={`/teams/${team.id}`}
        className="dark:via-main dark:to-main my-2 flex w-full transform cursor-pointer gap-2 rounded-lg border border-lime-300 bg-gradient-to-br from-lime-50 to-green-100 p-4 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg dark:border-emerald-600 dark:from-green-700"
      >
        <div className="relative aspect-square max-w-20 overflow-hidden rounded-full border border-lime-400 bg-white p-2 shadow-lg transition-shadow duration-300">
          <img src={team.logo} alt={video.title} className="object-cover" />
        </div>
        <div className="w-full">
          <h3 className="text-xl font-bold text-green-800 dark:text-lime-300">{team.name}</h3>
          <p className="mb-3 line-clamp-2 text-sm text-gray-700 dark:text-gray-300">
            {team.description}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <p>
              <span className="font-semibold">Players:</span> {team.players.length}
            </p>
            <p>
              <span className="font-semibold">Matches:</span> {12}
            </p>
          </div>
        </div>
      </Link>
    </>
  );
};

export default TeamCard;
