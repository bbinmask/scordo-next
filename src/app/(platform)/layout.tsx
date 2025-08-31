import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <div className="layout-background h-full w-full">
        <Toaster />
        {children}
      </div>
    </ClerkProvider>
  );
};

export default PlatformLayout;
