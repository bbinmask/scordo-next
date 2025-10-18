import { db } from "@/lib/db";
import { NextResponse } from "next/server";

interface Params {
  params: { username: string };
}

export async function GET(req: Request, { params }: Params) {
  const { username } = params;

  try {
    if (!username || username.trim() === "") return NextResponse.error();

    const user = await db.user.findFirst({
      where: {
        username,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.error();
  }
}
