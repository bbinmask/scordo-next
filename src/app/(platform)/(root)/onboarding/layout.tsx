import Spinner from "@/components/Spinner";
import { useUser } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();

  if (user?.publicMetadata?.isProfileCompleted) {
    redirect("/dashboard");
  }

  if (user?.publicMetadata?.isProfileCompleted)
    return (
      <div className="center flex h-full w-full">
        <Spinner className="h-6 w-6" />
      </div>
    );

  return <div className="h-full w-full">{children}</div>;
}
