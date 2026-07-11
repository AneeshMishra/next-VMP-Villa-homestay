import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { type NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin auth guard (unchanged)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = req.cookies.get("admin-token")?.value;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Skip i18n for API and admin routes
  if (pathname.startsWith("/api") || pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Apply locale routing to all other routes
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
