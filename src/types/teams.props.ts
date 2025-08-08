import PlayerProps from "./player.props";
import UserProps from "./user.props";
export default interface TeamProps {
  id: string;
  name: string;
  abbreviation: string;
  owner: UserProps;
  players: PlayerProps[];
}
