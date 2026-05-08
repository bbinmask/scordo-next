export const queryKeys = {
  matches: {
    all: ["matches"] as const,
    myMatches: ["my-matches"] as const,
    officials: ["my-official-matches"] as const,
    single: (id: string) => ["match", id] as const,
    target: (id: string) => ["match-target", id] as const,
    currentOver: (id: string) => ["current-over", id] as const,
  },
  users: {
    battingStats: (id: string) => ["batting-stats", id] as const,
    bowlingStats: (id: string) => ["bowling-stats", id] as const,
  },
  teams: {
    all: ["teams"] as const,
    single: (abbr: string) => ["team", abbr] as const,
  },
} as const;
