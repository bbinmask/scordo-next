import { DefaultLoader } from "@/components/Spinner";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return <SignIn afterSignInUrl={`/onboarding`} fallback={<DefaultLoader />} />;
}
