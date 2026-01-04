export interface ITeamForm {
  name: string;
  type: "local" | "college" | "club" | "corporate" | "others";
  abbreviation: string;
  address: {
    city: string;
    state: string;
    country: string;
  };
}
