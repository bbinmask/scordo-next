import TeamProps from "./teams.props";

export default interface UserProps {
  id: string;
  username: string;
  name: string;
  dob: string;
  role: "fan" | "player" | "admin";
  teams: TeamProps[];
  avatar: string;
  following: string[];
  follwers: string[];
}
