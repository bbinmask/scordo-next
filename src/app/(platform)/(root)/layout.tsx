import Bottombar from "./dashboard/_components/Bottombar";
import Navbar from "./dashboard/_components/Navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <nav className="mb-24">
        <Navbar />
      </nav>
      <div className="pb-[86px]">{children}</div>
      <Bottombar />
    </div>
  );
};

export default DashboardLayout;
