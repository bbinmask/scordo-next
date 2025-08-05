import Bottombar from "./_components/Bottombar";
import Navbar from "./_components/Navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <nav className="mb-8">
        <Navbar />
      </nav>
      {children}
      <Bottombar />
    </main>
  );
};

export default DashboardLayout;
