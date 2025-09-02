import TeamProps from "./teams.props";

export default interface UserProps {
  id: string;
  clerkId: string;
  name: string;
  username: string;
  email: string;
  contact: string;
  gender: "male" | "female" | "other";
  role: "player" | "fan" | "admin";
  dob: Date;
  availability: "available" | "injured" | "on_break";
  avatar: string;
  isVerified: boolean;
  bio: string;
  friends: string[] | UserProps[];
  friendsOf: string[] | UserProps[];
  address?: {
    city: string;
    state: string;
    country: string;
  };
  createdAt: Date;
  updatedAt: Date;
  teams: string[] | TeamProps[];
}
