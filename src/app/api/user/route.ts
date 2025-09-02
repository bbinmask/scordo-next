import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = crypto.randomUUID();
  const name = "Irfanul Madar";
  const email = "irfanulmadar@gmail.com";
  const details = req.json();

  return NextResponse.json({ id, name, email, details });
}
