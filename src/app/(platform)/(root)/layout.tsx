import { Sidebar } from "@/components/ui/sidebar";
import Bottombar from "./_components/Bottombar";
import Navbar from "./_components/Navbar";
import QueryProvider from "@/components/providers/QueryProvider";
import { SidebarDemo } from "./_components/SidebarDemo";
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <nav className="mb-24">
        <Navbar />
      </nav>
      <div className="flex justify-center">
        {/* <SidebarDemo></SidebarDemo> */}
        <div className="w-full max-w-[1200px] pb-[70px]">{children}</div>
      </div>
      <Bottombar />
    </QueryProvider>
  );
};

export default RootLayout;
