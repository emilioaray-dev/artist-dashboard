import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\\\..*).*)"], // NOSONAR - Next.js requires string literals for static analysis; String.raw breaks middleware matching
};
