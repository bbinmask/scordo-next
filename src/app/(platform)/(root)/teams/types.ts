export interface ITeamForm {
  name: string;
  logo: FileList;
  banner: FileList;
  type: "local" | "college" | "club" | "corporate" | "others";
  abbreviation: string;
  address: {
    city: string;
    state: string;
    country: string;
  };
  isRecruiting: boolean;
}
