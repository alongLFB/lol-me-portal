import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./src/lib/i18n/routing";
import { verifyToken, AUTH_COOKIE_NAME } from "./src/lib/auth";

const intlMiddleware = createMiddleware(routing);

// Paths that require admin authentication
const ADMIN_PATH_REGEX = /^\/(?:zh|en)\/admin(?!\/login)/;

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if this is an admin route (excluding login)
  if (ADMIN_PATH_REGEX.test(pathname)) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      const locale = pathname.startsWith("/en") ? "en" : "zh";
      return NextResponse.redirect(
        new URL(`/${locale}/admin/login`, request.url)
      );
    }

    const session = await verifyToken(token);
    if (!session) {
      const locale = pathname.startsWith("/en") ? "en" : "zh";
      const response = NextResponse.redirect(
        new URL(`/${locale}/admin/login`, request.url)
      );
      response.cookies.delete(AUTH_COOKIE_NAME);
      return response;
    }
  }

  // Run next-intl middleware for locale routing
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
