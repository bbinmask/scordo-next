import Image from "next/image";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="center grid h-full w-full bg-gradient-to-br from-emerald-300 via-teal-600 to-emerald-600 px-4 md:grid-cols-2">
      <div className="hidden md:block">
        <Image width={500} height={800} src="/hero2.png" className="rounded-3xl" alt="Banner" />
      </div>
      {children}
    </div>
  );
};

export default AuthLayout;
