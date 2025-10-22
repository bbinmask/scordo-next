import { db } from "@/lib/db";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{ addresseeId: string | null }>;
}

export async function GET(_: Request, { params }: Params) {
  try {
    const { addresseeId } = await params;
    if (!addresseeId) return NextResponse.error();

    const requests = await db.friendship.findMany({
      where: {
        addresseeId,
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
        requesterId: true,
        requester: {
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
