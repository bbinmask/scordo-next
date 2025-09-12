import { TeamType } from "@/generated/prisma";
import PlayerProps from "./player.props";
import UserProps from "./user.props";
export default interface TeamProps {
  id: string;
  name: string;
  description?: string;
  abbreviation: string;
  address: {
    city: string;
    state: string;
    country: string;
  } | null;
  owner: string | UserProps;
  players: UserProps[] | string[];
  banner: string | null;
  logo: string | null;
  captain: string | UserProps | null;
  type: TeamType;
  createdAt: Date | null;
  updatedAt: Date | null;
  isRecruiting: boolean;
  joinRequests: string[] | UserProps[];
}
