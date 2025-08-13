import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <main className="min-h-[calc(100vh - 100px)] w-full pb-2">
        <Toaster />
        {children}
      </main>
    </ClerkProvider>
  );
};

export default PlatformLayout;
