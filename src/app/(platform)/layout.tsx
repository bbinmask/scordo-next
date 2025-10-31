import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { getMetadata } from "@/utils/helper/getMetadata";

export const metadata = getMetadata();

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <div className="h-full w-full">
        <Toaster />
        {children}
      </div>
    </ClerkProvider>
  );
};

export default PlatformLayout;
