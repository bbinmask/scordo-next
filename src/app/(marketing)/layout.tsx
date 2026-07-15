import Navbar from "@/components/Navbar";
import { getMetadata } from "@/utils/helper/getMetadata";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = getMetadata();

const MarketingLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Navbar />
      <div className="mt-[67px]">{children}</div>
    </div>
  );
};

export default MarketingLayout;
