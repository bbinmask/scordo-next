import { getMetadata } from "@/utils/helper/getMetadata";
import { Metadata } from "next";
import { ReactNode } from "react";

export async function generateMetadata({
  params,
}: {
  params: { abbr: string };
}): Promise<Metadata> {
  const { abbr } = await params;

  return {
    title: `${abbr} Details`.toUpperCase(),
    description: `View ${abbr}'s detailed profile, stats, and activity.`,
    openGraph: {
      title: `${abbr}'s Profile`,
      description: `Explore ${abbr}'s achievements and info.`,
    },
  };
}

const TeamIdLayout = async ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default TeamIdLayout;
