"use client";

import { AuthPrompt } from "@/components/modals/AuthPrompt";
import { useEffect, useState } from "react";
const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <AuthPrompt />
    </>
  );
};

export default ModalProvider;
