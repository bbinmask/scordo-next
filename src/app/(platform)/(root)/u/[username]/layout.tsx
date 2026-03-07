import UserIdPage from "./page";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}

const Layout = ({ children, params }: LayoutProps) => {
  return (
    <div>
      <UserIdPage params={params} />
      {children}
    </div>
  );
};

export default Layout;
