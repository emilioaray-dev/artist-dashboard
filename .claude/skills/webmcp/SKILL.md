---
name: webmcp
description: WebMCP (Web Model Context Protocol) integration guide — register browser-native tools via navigator.modelContext so AI agents can interact with the artist dashboard. Covers imperative API, declarative forms, React hooks, and Next.js App Router patterns.
user-invocable: true
---

# WebMCP Integration Guide

Apply these rules when adding, modifying, or reviewing WebMCP tool registrations in this project.

## Overview

See [overview.md](./overview.md) for:

- What WebMCP is and how it works
- Relationship to Anthropic's MCP
- Browser requirements (Chrome 146+, Secure Context)
- Key constraints (max 50 tools per page, sequential execution, top-level browsing context only)

## Imperative API

See [imperative-api.md](./imperative-api.md) for:

- `navigator.modelContext` interface (registerTool, unregisterTool, provideContext, clearContext)
- `ModelContextTool` dictionary (name, description, inputSchema, execute, annotations)
- `ModelContextClient.requestUserInteraction()` for user confirmation
- `SubmitEvent.agentInvoked` detection
- `ToolAnnotations` (readOnlyHint, idempotentHint, destructiveHint)

## React Hooks

See [react-hooks.md](./react-hooks.md) for:

- `@mcp-b/react-webmcp` package
- `useWebMCP()` hook for tool registration
- `useWebMCPContext()` hook for read-only context
- State management (isExecuting, lastResult, error)
- Next.js App Router patterns ("use client" requirement)

## Declarative Forms

See [declarative-forms.md](./declarative-forms.md) for:

- HTML form attributes: `toolname`, `tooldescription`, `toolautosubmit`
- Input attributes: `toolparamtitle`, `toolparamdescription`
- CSS pseudo-classes: `:tool-form-active`, `:tool-submit-active`
- Zero-JavaScript approach for simple tools

## Project Integration

See [project-tools.md](./project-tools.md) for:

- Complete list of tools for this artist dashboard project
- Tool definitions mapped to existing API routes
- WebMCP provider component architecture
- File placement and component structure

## Testing

See [testing.md](./testing.md) for:

- Chrome DevTools WebMCP panel
- Model Context Tool Inspector extension
- Polyfill setup for unit tests
- E2E testing with Playwright
