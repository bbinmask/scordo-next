import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "./lib/db";
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/teams",
  "/matches",
  "/tournaments",
]);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  const isPublic = isPublicRoute(req);
  const { userId, redirectToSignIn } = await auth();
  const isRedirectable =
    pathname.includes("sign-in") || pathname.includes("sign-up") || pathname == "/";

  const isProfileCompleted = false;

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
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
