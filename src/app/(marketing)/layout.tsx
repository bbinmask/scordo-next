import { getMetadata } from "@/utils/helper/getMetadata";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = getMetadata();

const MarketingLayout = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};

export default MarketingLayout;
