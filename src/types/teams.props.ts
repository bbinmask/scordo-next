import PlayerProps from "./player.props";
import UserProps from "./user.props";
export default interface TeamProps {
  id: string;
  name: string;
  abbreviation: string;
  owner: string | UserProps;
  players: PlayerProps[];
  banner: string;
  logo: string;
  captain: string | UserProps;
  type: "corporate" | "college";
  createdAt: Date;
  updatedAt: Date;
  isRecruiting: boolean;
  pendingRequests: string[] | PlayerProps[];
}
