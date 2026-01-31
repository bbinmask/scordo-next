import { db } from "@/lib/db";
import { Metadata } from "next";
import React from "react";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = await params;

  const match = await db.match.findUnique({
    where: {
      id,
    },
    select: {
      teamA: {
        select: {
          abbreviation: true,
        },
      },
      teamB: {
        select: {
          abbreviation: true,
        },
      },
    },
  });

  if (match)
    return {
      title: `${match.teamA.abbreviation} V/S ${match.teamB.abbreviation}`.toUpperCase(),
      description: `View ${match.teamA.abbreviation} V/S ${match.teamB.abbreviation} details, scorecard, and activity.`,
    };
  return {
    title: `Match Details`,
    description: `View match details, scorecard, and activity.`,
  };
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
