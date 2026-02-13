# WebMCP React Hooks

## Package

```bash
pnpm add @mcp-b/react-webmcp @mcp-b/global zod
```

- `@mcp-b/global` — polyfill that provides `navigator.modelContext` for browsers that don't support it natively
- `@mcp-b/react-webmcp` — React hooks for tool registration
- `zod` — schema validation (used for `inputSchema` definition)

## useWebMCP Hook

Registers a tool in `navigator.modelContext` and manages execution state.

```typescript
'use client';

import { useWebMCP } from '@mcp-b/react-webmcp';
import { z } from 'zod';

function MyToolComponent() {
  const { state, execute, reset } = useWebMCP({
    name: 'tool_name',
    description: 'What this tool does for AI agents',
    inputSchema: {
      param1: z.string().describe('Parameter description'),
      param2: z.number().optional().describe('Optional param'),
    },
    handler: async ({ param1, param2 }) => {
      // Tool logic — fetch data, call APIs, etc.
      const res = await fetch(`/api/endpoint?q=${param1}`);
      return await res.json();
    },
    annotations: {
      readOnlyHint: true,       // No side effects
      // idempotentHint: true,  // Safe to call multiple times
      // destructiveHint: false, // Does not delete/modify data
    },
    onError: (error, input) => {
      console.error('Tool error:', error, 'Input:', input);
    },
  });

  // state.isExecuting — boolean, true while handler runs
  // state.lastResult — last successful return value
  // state.error — Error | null
  // execute(input) — manually trigger the tool
  // reset() — clear state

  return null; // Tools often render nothing — they just register
}
```

### Return Value

```typescript
{
  state: {
    isExecuting: boolean;
    lastResult: TOutput | null;
    error: Error | null;
  };
  execute: (input: TInput) => Promise<TOutput>;
  reset: () => void;
}
```

## useWebMCPContext Hook

Exposes read-only context (not a callable tool — just data the agent can read).

```typescript
'use client';

import { useWebMCPContext } from '@mcp-b/react-webmcp';

function CartContext() {
  const [cart, setCart] = useState([]);

  useWebMCPContext(
    'cart_contents',              // Context name
    'Current shopping cart items', // Description
    () => cart                     // Value factory — called when agent reads
  );

  return null;
}
```

## Next.js App Router Pattern

**Critical**: `navigator` does not exist on the server. All WebMCP code MUST be in Client Components.

### Pattern 1: Invisible tool component

```typescript
// src/components/webmcp/ReleasesTool.tsx
'use client';

import { useWebMCP } from '@mcp-b/react-webmcp';
import { z } from 'zod';

export function ReleasesTool() {
  useWebMCP({
    name: 'get_releases',
    description: 'Fetch all music releases from the artist dashboard',
    inputSchema: {},
    handler: async () => {
      const res = await fetch('/api/releases');
      return await res.json();
    },
    annotations: { readOnlyHint: true },
  });

  return null; // No visual output
}
```

### Pattern 2: Mount in layout

```typescript
// src/app/[locale]/(dashboard)/layout.tsx
import { WebMCPProvider } from '@/components/webmcp/WebMCPProvider';

export default function DashboardLayout({ children }) {
  return (
    <>
      <WebMCPProvider />
      {children}
    </>
  );
}
```

### Pattern 3: Provider that registers all tools

```typescript
// src/components/webmcp/WebMCPProvider.tsx
'use client';

import { ReleasesTool } from './tools/ReleasesTool';
import { SalesTool } from './tools/SalesTool';
import { EngagementTool } from './tools/EngagementTool';
import { PlayerTool } from './tools/PlayerTool';

export function WebMCPProvider() {
  return (
    <>
      <ReleasesTool />
      <SalesTool />
      <EngagementTool />
      <PlayerTool />
    </>
  );
}
```

## Client Hooks (Consuming MCP Servers)

For connecting to external MCP servers from the browser:

```typescript
import { McpClientProvider, useMcpClient } from '@mcp-b/react-webmcp';

// Wrap app
<McpClientProvider client={client} transport={transport} opts={opts}>
  {children}
</McpClientProvider>

// Consume
function MyComponent() {
  const {
    client,        // MCP SDK client instance
    tools,         // Tool[] available tools
    resources,     // Resource[] available resources
    isConnected,   // boolean
    isLoading,     // boolean
    error,         // Error | null
    capabilities,  // ServerCapabilities | null
    reconnect,     // () => Promise<void>
  } = useMcpClient();
}
```

**Supported transports**: `TabClientTransport` (same-page), `ExtensionClientTransport` (Chrome extension), `InMemoryTransport` (testing).

## No-Build Alternative (CDN)

For quick prototyping without npm:

```html
<script src="https://unpkg.com/@mcp-b/global@latest/dist/index.iife.js"></script>
<script>
  navigator.modelContext.registerTool({ ... });
</script>
```
