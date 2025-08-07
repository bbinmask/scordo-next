export function shortenTeamName(name: string): string {
  const knownAbbreviations: Record<string, string> = {
    "Royal Challengers Bangalore": "RCB",
    "Royal Challengers Bangaluru": "RCB",
    "Chennai Super Kings": "CSK",
    "Mumbai Indians": "MI",
    "Kolkata Knight Riders": "KKR",
    "Delhi Capitals": "DC",
    "Punjab Kings": "PBKS",
    "Sunrisers Hyderabad": "SRH",
    "Lucknow Super Giants": "LSG",
    "Gujarat Titans": "GT",
  };

  if (knownAbbreviations[name]) return knownAbbreviations[name];

  if (!name.trim().includes(" ") || (name.length <= 6 && name.length >= 4))
    return name.slice(0, 3).toUpperCase();
  else
    return name
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join("");
}
