// middleware.ts (placed in project root, since you don’t use src/)
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)", // or adjust to your needs
    "/(api|trpc)(.*)",
  ],
};
