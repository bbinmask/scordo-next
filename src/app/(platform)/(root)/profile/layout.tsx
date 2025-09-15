import React from "react";

export const metadata = {
  title: "Profile | Scordo",
  description: "Manage your profile and personal information on Scordo.",
};

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative">{children}</div>;
};

export default ProfileLayout;
