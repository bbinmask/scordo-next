declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        // add other user properties if needed
      };
    }
  }
}

interface IExtra {
  type: "wide" | "no_ball" | "bye" | "leg_bye" | null;
  runs: number;
}

interface IWicket {
  isWicket: boolean;
  type: "bowled" | "caught" | "run_out" | "lbw" | "stumped" | undefined;
  playerOut: string | null;
  fielder?: string | null; // optional, for caught or run out
  assistedBy?: string[]; // optional, for run out assists
}

export interface IBall {
  ballNumber: number; // for internal ordering (e.g., 1, 2, 3... not 1.1)
  batsman: string;
  bowler: string;
  runs: number;
  extra: IExtra;
  wicket: IWicket;
  timestamp: Date;
}

export interface IInning {
  battingTeam: string;
  bowlingTeam: string;
  totalRuns: number;
  totalWickets: number;
  overs: number;
  balls: [];
  inningNumber: number;
  status: "active" | "completed" | "declared" | "forfeited" | "pending";
}

export interface IMatch {
  teamA: string;
  teamB: string;
  teamAPlayingXI: string[];
  teamBPlayingXI: string[];
  overs: number;
  status: string;
  venue: {
    city: string;
    state: string;
    country: string;
  };
  uid: string;
  tossWinner?: string;
  tossDecision?: string;
  highlights: [
    {
      time: Date;
      title: string;
      description: string;
      videoUrl: string;
    },
  ];
  location: {
    type: string;
    coordinates: Number;
  };
  category: "T10" | "T20" | "ODI" | "Test" | "others";
  umpires?: string[];
  matchReferee?: string;
  innings: IInning[];
  startTime?: Date;
  endTime?: Date;
}

interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
}

interface KYC {
  aadhaarNumber?: string;
  documentUrl?: string;
  verified: boolean;
}

interface NotificationPreferences {
  inApp: boolean;
  email: boolean;
}

export interface IBattingStats {
  matches: number;
  innings: number;
  runs: number;
  highestScore: number;
  average: number;
  strikeRate: number;
  ballsFaced: number;
  notOuts: number;
  fours: number;
  sixes: number;
}
export interface IBowlingStats {
  matches: number;
  innings: number;
  wickets: number;
  bestFigures: string; // e.g. "5/24"
  average: number;
  economy: number;
  strikeRate: number;
  overs: number;
  maidens: number;
  runsConceded: number;
}
export interface IFieldingStats {
  matches: number;
  catches: number;
  stumpings: number;
  runOuts: number;
}

export interface IUserStats {
  batting: IBattingStats;
  bowling: IBowlingStats;
  fielding: IFieldingStats;
  matchesPlayed: number;
  totalRuns: number;
  highestScore: number;
  average: number;
  strikeRate: number;
  ballsFaced: number;
  fours: number;
  sixes: number;
  playerOfTheMatch: number;
  recentForm: string[];
  totalWickets: number;
  bestBowling: string;
  economy: number;
  bowlingAverage: number;
  oversBowled: number;
  runsConceded: number;
  catches: number;
  runOuts: number;
}

export interface IUser {
  name: string;
  _id: string;
  email: string;
  isVerified?: boolean;
  requests: {
    friendRuquests: string[];
    tournamentRequests: [
      {
        request: string | any;
        sender: string | any;
      },
    ];
    teamRequests: [
      {
        team: string;
        sender: string | IUser;
      },
    ];
  };
  role: "player" | "fan" | "admin";
  availability: "available" | "injured" | "on_break";
  gender: "male" | "female" | "other";
  bio: string;
  username: string;
  phone: string;
  matches: [
    {
      runs: number;
      catches: number;
      wickets: number;
      runOuts: number;
      category: "T10" | "T20" | "ODI" | "Test" | "others";
      match: string;
    },
  ];

  teams: string[];
  friends: string[];
  password: string;
  profile: string;
  channels: string[];
  dob: Date;
  location: {
    type: string;
    coordinates: Number;
  };
  address: { city: string; state: string; country: string };
  stats: string;
  notifications: string[];
  tournaments: string[];
  refreshToken?: string;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
  isPasswordMatched: (password: string) => Promise<boolean>;

  //

  authProvider?: "email" | "google" | "facebook" | "github";
  providerId?: string;

  isBanned: boolean;
  isOnline: boolean;
  lastLoginAt?: Date;

  points: number;
  reputation: number;

  referralCode?: string;
  referredBy?: string;

  kyc?: KYC;
  notificationPreferences: NotificationPreferences;

  socialLinks?: SocialLinks;
  tags: string[];
}

export interface ITeamStats {
  team: string;

  matchesPlayed: number;
  wins: number;
  losses: number;
  ties: number;
  noResults: number;

  totalRunsScored: number;
  totalWicketsTaken: number;
  totalOversBowled: number;
  totalExtras: number;

  runRate: number;
  winPercentage: number;

  recentForm: ("W" | "L" | "T" | "NR")[];

  longestWinningStreak: number;
  currentStreak: {
    type: "win" | "loss" | "tie" | "nr" | null;
    length: number;
  };
}

export interface ITeam {
  name: string;
  logo: string;
  banner: string;
  username: string;
  players: string[];
  _id: string;
  captain: string;
  owner: IUser;
  address: {
    city: string;
    state: string;
    country: string;
  };
  follower: string[];
  following: string[];
  teamType: "local" | "club" | "college" | "corporate" | "others";
  location: {
    city: string;
    state: string;
    country: string;
    type: string;
    coordinates: Number;
  };
  joinRequests: string[];
  isRecruiting: boolean;
  stats: string;
  matchHistory: string[];
}

interface IApplication {
  user: string;
  tournament: string;
  status: "pending" | "accepted" | "rejected";
  reason?: String;
}

export interface ITournament {
  name: string;
  details: {
    season: number;
    maxTeams: number;
    matchesPerTeam: number;
    totalOvers: number;
    minAge: number;
    maxAge: number;
    winnerPrice: number;
    runnerUpPrice: number;
    entryFee: number;
    halfBoundary: boolean;
    location: string;
  };
  sponsors: [
    {
      name: string;
      title: string;
      description: string;
      banner: string;
      logo: string;
      website: string;
    },
  ];
  rules: string[];
  requests: string[];
  requested: string[];
  uid: string;
  teams: string[];
  location: {
    city: string;
    state: string;
    country: string;
    type: string;
    coordinates: Number;
  };
  description: string;
  organizer: string;
  status: "scheduled" | "ongoing" | "completed";
  schedule: [
    {
      match: string;
      date: Date;
      status: "scheduled" | "completed";
    },
  ];

  winningMargin: Number;
  winningTeam: string;
  applications: IApplication;
  stats: string;
}

export interface INotification {
  recipient: string;
  sender: string; // optional
  type: string; // e.g., 'team-request', 'tournament-invite'
  message: string;
  data: object; // optional payload (like teamId, etc.)
  read: boolean;
  isActionable: boolean; // Whether user can respond (e.g., accept/reject)
  actionType: "join_request" | "invite_response" | "info" | "reminder";
  redirectUrl: string; // e.g. /teams/:id
}
