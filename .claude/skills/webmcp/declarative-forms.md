# WebMCP Declarative Forms

Zero-JavaScript approach for exposing tools via annotated HTML forms.

## Form-Level Attributes

| Attribute | Required | Description |
|-----------|----------|-------------|
| `toolname` | Yes | Unique tool identifier |
| `tooldescription` | Yes | Natural language description for AI agents |
| `toolautosubmit` | No | If `"true"`, agent can submit without user confirmation |

## Input-Level Attributes

| Attribute | Description |
|-----------|-------------|
| `toolparamtitle` | Human-readable title for the parameter |
| `toolparamdescription` | Description of the parameter's purpose |

The browser **automatically generates tool schemas** from input field names, types, and validation rules (`required`, `min`, `max`, `pattern`, etc.).

## Complete Example

```html
<form
  toolname="search_releases"
  tooldescription="Search music releases by title, type, or status"
  toolautosubmit="true"
>
  <label for="query">Search</label>
  <input
    type="text"
    id="query"
    name="query"
    required
    toolparamtitle="Search Query"
    toolparamdescription="Title or keyword to search for in releases"
  />

  <label for="type">Release Type</label>
  <select
    id="type"
    name="type"
    toolparamtitle="Release Type"
    toolparamdescription="Filter by release type"
  >
    <option value="">All</option>
    <option value="single">Single</option>
    <option value="ep">EP</option>
    <option value="album">Album</option>
    <option value="bundle">Bundle</option>
  </select>

  <button type="submit">Search</button>
</form>
```

## Behavioral Details

### Without `toolautosubmit`
1. Browser brings the form into **visual focus**
2. Agent populates fields with values
3. User sees the pre-filled form and must **manually click submit**
4. Good for: sensitive actions, payments, destructive operations

### With `toolautosubmit="true"`
1. Agent populates fields and submits directly
2. No user confirmation needed
3. Good for: search, read-only queries, idempotent actions

### Detecting Agent Submissions

```typescript
form.addEventListener('submit', (event: SubmitEvent) => {
  if (event.agentInvoked) {
    // This submission came from an AI agent
    console.log('Agent submitted the form');
  } else {
    // Normal user submission
  }
});
```

## CSS Pseudo-Classes

Style elements during agent interaction:

```css
/* Form being interacted with by an agent */
form:tool-form-active {
  outline: 2px solid oklch(0.769 0.174 70.7); /* primary color */
  outline-offset: 2px;
}

/* Submit button being triggered by agent */
button:tool-submit-active {
  opacity: 0.7;
  cursor: wait;
}
```

## When to Use Declarative vs Imperative

| Use Case | Approach |
|----------|----------|
| Existing HTML forms | Declarative (just add attributes) |
| API calls without forms | Imperative (`registerTool`) |
| Complex logic or state | Imperative or React hooks |
| Quick prototyping | Declarative |
| Multiple tools at once | React hooks (`useWebMCP`) |

## Next.js Integration

For Server Components, declarative forms work directly since they're just HTML attributes:

```tsx
// This works in a Server Component — no "use client" needed
export default function SearchPage() {
  return (
    <form
      toolname="search_releases"
      tooldescription="Search music releases"
      toolautosubmit="true"
      action="/api/search"
      method="GET"
    >
      <input
        name="q"
        type="text"
        required
        toolparamtitle="Query"
        toolparamdescription="Search term"
      />
      <button type="submit">Search</button>
    </form>
  );
}
```

**Note**: TypeScript will show errors for non-standard HTML attributes. Add type declarations:

```typescript
// src/types/webmcp.d.ts
declare module 'react' {
  interface FormHTMLAttributes<T> {
    toolname?: string;
    tooldescription?: string;
    toolautosubmit?: string;
  }
  interface InputHTMLAttributes<T> {
    toolparamtitle?: string;
    toolparamdescription?: string;
  }
  interface SelectHTMLAttributes<T> {
    toolparamtitle?: string;
    toolparamdescription?: string;
  }
  interface TextareaHTMLAttributes<T> {
    toolparamtitle?: string;
    toolparamdescription?: string;
  }
}
```
