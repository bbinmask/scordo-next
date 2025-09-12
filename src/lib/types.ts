import { Prisma } from "@/generated/prisma";

// Re-use the validator from Step 1
const teamWithPlayerCountAndOwner = Prisma.validator<Prisma.TeamDefaultArgs>()({
  select: {
    id: true,
    name: true,
    logo: true,
    banner: true,
    abbreviation: true,
    owner: {
      select: {
        id: true,
        username: true,
      },
    },
    _count: {
      select: { players: true },
    },
  },
});

export type TeamForListComponent = Prisma.TeamGetPayload<typeof teamWithPlayerCountAndOwner>;
