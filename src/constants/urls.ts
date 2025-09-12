export const baseURL = "http://localhost:3000";

export const TEAM_API = {
  all: "/teams",
  single: (username: string) => `/teams/${username}`,
  join: (abbr: string) => `/teams/join-request/${abbr}`,
};

export const teamLogos = [];
export const teamBanners = [];
export const heroImages = [
  "https://res.cloudinary.com/irfanulmadar/image/upload/v1757671381/hero_rqiked.png",
  "https://res.cloudinary.com/irfanulmadar/image/upload/v1757671382/hero1_tiyipi.png",
  "https://res.cloudinary.com/irfanulmadar/image/upload/v1757671381/hero2_ec8bzl.png",
];
export const defaultTeamLogo =
  "https://res.cloudinary.com/irfanulmadar/image/upload/v1757671380/default-team-banner_uomibg.jpg";
