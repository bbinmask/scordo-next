import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const payload = await req.json();
  const rawHeaders = await headers();
  const headerPayload: Record<string, string> = {};
  for (const [key, value] of rawHeaders.entries()) {
    headerPayload[key] = value;
  }
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  try {
    const evt = wh.verify(JSON.stringify(payload), headerPayload) as {
      type: string;
      data: { id: string };
    };

    if (evt.type === "user.created") {
      const { id } = evt.data;

      const client = await clerkClient();
      await client.users.updateUser(id, {
        publicMetadata: {
          isProfileCompleted: false,
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
}
