"use client";

import { useState } from "react";

export const useAsyncRunner = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run<T>(fn: () => Promise<T>): Promise<T | undefined> {
    setLoading(true);
    setError(null);
    try {
      return await fn();
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, run };
};
