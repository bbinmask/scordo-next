import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <main className="h-screen w-full">
        <Toaster />
        {children}
      </main>
    </ClerkProvider>
  );
};

export default PlatformLayout;
