import { AblyProviders } from "@/components/providers/AblyProviders";
import Bottombar from "./_components/Bottombar";
import Navbar from "@/components/Navbar";
import { getMetadata } from "@/utils/helper/getMetadata";
import { Footer } from "@/components/Footer";
export const metadata = getMetadata();

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <AblyProviders>
      <Navbar />
      <div className="mt-20 flex justify-center">
        <div className="w-full max-w-[1600px]">{children}</div>
      </div>
      <Footer />
      <Bottombar />
    </AblyProviders>
  );
};

export default RootLayout;
