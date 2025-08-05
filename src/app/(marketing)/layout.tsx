import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Scordo",
  description: " Scordo app is to manage your cricket scores.",
};

const MarketingLayout = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};

export default MarketingLayout;
