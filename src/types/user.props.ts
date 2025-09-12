import { Availability, Gender, Role } from "@/generated/prisma";
import TeamProps from "./teams.props";

export default interface UserProps {
  id: string;
  clerkId: string;
  name: string;
  username: string;
  email: string;
  contact: string;
  gender: Gender;
  role: Role;
  dob: Date;
  availability: Availability;
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
