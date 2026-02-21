"use client";

import Ably from "ably";

declare global {
  var ablyClient: Ably.Realtime | undefined;
}

export const ablyClient =
  globalThis.ablyClient ||
  new Ably.Realtime({
    authUrl: `${process.env.NEXT_PUBLIC_HOSTNAME}/api/ably/token`,
  });
