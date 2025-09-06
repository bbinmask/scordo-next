import { useUser } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();

  if (user.publicMetadata?.isProfileCompleted) {
    redirect("/dashboard");
  }

  return <div className="h-full">{children}</div>;
}
