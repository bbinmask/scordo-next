import PlayerProps from "@/types/player.props";
import TeamProps from "@/types/teams.props";
import UserProps from "@/types/user.props";

export const user = {
  name: "Irfan Madar",
  isVerified: true,
  id: "asldfkj",
  dob: new Date("2000-06-15"),
  username: "irfanulmadar",
  phone: "9876543210",
  email: "irfan@example.com",
  matches: [
    {
      runs: 45,
      catches: 2,
      wickets: 1,
      runOuts: 0,
      category: "T20",
      match: "64f09ad5b1234567890abcde", // example ObjectId
    },
  ],
  teams: ["64f09ad5b1234567890ab111", "64f09ad5b1234567890ab222"],
  friends: ["64f09ad5b1234567890ab333", "64f09ad5b1234567890ab444"],
  profile: "https://res.cloudinary.com/irfanulmadar/image/upload/v1748732410/avatar17_hnznuz.jpg",
  channels: ["64f09ad5b1234567890ab555"],
  stats: {
    totalRuns: 1030,
    totalWickets: 58,
    totalMatches: 65,
    totalCatches: 34,
  },
  tournaments: ["64f09ad5b1234567890ab666"],
  requests: {
    friendRequests: ["64f09ad5b1234567890ab777"],
    tournamentRequests: [
      {
        tournament: "64f09ad5b1234567890ab666",
        sender: "64f09ad5b1234567890ab777",
      },
    ],
    teamRequests: [
      {
        team: "64f09ad5b1234567890ab222",
        sender: "64f09ad5b1234567890ab777",
      },
    ],
  },

  socialLinks: {
    facebook: "https://facebook.com/irfanmadar",
    instagram: "https://instagram.com/irfan.madar",
    twitter: "https://twitter.com/irfanmadar",
    youtube: "https://youtube.com/@irfanmadar",
  },
  tags: ["all-rounder", "right-handed", "fast-bowler"],
  address: {
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
  },
  location: {
    type: "Point",
    coordinates: [77.5946, 12.9716], // Longitude, Latitude for Bengaluru
  },
};

const mockPlayers: PlayerProps[] = [
  {
    id: "p1",
    username: "playerOne",
    name: "Evelyn Carter",
    dob: "1995-04-10",
    role: "player",
    teams: [],
    avatar: "/avatars/playerOne.png",
    following: [],
    follwers: [],
    rank: "Gold",
  },
  {
    id: "p2",
    username: "playerTwo",
    name: "Marcus Wright",
    dob: "1997-09-22",
    role: "player",
    teams: [],
    avatar: "/avatars/playerTwo.png",
    following: [],
    follwers: [],
    rank: "Platinum",
  },
  {
    id: "p3",
    username: "playerThree",
    name: "Sophia Lee",
    dob: "1996-12-15",
    role: "player",
    teams: [],
    avatar: "/avatars/playerThree.png",
    following: [],
    follwers: [],
    rank: "Diamond",
  },
  {
    id: "p4",
    username: "playerFour",
    name: "Daniel Kim",
    dob: "1998-07-03",
    role: "player",
    teams: [],
    avatar: "/avatars/playerFour.png",
    following: [],
    follwers: [],
    rank: "Silver",
  },
];

const mockUsers: UserProps[] = [
  {
    id: "u1",
    username: "alice",
    name: "Alice Johnson",
    dob: "1995-05-12",
    role: "admin",
    teams: [],
    avatar: "/avatars/alice.png",
    following: ["u2", "u3"],
    follwers: ["u3", "u4"], // note: typo matches your interface
  },
  {
    id: "u2",
    username: "bob",
    name: "Bob Smith",
    dob: "1998-11-23",
    role: "player",
    teams: [],
    avatar: "/avatars/bob.png",
    following: ["u1"],
    follwers: ["u1", "u4"],
  },
  {
    id: "u3",
    username: "charlie",
    name: "Charlie Evans",
    dob: "1992-03-10",
    role: "fan",
    teams: [],
    avatar: "/avatars/charlie.png",
    following: ["u1", "u2"],
    follwers: ["u1"],
  },
  {
    id: "u4",
    username: "dave",
    name: "Dave Lee",
    dob: "2000-07-19",
    role: "player",
    teams: [],
    avatar: "/avatars/dave.png",
    following: [],
    follwers: ["u2", "u3"],
  },
];

