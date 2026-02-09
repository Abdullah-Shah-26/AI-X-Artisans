import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // For demo purposes, just pass through all requests
  return NextResponse.next();
}

// Disable edge runtime for middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - demo (demo assets)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|demo).*)",
  ],
};
