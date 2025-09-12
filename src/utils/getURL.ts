import { Team } from "@/generated/prisma";
import TeamProps from "@/types/teams.props";

export function getMatchUrl(teamA: string, teamB: string, date: Date, uuid: string): string {
  return "url";
  const formatName = (name: string) =>
    name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");

  const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD
  return `${formatName(teamA)}-vs-${formatName(teamB)}-${formattedDate}_${uuid}`;
}

export function getTeamUrl(team: Team): string {
  const { name, abbreviation } = team;

  const slugify = (str: string) =>
    str
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  return `${slugify(name)}-team-${slugify(abbreviation)}`;
}
