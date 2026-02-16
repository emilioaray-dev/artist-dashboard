import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const VALID_PATHS = [
  "/",
  "/overview",
  "/releases",
  "/fans",
  "/settings",
];

const DYNAMIC_PATTERNS = [
  /^\/releases\/rel_\d+$/, // /releases/rel_001, /releases/rel_002, etc.
];

function isValidPath(pathname: string): boolean {
  // Strip locale prefix if present (e.g., /es/overview → /overview)
  const locales = routing.locales;
  let path = pathname;
  for (const locale of locales) {
    if (path.startsWith(`/${locale}/`)) {
      path = path.slice(locale.length + 1);
      break;
    }
    if (path === `/${locale}`) {
      path = "/";
      break;
    }
  }

  if (VALID_PATHS.includes(path)) return true;
  return DYNAMIC_PATTERNS.some((pattern) => pattern.test(path));
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isValidPath(pathname)) {
    const referer = request.headers.get("referer");
    if (referer) {
      return NextResponse.redirect(referer);
    }
    // No referer — redirect to home
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = "/";
    return NextResponse.redirect(homeUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"], // NOSONAR - Next.js requires string literals for static analysis; String.raw breaks middleware matching
};
