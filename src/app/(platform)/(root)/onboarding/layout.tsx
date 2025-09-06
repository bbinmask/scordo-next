import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { sessionClaims } = await auth();

  console.log(sessionClaims.metadata);

  if (sessionClaims.metadata.isProfileCompleted) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
