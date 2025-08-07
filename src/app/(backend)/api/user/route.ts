import { NextRequest, NextResponse } from "next/server";

export default async function GET(req: NextRequest) {
  console.log("Im here");
  const id = crypto.randomUUID();
  const name = "Irfanul Madar";
  const email = "irfanulmadar@gmail.com";
  const details = req.json();

  return NextResponse.json({ id, name, email, details });
}
