import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
const isPublicRoute = createRouteMatcher(["/", "/auth(.*)"]);
const isOnboardingRoute = createRouteMatcher(["/onboarding"]);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  const isPublic = isPublicRoute(req);
  const { userId, redirectToSignIn, sessionClaims } = await auth();
  const isRedirectable =
    pathname.includes("sign-in") || pathname.includes("sign-up") || pathname == "/";

  if (userId && isOnboardingRoute(req)) {
    return NextResponse.next();
  }

  console.log("isProfileCompleted is ", sessionClaims?.metadata.isProfileCompleted);

  if (userId && !sessionClaims?.metadata?.isProfileCompleted) {
    const onboardingUrl = new URL("/onboarding", req.url);
    return NextResponse.redirect(onboardingUrl);
  }

  if (!userId && !isPublic) {
    return redirectToSignIn({ returnBackUrl: new URL("sign-in", req.url) });
  }

  if (userId && isPublic && isRedirectable) {
    return redirectToSignIn({ returnBackUrl: new URL("dashboard", req.url) });
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
