import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ abbr: string }> }) {
  console.log(params);
  console.log("I was there!");
  return NextResponse.json(null);
}
