"use client";

import { AblyProvider } from "ably/react";
import { getAblyClient } from "@/lib/ably-client";

export function AblyProviders({ children }: { children: React.ReactNode }) {
  const client = getAblyClient();

  return <AblyProvider client={client}>{children}</AblyProvider>;
}
