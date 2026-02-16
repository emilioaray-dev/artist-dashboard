# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-02-16

### Added

- **AudioPlayer Track Link**: Navigation icon next to track title in the floating player bar, linking to the release detail page; hidden when already on that page
- **404 Redirect**: Middleware validates routes and redirects invalid paths back to referrer or home instead of showing a 404 page
- **Go Back Button**: Client-side back navigation button on the not-found page as fallback
- **Vercel Silent Mode**: `vercel.json` with `github.silent: true` to suppress PR deployment checks

### Fixed

- **CI Job Ordering**: E2E tests now depend on lint and unit tests passing first (`needs: [lint, unit-tests]`)

## [1.0.0] - 2026-02-16

### Added

- **WebMCP Discovery**: `/.well-known/mcp.json` manifest endpoint for AI agent tool discovery
- **MCP Meta Tag**: `<meta name="mcp-server">` on every page so agents can detect MCP support from HTML
- **Server-Side MCP Endpoint**: `POST /api/mcp` for non-browser clients to invoke read-only tools (releases, sales, engagement, fans, locales)
- **MCP Manifest Module**: Shared tool definitions in `src/lib/mcp-manifest.ts` as single source of truth
- **i18n Support**: Full internationalization with 4 locales (English, Spanish, French, Portuguese)
- **Dashboard Pages**: Overview, Releases, Fans, Settings with real-time data visualization
- **Landing Page**: Marketing landing with hero, features, and demo CTA
- **Audio Player**: Persistent audio playback across locale changes with Zustand store
- **WebMCP Tools**: 14 AI-accessible tools across dashboard and landing contexts
- **Responsive Design**: Mobile-first layout with bottom navigation and sidebar
- **CI Pipeline**: GitHub Actions with lint, unit tests (Vitest), E2E tests (Playwright), and coverage upload

### Changed

- **Frictionless Playback**: `play_track` and `navigate_and_play` tools now execute immediately without confirmation dialogs
- **Tool Descriptions**: Updated to remove "Requires user confirmation" text

### Removed

- Confirmation dialog translation keys (`playConfirmation`, `playDeclined`, `navigateAndPlayConfirmation`, `userDeclined`) from all locale files

### Fixed

- **Security**: Override `@modelcontextprotocol/sdk` to 1.26.0 to fix cross-client data leak (GHSA-345p-7cg4-v4c7)
- **Security**: Update `qs` to 6.14.2 to fix DoS via arrayLimit bypass (GHSA-w7fw-mjwx-w883)
- **CI**: Add `--coverage` flag to vitest in CI workflow to generate coverage artifacts
- **Tests**: Add `teardownTimeout` to vitest config to prevent worker crash

### Security

- 0 npm audit vulnerabilities
