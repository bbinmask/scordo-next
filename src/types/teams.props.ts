import PlayerProps from "./player.props";
import UserProps from "./user.props";
export default interface TeamProps {
  id: string;
  name: string;
  description?: string;
  abbreviation: string;
  owner: string | UserProps;
  players: PlayerProps[];
  banner: string;
  logo: string;
  captain: string | UserProps;
  teamType: "local" | "club" | "college" | "corporate" | "others";
  createdAt: Date;
  updatedAt: Date;
  isRecruiting: boolean;
  pendingRequests: string[] | PlayerProps[];
}
