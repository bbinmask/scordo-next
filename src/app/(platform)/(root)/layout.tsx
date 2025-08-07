import Bottombar from "./dashboard/_components/Bottombar";
import Navbar from "./dashboard/_components/Navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <nav className="mb-24">
        <Navbar />
      </nav>
      <div className="pb-[86px]">{children}</div>
      <Bottombar />
    </main>
  );
};

export default DashboardLayout;
