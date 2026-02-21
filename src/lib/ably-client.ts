"use client";

import * as Ably from "ably";

let ably: Ably.Realtime | null = null;

export function getAblyClient() {
  if (!ably) {
    ably = new Ably.Realtime({
      authUrl: `${process.env.NEXT_PUBLIC_HOSTNAME}/api/ably/token`,
      autoConnect: true,
    });
  }
  return ably;
}
