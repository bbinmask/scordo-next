import { getMetadata } from "@/utils/helper/getMetadata";
import { ReactNode } from "react";

export const metadata = getMetadata("Teams | Scordo");
const TeamIdLayout = async ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default TeamIdLayout;
