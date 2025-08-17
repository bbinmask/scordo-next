import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <main className="layout-background w-full pb-2">
        <Toaster />
        {children}
      </main>
    </ClerkProvider>
  );
};

export default PlatformLayout;
