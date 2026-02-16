import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// ---------------------------------------------------------------------------
// Mock navigator.modelContext (WebMCP polyfill)
// ---------------------------------------------------------------------------
type ToolEntry = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
  annotations?: Record<string, boolean>;
  execute: (args: Record<string, unknown>) => Promise<unknown>;
};

const toolRegistry = new Map<string, ToolEntry>();

const modelContextMock = {
  registerTool(descriptor: ToolEntry) {
    toolRegistry.set(descriptor.name, descriptor);
    return {
      unregister: () => toolRegistry.delete(descriptor.name),
    };
  },
  unregisterTool(name: string) {
    toolRegistry.delete(name);
  },
  listTools() {
    return [...toolRegistry.values()].map(({ execute: _execute, ...meta }) => meta);
  },
  async callTool(params: { name: string; arguments?: Record<string, unknown> }) {
    const tool = toolRegistry.get(params.name);
    if (!tool) throw new Error(`Tool not found: ${params.name}`);
    return tool.execute(params.arguments ?? {});
  },
  clearContext() {
    toolRegistry.clear();
  },
  provideContext() {
    /* no-op in tests */
  },
  registerResource: vi.fn(() => ({ unregister: vi.fn() })),
  unregisterResource: vi.fn(),
  listResources: vi.fn(() => []),
  listResourceTemplates: vi.fn(() => []),
  registerPrompt: vi.fn(() => ({ unregister: vi.fn() })),
  unregisterPrompt: vi.fn(),
  listPrompts: vi.fn(() => []),
  createMessage: vi.fn(),
  elicitInput: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
};

Object.defineProperty(navigator, "modelContext", {
  value: modelContextMock,
  writable: true,
  configurable: true,
});

// Provide modelContextTesting to prevent polyfill "partial native API" warning
Object.defineProperty(navigator, "modelContextTesting", {
  value: {
    executeTool: async (name: string, argsJson: string) =>
      modelContextMock.callTool({ name, arguments: JSON.parse(argsJson || "{}") }),
    listTools: () =>
      modelContextMock.listTools().map((t: { name: string; description: string; inputSchema: Record<string, unknown> }) => ({
        ...t,
        inputSchema: JSON.stringify(t.inputSchema),
      })),
    registerToolsChangedCallback: vi.fn(),
    getToolCalls: () => [],
    clearToolCalls: vi.fn(),
    setMockToolResponse: vi.fn(),
    clearMockToolResponse: vi.fn(),
    clearAllMockToolResponses: vi.fn(),
    getRegisteredTools: () => modelContextMock.listTools(),
    reset: () => toolRegistry.clear(),
  },
  writable: true,
  configurable: true,
});

/** Test helper — exposed for direct use in test files */
export { toolRegistry, modelContextMock };

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
