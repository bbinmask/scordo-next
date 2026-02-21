import { NextResponse } from "next/server";
import Ably from "ably";
import { uniqueNamesGenerator, adjectives, colors, animals } from "unique-names-generator";

export const dynamic = "force-dynamic"; // important

export async function GET() {
  try {
    if (!process.env.ABLY_CLIENT_API_KEY) {
      throw new Error("Missing ABLY_CLIENT_API_KEY");
    }
    const client = new Ably.Rest(process.env.ABLY_CLIENT_API_KEY);

    const randomName = uniqueNamesGenerator({
      dictionaries: [adjectives, animals, colors],
      length: 2,
    });

    const tokenRequestData = await client.auth.createTokenRequest({
      clientId: randomName,
    });

    return NextResponse.json(tokenRequestData);
  } catch (error) {
    console.error("Error creating token request:", error);
    return NextResponse.json({ error: "Failed to create token request" }, { status: 500 });
  }
}
