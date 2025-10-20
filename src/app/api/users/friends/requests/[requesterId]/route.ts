import { db } from "@/lib/db";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{ requesterId: string | null }>;
}

export async function GET(_: Request, { params }: Params) {
  try {
    const { requesterId } = await params;

    if (!requesterId) return NextResponse.error();

    const requests = await db.friendship.findMany({
      where: {
        requesterId,
        status: "PENDING",
      },
      select: {
        addressee: {
          select: {
            name: true,
            username: true,
            id: true,
          },
        },
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.error();
  }
}
