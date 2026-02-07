# ADR-001: Tailwind v4 HSL Color System with Direct Variable Binding

**Status:** Accepted
**Date:** 2026-02-05
**Authors:** Celsius Aray

## Context

The artist dashboard uses Tailwind CSS v4, which introduced the `@theme inline` directive to register design tokens. Our initial approach used **oklch** values for color variables (inherited from shadcn/ui scaffold), and the prototype we were matching used **Tailwind v3** with space-separated HSL values (`42 100% 50%`).

During the UI/UX redesign (Feature 004), we needed to migrate to a blue-grey dark base (`hsl(220, 15%, 8%)`) with a golden accent (`hsl(42, 100%, 50%)`). We encountered a critical Tailwind v4 constraint:

**`@theme inline` with `var()` indirection works, but only if `:root` variable names don't collide with Tailwind's internal theme namespace.** For example, `--color-primary: var(--primary)` works because `--primary` (user-defined) and `--color-primary` (Tailwind's theme key) are distinct. However, defining something like `--color-primary: oklch(0.769 0.174 70.7)` directly in `@theme inline` would bypass the `:root` layer entirely and break dark mode overrides.

### Options Considered

1. **oklch values directly in `@theme inline`** — Simple but no `:root` override for dark mode or runtime theming.
2. **HSL values in `:root` with `var()` bridge in `@theme inline`** — Full flexibility, runtime-overridable, compatible with shadcn/ui pattern.
3. **Tailwind v3 downgrade** — Would match prototype but lose v4 performance benefits and require significant migration.

## Decision

Use **Option 2**: Define all color tokens as `hsl()` values in `:root`, bridged to Tailwind via `@theme inline { --color-primary: var(--primary); }`. This gives us:

- A single `:root` block as the source of truth for all colors
- `.dark` class override compatibility (required by shadcn/ui)
- Runtime theming capability via CSS custom properties
- Full HSL color system with the prototype's blue-grey dark aesthetic

The complete token set includes base surfaces (`--background`, `--card`, `--popover`), semantic colors (`--success`, `--destructive`, `--positive`, `--negative`), interaction states (`--card-hover-border`, `--card-hover-glow`), and sidebar-specific tokens.

## Consequences

- **Positive:** Full dark mode support with a single `:root` definition; future light mode would only require adding a new `:root` block without touching `@theme inline`; all shadcn/ui components inherit tokens automatically.
- **Negative:** The `var()` indirection adds a layer of abstraction that may confuse developers unfamiliar with Tailwind v4's theme resolution. Colors like `bg-primary` resolve through two CSS variable lookups at runtime.
- **Lesson learned:** oklch → HSL migration was necessary because the prototype's visual language was designed in HSL. Converting between color spaces introduced subtle perceptual differences that were difficult to match.

### Key Files

- `src/app/globals.css` — All CSS custom properties and `@theme inline` bridge
- `src/lib/constants/theme.ts` — TypeScript mirror of design tokens for programmatic access
