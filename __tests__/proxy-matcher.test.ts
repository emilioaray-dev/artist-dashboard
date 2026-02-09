import { describe, it, expect } from "vitest";

/**
 * Proxy Middleware Matcher Regex — Regression Tests
 *
 * These tests validate the regex used in `src/proxy.ts` to determine which
 * requests the next-intl middleware should process.
 *
 * WHY THIS TEST EXISTS:
 * --------------------
 * The matcher regex uses a negative lookahead to exclude static file paths
 * (containing a dot, e.g. `.jpg`, `.png`, `.ico`) from locale rewriting.
 *
 * A previous bug used `.*\\\\..*` (4 backslashes in source) which produced
 * `\\.` in the string — regex interprets `\\` as a literal backslash, not
 * an escaped dot. Since Unix paths never contain backslashes, the negative
 * lookahead never triggered, and ALL requests (including static files) were
 * rewritten with a locale prefix (e.g. `/covers/art.jpg` → `/en/covers/art.jpg`).
 *
 * HOW THIS AFFECTS THE IMAGE COMPONENT:
 * ------------------------------------
 * Next.js `<Image>` and standard `<img>` tags resolve `src` paths against
 * the public directory. When the middleware incorrectly rewrites a request
 * like `/covers/jeopardy.jpg` to `/en/covers/jeopardy.jpg`, the file does
 * not exist at that locale-prefixed path, resulting in a 404. This breaks
 * ALL images, fonts, and other static assets served from the public directory.
 *
 * The correct pattern `.*\\..*` (2 backslashes in source) produces `\.` in
 * the string, which regex interprets as "literal dot" — properly excluding
 * any path containing a file extension from middleware processing.
 *
 * NOTE: The `api`, `_next`, and `_vercel` exclusions are tested only at
 * the top-level path segment. In production, Next.js applies additional
 * anchoring so deeper paths like `/api/tracks` are also excluded; here we
 * only test the regex in isolation.
 */

// The exact matcher string from src/proxy.ts (line 7)
// Source: "/((?!api|_next|_vercel|.*\\..*).*)"
// In a TS/JS string literal, `\\.` becomes `\.` which in regex = literal dot
const MATCHER_PATTERN = "/((?!api|_next|_vercel|.*\\..*).*)" ;

describe("Proxy middleware matcher regex", () => {
  const regex = new RegExp(MATCHER_PATTERN);

  describe("should MATCH application routes (processed by i18n middleware)", () => {
    it.each([
      "/overview",
      "/releases",
      "/fans",
      "/settings",
      "/es",
      "/fr/overview",
      "/pt/releases",
    ])("matches route: %s", (path) => {
      expect(regex.test(path)).toBe(true);
    });
  });

  describe("should NOT match static files (served directly, no locale rewrite)", () => {
    it.each([
      "/covers/jeopardy.jpg",
      "/covers/album-art.png",
      "/favicon.ico",
      "/og-image.png",
      "/robots.txt",
      "/sitemap.xml",
      "/fonts/custom-font.woff2",
      "/images/logo.svg",
    ])("excludes static file: %s", (path) => {
      expect(regex.test(path)).toBe(false);
    });
  });

  describe("should NOT match top-level internal prefixes", () => {
    // Next.js applies additional anchoring in production; here we only
    // verify the negative lookahead works for paths starting with these prefixes
    it.each([
      ["/api", "api"],
      ["/_next", "_next"],
      ["/_vercel", "_vercel"],
    ])("excludes %s (prefix: %s)", (path) => {
      // The regex should not match when the path after `/` starts with the excluded prefix
      expect(regex.test(path)).toBe(false);
    });
  });

  describe("regression: backslash escaping produces correct regex", () => {
    it("the string value contains backslash-dot (regex literal dot), not double-backslash-dot", () => {
      // The critical check: the string must contain `\.` (backslash + dot)
      // NOT `\\.` (two backslashes + dot) which would match literal backslash
      expect(MATCHER_PATTERN).toContain("\\.");
      expect(MATCHER_PATTERN).not.toContain("\\\\.");
    });

    it("image paths with extensions are excluded from middleware", () => {
      // This was the original bug: /covers/jeopardy.jpg was being rewritten
      // to /en/covers/jeopardy.jpg → 404 because the file doesn't exist there
      expect(regex.test("/covers/jeopardy.jpg")).toBe(false);
    });

    it("the broken regex (4 backslashes) would incorrectly match static files", () => {
      // Demonstrate what the bug looked like: `\\\\.` produces `\\.` in string,
      // which regex interprets as literal backslash + any char — never matches
      // Unix paths, so the negative lookahead always passes and static files
      // are incorrectly processed by the middleware
      const brokenPattern = "/((?!api|_next|_vercel|.*\\\\..*).*)";
      const brokenRegex = new RegExp(brokenPattern);
      // With the broken regex, static files MATCH (bad — they'd get locale-rewritten)
      expect(brokenRegex.test("/covers/jeopardy.jpg")).toBe(true);
      expect(brokenRegex.test("/favicon.ico")).toBe(true);
    });
  });
});