export const mockTeams: TeamProps[] = [
  {
    id: "t1",
    name: "Corporate Titans",
    abbreviation: "CTN",
    owner: mockUsers[0],
    players: [mockPlayers[0], mockPlayers[1]],
    banner: "/images/banners/corporate-titans.jpg",
    logo: "/images/logos/corporate-titans.png",
    captain: mockUsers[0],
    type: "corporate",
    createdAt: new Date("2024-01-10T10:00:00Z"),
    updatedAt: new Date("2024-05-12T14:30:00Z"),
    isRecruiting: true,
    pendingRequests: ["p3", "p4"], // string array version
  },
  {
    id: "t2",
    name: "Campus Crushers",
    abbreviation: "CCS",
    owner: "u3", // string
    players: [mockPlayers[2], mockPlayers[3]],
    banner: "/images/banners/campus-crushers.jpg",
    logo: "/images/logos/campus-crushers.png",
    captain: mockUsers[2], // full object
    type: "college",
    createdAt: new Date("2023-09-05T08:15:00Z"),
    updatedAt: new Date("2024-06-01T09:45:00Z"),
    isRecruiting: false,
    pendingRequests: [mockPlayers[0], mockPlayers[1]], // PlayerProps[] version
  },
  {
    id: "t3",
    name: "Boardroom Ballers",
    abbreviation: "BBR",
    owner: mockUsers[1],
    players: [mockPlayers[1], mockPlayers[2]],
    banner: "/images/banners/boardroom-ballers.jpg",
    logo: "/images/logos/boardroom-ballers.png",
    captain: mockUsers[1],
    type: "corporate",
    createdAt: new Date("2022-11-20T15:20:00Z"),
    updatedAt: new Date("2024-03-11T16:50:00Z"),
    isRecruiting: true,
    pendingRequests: [], // empty
  },
  {
    id: "t4",
    name: "Scholarly Shooters",
    abbreviation: "SCH",
    owner: "u4",
    players: [mockPlayers[0], mockPlayers[3]],
    banner: "/images/banners/scholarly-shooters.jpg",
    logo: "/images/logos/scholarly-shooters.png",
    captain: mockPlayers[2],
    type: "college",
    createdAt: new Date("2023-02-14T12:00:00Z"),
    updatedAt: new Date("2024-07-18T13:25:00Z"),
    isRecruiting: false,
    pendingRequests: ["p2"], // single string in array
  },
];

export const mockTournaments = [
  {
    id: "tour-001",
    name: "Summer Cricket Bash",
    description: "Annual summer tournament for local clubs.",
    details: {
      season: 2024,
      maxTeams: 12,
      matchesPerTeam: 5,
      totalOvers: 20,
      minAge: 16,
      maxAge: 60,
      halfBoundary: true,
      location: "City Sports Ground",
    },
    teams: ["team-alpha", "team-beta"], // User and Friend 1 joined
    organizer: "user-001", // Organized by current user
    status: "ongoing",
    schedule: [],
    winner: null,
    runnerUp: null,
    stats: null,
  },
  {
    id: "tour-002",
    name: "Winter League Cup",
    description: "Competitive winter league.",
    details: {
      season: 2023,
      maxTeams: 8,
      matchesPerTeam: 3,
      totalOvers: 15,
      minAge: 18,
      maxAge: 55,
      halfBoundary: false,
      location: "North Park Arena",
    },
    teams: ["team-gamma"], // Friend 2 joined
    organizer: "user-004",
    status: "ongoing",
    schedule: [],
    winner: null,
    runnerUp: null,
    stats: null,
  },
  {
    id: "tour-003",
    name: "Spring Friendly Series",
    description: "Casual friendly matches.",
    details: {
      season: 2025,
      maxTeams: 16,
      matchesPerTeam: 4,
      totalOvers: 10,
      minAge: 10,
      maxAge: 80,
      halfBoundary: true,
      location: "Suburb Fields",
    },
    teams: ["team-delta"],
    organizer: "user-005",
    status: "scheduled",
    schedule: [],
    winner: null,
    runnerUp: null,
    stats: null,
  },
  {
    id: "tour-004",
    name: "Champions Challenge",
    description: "Elite teams compete for the title.",
    details: {
      season: 2024,
      maxTeams: 4,
      matchesPerTeam: 2,
      totalOvers: 25,
      minAge: 20,
      maxAge: 45,
      halfBoundary: false,
      location: "National Stadium",
    },
    teams: [],
    organizer: "user-006",
    status: "ongoing",
    schedule: [],
    winner: null,
    runnerUp: null,
    stats: null,
  },
  {
    id: "tour-005",
    name: "Youth Summer Camp",
    description: "Training and games for young players.",
    details: {
      season: 2024,
      maxTeams: 10,
      matchesPerTeam: 6,
      totalOvers: 12,
      minAge: 8,
      maxAge: 14,
      halfBoundary: true,
      location: "Community Center",
    },
    teams: ["team-alpha"], // User joined
    organizer: "user-001",
    status: "completed",
    schedule: [],
    winner: "team-alpha",
    runnerUp: null,
    stats: null,
  },
];

export const getAllTeams = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Object.values(mockTeams));
    }, 300);
  });
};

export let mockMatchesDb: any = [];

export const mockCreateMatch = async (matchData: any) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Basic validation for mock
      if (
        !matchData.teamA ||
        !matchData.teamB ||
        !matchData.overs ||
        !matchData.tossWinner ||
        !matchData.tossDecision ||
        !matchData.startTime
      ) {
        return reject({
          message: "Missing required fields for match creation.",
        });
      }

      const newMatch = {
        id: `match-${Date.now()}`,
        ...matchData,
        status: "not_started", // Default status upon creation
        innings: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockMatchesDb.push(newMatch);
      resolve(newMatch);
    }, 500);
  });
};

