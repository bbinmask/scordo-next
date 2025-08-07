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

export function getTeamUrl(team: any): string {
  const { name, username } = team;
  const teamSlug = `${name.toLowerCase()}_&team_${username}`;

  return teamSlug.replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");
}
