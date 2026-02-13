# WebMCP Overview

## What is WebMCP?

WebMCP (Web Model Context Protocol) is a W3C Draft Community Group Report (Feb 2026) that adds `navigator.modelContext` to browsers. It lets websites register structured, callable **tools** that AI agents can discover and invoke — replacing DOM scraping with explicit, typed API surfaces.

- **Developed by**: Google + Microsoft, incubated via W3C Web Machine Learning CG
- **Status**: Early preview in Chrome 146 Canary (Feb 2026)
- **Spec**: https://webmachinelearning.github.io/webmcp/
- **GitHub**: https://github.com/webmachinelearning/webmcp

## WebMCP vs Anthropic MCP

| Aspect | Anthropic MCP | WebMCP |
|--------|--------------|--------|
| Runs where | Backend servers | Client-side in browser |
| Transport | JSON-RPC over stdio/SSE/HTTP | In-process JavaScript calls |
| Auth | Server-managed OAuth/API keys | Inherits browser session |
| Discovery | `.well-known/mcp/server-card.json` | Agent lands on page, reads registered tools |
| User presence | Not required | Required (visible browsing context) |
| Complementary | Yes — same site can have both |

## Browser Requirements

- **Chrome 146+** (Canary available now, stable ~March 2026)
- **Flag**: `chrome://flags` → "Experimental Web Platform Features" → Enable
- **Secure Context**: HTTPS required (`localhost` exempt for dev)
- **Top-level only**: iframes cannot be model context providers

## Key Constraints

- **Max ~50 tools per page** (spec recommendation to prevent agent overwhelm)
- **Sequential execution**: tool calls run one at a time
- **No headless**: user must be present in visible tab
- **`requestUserInteraction()`**: pause agent for user confirmation on sensitive ops

## Performance

~67% reduction in computational overhead vs traditional visual agent-browser interactions (screen scraping, DOM parsing, simulated clicks).
