import Bottombar from "./_components/Bottombar";
import Navbar from "./_components/Navbar";
import QueryProvider from "@/components/providers/QueryProvider";
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <div className="">
        <nav className="mb-24">
          <Navbar />
        </nav>
        <div className="pb-[86px]">{children}</div>
        <Bottombar />
      </div>
    </QueryProvider>
  );
};

export default RootLayout;
