# WebMCP Imperative API

## navigator.modelContext Interface

```webidl
partial interface Navigator {
  [SecureContext, SameObject] readonly attribute ModelContext modelContext;
};
```

### Methods

| Method | Description |
|--------|-------------|
| `provideContext(options)` | Register context and tools, **clears all pre-existing** |
| `clearContext()` | Unregister all tools |
| `registerTool(tool)` | Add a single tool without clearing existing; throws on duplicate name |
| `unregisterTool(name)` | Remove a named tool |

## ModelContextTool Dictionary

```typescript
interface ModelContextTool {
  name: string;              // Required — unique identifier
  description: string;       // Required — natural language description for agents
  inputSchema?: object;      // JSON Schema for input validation
  execute: ToolExecuteCallback;  // Required — async function that runs the tool
  annotations?: ToolAnnotations;
}

interface ToolAnnotations {
  readOnlyHint?: boolean;      // true = no side effects
  idempotentHint?: boolean;    // true = safe to call multiple times
  destructiveHint?: boolean;   // true = deletes or modifies data
}

type ToolExecuteCallback = (input: object, client: ModelContextClient) => Promise<any>;
```

## ModelContextClient (passed to execute)

```typescript
interface ModelContextClient {
  requestUserInteraction(callback: () => Promise<any>): Promise<any>;
}
```

Use `requestUserInteraction()` to pause agent execution and request user confirmation for sensitive actions.

## SubmitEvent Extension

```typescript
interface SubmitEvent {
  agentInvoked: boolean;  // true if an AI agent triggered the form submission
}
```

## Basic Example

```typescript
if ('modelContext' in navigator) {
  navigator.modelContext.registerTool({
    name: 'get_releases',
    description: 'Fetch all music releases from the artist dashboard',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    annotations: { readOnlyHint: true },
    execute: async () => {
      const res = await fetch('/api/releases');
      const data = await res.json();
      return { content: [{ type: 'text', text: JSON.stringify(data) }] };
    },
  });
}
```

## Example with Parameters

```typescript
navigator.modelContext.registerTool({
  name: 'get_sales',
  description: 'Fetch sales analytics for a given time range',
  inputSchema: {
    type: 'object',
    properties: {
      range: {
        type: 'string',
        enum: ['7d', '30d', '90d'],
        description: 'Time range for sales data',
      },
    },
    required: ['range'],
  },
  annotations: { readOnlyHint: true },
  execute: async ({ range }) => {
    const res = await fetch(`/api/sales?range=${range}`);
    return await res.json();
  },
});
```

## Example with User Confirmation

```typescript
navigator.modelContext.registerTool({
  name: 'play_track',
  description: 'Play a music track by release ID',
  inputSchema: {
    type: 'object',
    properties: {
      releaseId: { type: 'string', description: 'The release ID (e.g., rel_001)' },
    },
    required: ['releaseId'],
  },
  execute: async ({ releaseId }, client) => {
    // Request user confirmation before playing audio
    await client.requestUserInteraction(async () => {
      usePlayerStore.getState().play(`/api/audio/${releaseId}`);
    });
    return { success: true, message: `Now playing release ${releaseId}` };
  },
});
```

## Feature Detection

Always check before registering:

```typescript
if ('modelContext' in navigator) {
  // WebMCP is available
} else {
  // Fallback or skip — no agent capabilities
}
```

## Cleanup

Unregister tools when a component unmounts or page navigates:

```typescript
// Single tool
navigator.modelContext.unregisterTool('get_releases');

// All tools
navigator.modelContext.clearContext();
```
