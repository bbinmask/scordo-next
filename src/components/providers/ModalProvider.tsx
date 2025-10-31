"use client";

import { useEffect, useState } from "react";
import FriendsModal from "@/components/modals/FriendsModal";
const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return <>{/* <FriendsModal /> */}</>;
};

export default ModalProvider;
