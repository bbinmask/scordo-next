import { OfficialRole } from "@/generated/prisma";

export type MatchOfficial = {
  name: string;
  role: OfficialRole;
  userId: string;
};
