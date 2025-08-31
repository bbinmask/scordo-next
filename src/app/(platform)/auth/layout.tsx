const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="center layout-background flex h-[calc(100vh-20px)] w-full px-4 py-4">
      {children}
    </div>
  );
};

export default AuthLayout;
