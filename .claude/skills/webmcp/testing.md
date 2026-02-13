# WebMCP Testing

## Chrome DevTools

Chrome 146+ includes a dedicated **WebMCP panel** in DevTools:

1. Open DevTools (F12)
2. Look for the "WebMCP" or "Model Context" tab
3. View all registered tools, their schemas, and execute them manually

## Model Context Tool Inspector

Chrome extension for viewing and testing registered tools:

1. Install "Model Context Tool Inspector" from Chrome Web Store
2. Navigate to your page
3. See all registered tools with their descriptions and schemas
4. Test tool execution with sample inputs

## Unit Testing with Vitest

### Polyfill Setup

Add to `vitest.setup.ts`:

```typescript
// Mock navigator.modelContext for tests
const mockModelContext = {
  tools: new Map<string, any>(),

  registerTool(tool: any) {
    if (this.tools.has(tool.name)) {
      throw new Error(`Tool "${tool.name}" already registered`);
    }
    this.tools.set(tool.name, tool);
  },

  unregisterTool(name: string) {
    this.tools.delete(name);
  },

  clearContext() {
    this.tools.clear();
  },

  provideContext(options: { tools?: any[] }) {
    this.clearContext();
    options.tools?.forEach((tool) => this.registerTool(tool));
  },

  // Test helper: execute a registered tool
  async executeTool(name: string, input: any = {}) {
    const tool = this.tools.get(name);
    if (!tool) throw new Error(`Tool "${name}" not found`);
    const mockClient = {
      requestUserInteraction: vi.fn((cb) => cb()),
    };
    return tool.execute(input, mockClient);
  },
};

Object.defineProperty(navigator, 'modelContext', {
  value: mockModelContext,
  writable: true,
  configurable: true,
});
```

### Testing Tool Registration

```typescript
import { render } from '@testing-library/react';
import { ReleasesTool } from '@/components/webmcp/tools/ReleasesTool';

describe('ReleasesTool', () => {
  beforeEach(() => {
    (navigator.modelContext as any).clearContext();
  });

  it('registers get_releases tool on mount', () => {
    render(<ReleasesTool />);
    const tools = (navigator.modelContext as any).tools;
    expect(tools.has('get_releases')).toBe(true);
  });

  it('get_releases tool has correct annotations', () => {
    render(<ReleasesTool />);
    const tool = (navigator.modelContext as any).tools.get('get_releases');
    expect(tool.annotations.readOnlyHint).toBe(true);
  });
});
```

### Testing Tool Execution

```typescript
it('get_releases returns release data', async () => {
  // Mock fetch
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ data: [{ id: 'rel_001', title: 'Test' }], status: 200 }),
  });

  render(<ReleasesTool />);

  const result = await (navigator.modelContext as any).executeTool('get_releases');
  expect(result.data).toHaveLength(1);
  expect(result.data[0].id).toBe('rel_001');
});
```

### Testing User Interaction

```typescript
it('play_track requests user interaction', async () => {
  render(<PlayerTool />);

  const mockClient = {
    requestUserInteraction: vi.fn((cb) => cb()),
  };

  const tool = (navigator.modelContext as any).tools.get('play_track');
  await tool.execute({ releaseId: 'rel_001' }, mockClient);

  expect(mockClient.requestUserInteraction).toHaveBeenCalledOnce();
});
```

## E2E Testing with Playwright

### Enable WebMCP Flag

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    launchOptions: {
      args: [
        '--enable-features=ExperimentalWebPlatformFeatures',
      ],
    },
  },
});
```

### Test Tool Registration

```typescript
// e2e/webmcp.spec.ts
import { test, expect } from '@playwright/test';

test('WebMCP tools are registered on dashboard', async ({ page }) => {
  await page.goto('/overview');

  // Check if modelContext exists
  const hasModelContext = await page.evaluate(() => 'modelContext' in navigator);

  if (hasModelContext) {
    // Get registered tool names
    const toolNames = await page.evaluate(() => {
      const mc = (navigator as any).modelContext;
      return Array.from(mc.tools?.keys?.() || []);
    });

    expect(toolNames).toContain('get_releases');
    expect(toolNames).toContain('get_sales');
    expect(toolNames).toContain('get_engagement');
  }
});
```

### Test Tool Execution E2E

```typescript
test('get_sales tool returns data for 30d range', async ({ page }) => {
  await page.goto('/overview');

  const result = await page.evaluate(async () => {
    const mc = (navigator as any).modelContext;
    const tool = mc.tools?.get?.('get_sales');
    if (!tool) return null;
    return await tool.execute({ range: '30d' }, { requestUserInteraction: (cb: any) => cb() });
  });

  expect(result).not.toBeNull();
  expect(result.data?.totalRevenue).toBeGreaterThan(0);
});
```

## Testing Without Chrome 146

If running in a browser without native WebMCP support, the `@mcp-b/global` polyfill provides the API:

```typescript
// Import at app entry point
import '@mcp-b/global';

// navigator.modelContext is now available
```

This polyfill is what makes testing possible in CI environments where Chrome Canary may not be available.
