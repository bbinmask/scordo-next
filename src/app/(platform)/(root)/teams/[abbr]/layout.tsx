import { ReactNode } from "react";

export async function generateMetadata() {
  return {
    title: "Team Details",
    description: `View team's detailed profile, stats, and activity.`,
    openGraph: {
      title: "Team Profile",
      description: `Explore team's achievements and info.`,
    },
  };
}

const TeamIdLayout = async ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default TeamIdLayout;
