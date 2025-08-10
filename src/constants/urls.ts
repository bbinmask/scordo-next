export const baseURL = "http://localhost:3000";

export const TEAM_API = {
  all: "/teams",
  single: (username: string) => `/teams/${username}`,
  join: (abbr: string) => `/teams/join-request/${abbr}`,
};
