"use client";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { customClerkMetadata } from "@/utils/clerk";
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();

  useEffect(() => {
    const updateMetadata = async () => {
      if (user?.id) await customClerkMetadata(user?.id, "isProfileCompleted", false);
    };

    updateMetadata();
  }, [user]);

  return <div className="center bg-main flex h-screen w-full px-4 py-4">{children}</div>;
};

export default AuthLayout;
