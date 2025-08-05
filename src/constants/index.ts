export const user = {
  name: "Irfan Madar",
  isVerified: true,
  _id: "asldfkj",
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
  profile:
    "https://res.cloudinary.com/irfanulmadar/image/upload/v1748732410/avatar17_hnznuz.jpg",
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
