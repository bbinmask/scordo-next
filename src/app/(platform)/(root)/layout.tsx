import { AblyProviders } from "@/components/providers/AblyProviders";
import Bottombar from "./_components/Bottombar";
import Navbar from "./_components/Navbar";
import QueryProvider from "@/components/providers/QueryProvider";
import { getMetadata } from "@/utils/helper/getMetadata";
export const metadata = getMetadata();

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <AblyProviders>
        <Navbar />
        <div className="flex justify-center">
          <div className="w-full max-w-[1600px]">{children}</div>
        </div>
        <Bottombar />
      </AblyProviders>
    </QueryProvider>
  );
};

export default RootLayout;

// 1200px
