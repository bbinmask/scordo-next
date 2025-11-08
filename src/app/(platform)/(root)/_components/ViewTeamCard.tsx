import { Team } from "@/generated/prisma";
import { TeamForListComponent } from "@/lib/types";
import { ArrowRight, MapPin, Users } from "lucide-react";
import Link from "next/link";

interface ViewTeamCardProps {
  team: TeamForListComponent;
}

export function ViewTeamCard({ team }: ViewTeamCardProps) {
  return (
    <Link
      href={`/teams/${team.abbreviation}`}
      className="group container-bg border-input transform cursor-pointer overflow-hidden rounded-lg border transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Card Content */}
      <div className="p-5">
        <div className="flex items-center space-x-4">
          {/* Team Logo */}
          <div className="flex-shrink-0">
            <img
              src={team?.logo || "/team.svg"}
              alt={`${team.name} logo`}
              className="border-input h-20 w-20 rounded-full border-2"
              onError={(e) =>
                (e.currentTarget.src = "https://placehold.co/100x100/CCCCCC/FFFFFF?text=T")
              }
            />
          </div>
          {/* Team Name */}
          <div className="min-w-0 flex-1">
            <h3
              title={team.name}
              className="primary-text truncate font-[cal_sans] text-xl font-bold tracking-wide"
            >
              {team.name}
            </h3>
            <p className="secondary-text font-[urbanist] text-sm tracking-wide">
              @{team.abbreviation}
            </p>
          </div>
        </div>

        {/* Team Info */}
        <div className="mt-4 space-y-2">
          {team.address && (
            <div className="secondary-text flex items-center font-[urbanist] text-sm font-semibold">
              <MapPin size={16} className="mr-2 text-green-600" />
              <span>
                {team?.address?.city} {team?.address?.state}
              </span>
            </div>
          )}
          {(team?._count?.players !== undefined || team?._count?.players !== null) && (
            <div className="secondary-text flex items-center font-[urbanist] text-sm font-semibold">
              <Users size={16} className="mr-2 text-green-600" />
              <span>{team?._count?.players} Players</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between p-4 font-[inter] text-sm font-semibold text-green-600">
        <span>View Team</span>
        <ArrowRight
          size={16}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}
