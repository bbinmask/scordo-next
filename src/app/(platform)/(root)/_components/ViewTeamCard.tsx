import { Team } from "@/generated/prisma";
import { ArrowRight, MapPin, Users } from "lucide-react";
import Link from "next/link";

interface ViewTeamCardProps {
  team: Team;
}

export function ViewTeamCard({ team }: ViewTeamCardProps) {
  return (
    <Link
      href={`/teams/${team.id}`}
      className="group transform cursor-pointer overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Card Banner */}
      <div className="relative h-32 bg-gray-200">
        <img
          src={team?.banner || undefined}
          alt={`${team.name} banner`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) =>
            (e.currentTarget.src = "https://placehold.co/400x200/667EEA/FFFFFF?text=Team+Banner")
          }
        />
        {/* Overlay effect */}
        <div className="absolute inset-0 bg-black opacity-10 transition-opacity group-hover:opacity-20"></div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        <div className="flex items-center space-x-4">
          {/* Team Logo */}
          <div className="flex-shrink-0">
            <img
              src={team?.logo || undefined}
              alt={`${team.name} logo`}
              className="-mt-16 h-20 w-20 rounded-full border-4 border-white shadow-md"
              onError={(e) =>
                (e.currentTarget.src = "https://placehold.co/100x100/CCCCCC/FFFFFF?text=T")
              }
            />
          </div>
          {/* Team Name */}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-xl font-bold text-gray-800 transition-colors group-hover:text-blue-600">
              {team.name}
            </h3>
            <p className="text-sm text-gray-500">@{team.abbreviation}</p>
          </div>
        </div>

        {/* Team Info */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin size={16} className="mr-2 text-gray-400" />
            <span>
              {team?.address?.city}, {team?.address?.state}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users size={16} className="mr-2 text-gray-400" />
            <span>{team?.players?.length || 10} Players</span>
          </div>
        </div>
      </div>

      {/* Card Footer (View Link) */}
      <div className="border-t border-gray-100 bg-gray-50 p-4">
        <div className="flex items-center justify-between text-sm font-semibold text-blue-600">
          <span>View Team</span>
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}
