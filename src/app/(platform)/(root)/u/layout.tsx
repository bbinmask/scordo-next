import { getMetadata } from "@/utils/helper/getMetadata";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const metadata = getMetadata("User");

const UserLayout = ({ children }: LayoutProps) => {
  return children;
};

export default UserLayout;
