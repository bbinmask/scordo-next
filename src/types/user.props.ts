import TeamProps from "./teams.props";

export default interface UserProps {
  id: string;
  username: string;
  name: string;
  dob: string;
  email: string;
  contact: string;
  role: "fan" | "player" | "admin";
  teams: TeamProps[];
  avatar: string;
  following: string[];
  follwers: string[];
}
