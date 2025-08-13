import Bottombar from "./_components/Bottombar";
import Navbar from "./_components/Navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="">
      <nav className="mb-24">
        <Navbar />
      </nav>
      <div className="pb-[86px]">{children}</div>
      <Bottombar />
    </div>
  );
};

export default DashboardLayout;
