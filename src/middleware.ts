import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
const isPublicRoute = createRouteMatcher(["/", "/auth(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  const isPublic = isPublicRoute(req);
  const { userId, redirectToSignIn, sessionClaims } = await auth();
  const isRedirectable =
    pathname.includes("sign-in") || pathname.includes("sign-up") || pathname == "/";

  if (!userId && !isPublic) {
    return redirectToSignIn({ returnBackUrl: new URL("sign-in", req.url) });
  }

  let isProfileCompleted = sessionClaims?.metadata?.isProfileCompleted || false;

  console.log(sessionClaims?.metadata);

  if (
    userId &&
    !isProfileCompleted &&
    !req.nextUrl.pathname.startsWith(`/profile/complete-profile`)
  ) {
    return NextResponse.redirect(new URL(`/profile/complete-profile/${userId}`, req.url), req);
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
