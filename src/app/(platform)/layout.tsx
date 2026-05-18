import { getMetadata } from "@/utils/helper/getMetadata";

export const metadata = getMetadata();

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="h-full w-full">{children}</div>;
};

export default PlatformLayout;
