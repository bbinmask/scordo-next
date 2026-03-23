"use client";

import { AblyProvider } from "ably/react";
import { getAblyClient } from "@/lib/ably-client";
import { useEffect } from "react";

export function AblyProviders({ children }: { children: React.ReactNode }) {
  const client = getAblyClient();

  useEffect(() => {
    localStorage.setItem("ABLY_CLIENT_ID", client.clientId);
  }, [client.clientId]);

  return <AblyProvider client={client}>{children}</AblyProvider>;
}
