import UserProps from "./user.props";

export default interface PlayerProps extends UserProps {
  rank: "Gold" | "Platinum" | "Silver" | "Diamond";
}
