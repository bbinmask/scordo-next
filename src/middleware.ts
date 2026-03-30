// import { clerkClient, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// const isPublicRoute = createRouteMatcher(["/", "/auth(.*)"]);
// const isOnboardingRoute = createRouteMatcher(["/onboarding"]);

// export default clerkMiddleware(async (auth, req) => {
//   const { userId, redirectToSignIn } = await auth();

//   const { pathname } = req.nextUrl;
//   const isPublic = isPublicRoute(req);
//   const isRedirectable =
//     pathname.includes("sign-in") || pathname.includes("sign-up") || pathname == "/";

//   if (userId && isOnboardingRoute(req)) {
//     return NextResponse.next();
//   }

//   if (!userId && !isPublic) {
//     return redirectToSignIn({ returnBackUrl: new URL("sign-in", req.url) });
//   }

//   if (userId) {
//     const clerk = await clerkClient();
//     const user = await clerk.users.getUser(userId);

//     if (userId && !user?.publicMetadata?.isProfileCompleted) {
//       const onboardingUrl = new URL("/onboarding", req.url);
//       return NextResponse.redirect(onboardingUrl);
//     }

//     if (userId && isPublic && isRedirectable) {
//       return redirectToSignIn({ returnBackUrl: new URL("dashboard", req.url) });
//     }
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: ["/((?!_next|api/ably/token).*)"],
// };

// //"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
// //    "/(api|trpc)(.*)",
// //  "/((?!_next|api/ably/token|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

import { clerkClient, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/auth(.*)"]);
const isOnboardingRoute = createRouteMatcher(["/onboarding"]);

// Public API routes that bypass auth (webhooks must be unauthenticated, ably token is public)
const isPublicApiRoute = createRouteMatcher([
  "/api/webhooks/clerk(.*)",
  "/api/ably/token",
  "/api/explore",
  "/matches/(.*)",
  "/api/matches/(.*)",
  "/u/(.*)",
  "/api/u/(.*)",
  "/tournament/(.*)",
  "/api/tournament/(.*)",
  "/teams/(.*)",
  "/api/teams/(.*)",
  "/explore(.*)",
  "/api/search(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  const { pathname } = req.nextUrl;
  const isPublic = isPublicRoute(req);
  const isRedirectable =
    pathname.includes("sign-in") || pathname.includes("sign-up") || pathname == "/";

  // Always allow truly public API routes (webhooks, ably token)
  if (isPublicApiRoute(req)) {
    return NextResponse.next();
  }

  // All other /api/* routes require a logged-in user
  if (pathname.startsWith("/api/")) {
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Allow authenticated users to access onboarding
  if (userId && isOnboardingRoute(req)) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users away from protected pages
  if (!userId && !isPublic) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  if (userId) {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);

    // If profile not yet completed, force to /onboarding.
    // The isOnboardingRoute check above already lets them through there — no loop.
    if (!user?.publicMetadata?.isProfileCompleted && !isOnboardingRoute(req)) {
      const onboardingUrl = new URL("/onboarding", req.url);
      return NextResponse.redirect(onboardingUrl);
    }

    // Redirect completed-profile users away from public/auth pages
    if (user?.publicMetadata?.isProfileCompleted && isPublic && isRedirectable) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  // Exclude Next.js internals and static assets; include everything else
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)"],
};
