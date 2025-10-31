import { getMetadata } from "@/utils/helper/getMetadata";

export const metadata = getMetadata("Accounts | Scordo");

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="center bg-main flex h-screen w-full px-4 py-4">{children}</div>;
};

export default AuthLayout;