export const _socketServer: any = {
  listeners: {},
  emit: (event: any, data: any) => {
    Object.values(_socketServer.listeners).forEach((cb: any) => {
      if (cb.event === event) {
        cb.callback(data);
      }
    });
  },
  on: (event: any, callback: any) => {
    const listenerId = `listener-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    _socketServer.listeners[listenerId] = { event, callback };
    return () => {
      // Return an unsubscribe function
      delete _socketServer.listeners[listenerId];
    };
  },
};

// Mock API calls
export const getMatchDetails = async (matchId: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const match = mockMatchesDb[matchId];
      if (match) {
        resolve(JSON.parse(JSON.stringify(match))); // Return a deep copy
      } else {
        reject(new Error("Match not found."));
      }
    }, 300);
  });
};

export const saveBallToDatabase = async (matchId: string, inningIndex: any, ballData: any) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const match = mockMatchesDb[matchId];
      if (!match) {
        return reject(new Error("Match not found for ball update."));
      }
      const inning = match.innings[inningIndex];
      if (!inning) {
        return reject(new Error("Inning not found for ball update."));
      }

      // Update inning totals
      inning.balls.push(ballData);
      inning.totalRuns += ballData.runs + (ballData.extra?.runs || 0);
      if (ballData.wicket && ballData.wicket.isWicket) {
        inning.totalWickets += 1;
      }

      // Calculate overs (X.Y format)
      const totalBalls = inning.balls.length;
      inning.overs = Math.floor(totalBalls / 6) + (totalBalls % 6) / 10;
      inning.overs = parseFloat(inning.overs.toFixed(1)); // Format to X.Y

      // Simulate Socket.IO broadcast of the updated match state
      _socketServer.emit("match_update", JSON.parse(JSON.stringify(match)));

      resolve(JSON.parse(JSON.stringify(match)));
    }, 100); // Simulate very quick DB update
  });
};

export const mockUsers2 = [
  { id: "user-player-1", name: "Virat Kohli" },
  { id: "user-player-2", name: "Rohit Sharma" },
  { id: "user-player-3", name: "Jasprit Bumrah" },
  { id: "user-player-4", name: "MS Dhoni" },
  { id: "user-player-5", name: "Glenn Maxwell" },
  { id: "user-player-6", name: "Pat Cummins" },
  { id: "user-player-7", name: "Steve Smith" },
  { id: "user-player-8", name: "David Warner" },
];

export const dummyMatches = [
  {
    teamA: "Royal Challengers Bangaluru",
    teamB: "Chennai Super Kings",
    teamAPlayingXI: [
      "Virat Kohli",
      "Faf du Plessis",
      "Glenn Maxwell",
      "Dinesh Karthik",
      "Rajat Patidar",
      "Mahipal Lomror",
      "Wanindu Hasaranga",
      "Harshal Patel",
      "Josh Hazlewood",
      "Mohammed Siraj",
      "Shahbaz Ahmed",
    ],
    teamBPlayingXI: [
      "Ruturaj Gaikwad",
      "Devon Conway",
      "Moeen Ali",
      "Ben Stokes",
      "MS Dhoni",
      "Ravindra Jadeja",
      "Shivam Dube",
      "Deepak Chahar",
      "Maheesh Theekshana",
      "Mukesh Choudhary",
      "Tushar Deshpande",
    ],
    uid: "19234kaslfh2139",
    overs: 20,
    status: "completed",
    venue: "M. Chinnaswamy Stadium, Bengaluru",
    tossWinner: "Royal Challengers Bangaluru",
    tossDecision: "bat",
    highlights: [
      {
        time: new Date("2025-05-10T19:30:00Z"),
        title: "Kohli hits a stunning six",
        description: "Virat Kohli smashes a 95m six over long-on.",
        videoUrl: "https://example.com/video/kohli_six",
      },
    ],
    category: "T20",
    umpires: ["Nitin Menon", "Kumar Dharmasena"],
    matchReferee: "Javagal Srinath",
    startTime: new Date("2025-05-10T19:00:00Z"),
    endTime: new Date("2025-05-10T22:30:00Z"),
    innings: [
      {
        battingTeam: "Royal Challengers Bangaluru",
        bowlingTeam: "Chennai Super Kings",
        totalRuns: 182,
        totalWickets: 6,
        overs: 20,
        balls: [],
        inningNumber: 1,
        status: "completed",
      },
      {
        battingTeam: "Chennai Super Kings",
        bowlingTeam: "Royal Challengers Bangaluru",
        totalRuns: 178,
        totalWickets: 8,
        overs: 20,
        balls: [],
        inningNumber: 2,
        status: "completed",
      },
    ],
  },
];

export const playerStats = {
  matchesPlayed: 15,
  runsScored: 750,
  wicketsTaken: 8,
  fifties: 5,
  hundreds: 1,
  strikeRate: 145.7,
  average: 50.0,
  bestBowling: "4/25",
  catches: 12,
};

export const teamStats = {
  matchesPlayed: 20,
  matchesWon: 14,
  matchesLost: 5,
  matchesTied: 1,
  winRate: "70%",
  totalRunsScored: 2500,
  totalWicketsTaken: 120,
  averageScore: 125,
  highestScore: 210,
};
