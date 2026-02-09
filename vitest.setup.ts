import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock ResizeObserver
import ResizeObserverPolyfill from "resize-observer-polyfill";

// Check if ResizeObserver is already available (in newer environments)
if (globalThis.ResizeObserver === undefined) {
  globalThis.ResizeObserver = ResizeObserverPolyfill;
}

// Mock next-intl navigation (requires next/navigation which is unavailable in jsdom)
vi.mock("@/i18n/navigation", async () => {
  const React = await import("react");
  const MockLink = React.forwardRef<
    HTMLAnchorElement,
    React.AnchorHTMLAttributes<HTMLAnchorElement>
  >(({ href, children, ...rest }, ref) =>
    React.createElement("a", { href, ref, ...rest }, children),
  );
  MockLink.displayName = "MockLink";
  return {
    Link: MockLink,
    usePathname: () => "/",
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    }),
    redirect: vi.fn(),
  };
});
