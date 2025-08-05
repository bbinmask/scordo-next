import { Toaster } from "sonner";

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Toaster />
      {children}
    </div>
  );
};

export default PlatformLayout;
