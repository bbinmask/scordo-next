import PlayerProps from "./player.props";
import UserProps from "./user.props";
export default interface TeamProps {
  id: string;
  name: string;
  description?: string;
  abbreviation: string;
  address?: {
    city: string;
    state: string;
    country: string;
  };
  owner: string | UserProps;
  players: UserProps[] | string[];
  banner: string;
  logo: string;
  captain: string | UserProps;
  team: "local" | "club" | "college" | "corporate" | "others";
  createdAt: Date;
  updatedAt: Date;
  isRecruiting: boolean;
  joinRequests: string[] | UserProps[];
}
