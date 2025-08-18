import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <div className="layout-background w-full pb-2">
        <Toaster />
        {children}
      </div>
    </ClerkProvider>
  );
};

export default PlatformLayout;
