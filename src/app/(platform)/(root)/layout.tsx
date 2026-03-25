import { AblyProviders } from "@/components/providers/AblyProviders";
import Bottombar from "./_components/Bottombar";
import Navbar from "@/components/Navbar";
import QueryProvider from "@/components/providers/QueryProvider";
import { getMetadata } from "@/utils/helper/getMetadata";
import { auth } from "@clerk/nextjs/server";
export const metadata = getMetadata();

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const { userId } = await auth();

  return (
    <QueryProvider>
      <AblyProviders>
        <Navbar />
        <div className="mt-20 flex justify-center">
          <div className="w-full max-w-[1600px]">{children}</div>
        </div>
        {userId && userId.trim() !== "" && <Bottombar />}
      </AblyProviders>
    </QueryProvider>
  );
};

export default RootLayout;
