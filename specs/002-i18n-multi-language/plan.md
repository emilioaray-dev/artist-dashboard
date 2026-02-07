# Implementation Plan: Internationalization (i18n)

**Branch**: `feature/002-i18n-multi-language` | **Date**: 2026-02-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-i18n-multi-language/spec.md`

## Summary

Add multi-language support (en, es, fr, pt) to the artist dashboard using next-intl with URL path prefix routing. English served at root (`/`), other languages at `/es/`, `/fr/`, `/pt/`. Includes translation of all UI text, locale-aware date/number/currency formatting, compact language dropdown in sidebar, and persistent language preference.

## Technical Context

**Language/Version**: TypeScript 5.x with React 19.2.3 + Next.js 16.1.6
**Primary Dependencies**: next-intl v4.x (i18n library with App Router + Server Component support)
**Storage**: Cookie (`NEXT_LOCALE` cookie managed by next-intl)
**Testing**: Vitest + React Testing Library (unit), Playwright (E2E)
**Target Platform**: Web (desktop + mobile responsive)
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: Language switching < 500ms, no layout shift on locale change
**Constraints**: 4 locales (en/es/fr/pt), LTR only, USD currency only (formatting varies by locale)
**Scale/Scope**: 4 pages, 8 translation namespaces, ~120-140 translation keys per language

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Constitution file contains template placeholders only (no project-specific principles defined). No gates to enforce. Proceeding.

## Project Structure

### Documentation (this feature)

```text
specs/002-i18n-multi-language/
├── plan.md              # This file
├── research.md          # Phase 0: Technology decision rationale
├── data-model.md        # Phase 1: Translation entities and structure
├── quickstart.md        # Phase 1: Integration scenarios and test cases
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (changes to existing repository)

```text
# New files
messages/                        # Translation files (project root)
├── en.json                      # English (default)
├── es.json                      # Spanish
├── fr.json                      # French
└── pt.json                      # Portuguese

src/
├── i18n/                        # i18n configuration
│   ├── routing.ts               # Locale routing config (locales, defaultLocale, prefix strategy)
│   ├── request.ts               # Per-request config (message loading, format definitions)
│   └── navigation.ts            # Locale-aware Link, redirect, usePathname, useRouter
├── proxy.ts                     # Locale detection & redirect (Next.js 16 replaces middleware.ts)
└── app/
    ├── [locale]/                # Dynamic locale segment (wraps all pages)
    │   ├── layout.tsx           # Locale layout (NextIntlClientProvider, html lang)
    │   ├── page.tsx             # Overview (moved from app/page.tsx)
    │   ├── _components/         # Home page streaming (moved from app/_components/)
    │   ├── fans/                # Fans route (moved from app/fans/)
    │   ├── releases/            # Releases route (moved from app/releases/)
    │   ├── settings/            # Settings route (moved from app/settings/)
    │   └── client-layout.tsx    # Client layout (moved from app/client-layout.tsx)
    ├── layout.tsx               # Root layout (minimal: fonts, globals.css only)
    └── globals.css              # Unchanged

# Modified files
next.config.ts                   # Add createNextIntlPlugin wrapper
src/components/layout/LanguageSelector.tsx  # New: compact language dropdown component
src/components/layout/Sidebar.tsx           # Add language dropdown, use translated labels
src/components/layout/MobileBottomNav.tsx   # Add language selector, use translated labels
src/components/ui/customs/cards/MetricCard.tsx      # Accept translated labels
src/components/ui/customs/charts/RevenueChart.tsx   # Locale-aware date/number formatting
src/components/ui/customs/charts/FanGrowthChart.tsx # Locale-aware formatting
src/components/ui/customs/lists/TopFans.tsx         # Locale-aware currency formatting
src/components/ui/customs/lists/RecentReleasesList.tsx # Locale-aware formatting
src/lib/utils.ts                 # Update formatCurrency/formatNumber to use locale
```

**Structure Decision**: All existing pages move under `src/app/[locale]/` to enable path-prefix routing. The root `src/app/layout.tsx` becomes a minimal shell (fonts, CSS). The real layout composition (sidebar, providers, audio player) lives in `src/app/[locale]/layout.tsx`. This follows the next-intl App Router pattern.

## Key Architecture Decisions

### 1. Page Migration Strategy

All routes move under `[locale]/`:

- `src/app/page.tsx` → `src/app/[locale]/page.tsx`
- `src/app/fans/` → `src/app/[locale]/fans/`
- `src/app/releases/` → `src/app/[locale]/releases/`
- `src/app/settings/` → `src/app/[locale]/settings/`
- `src/app/_components/` → `src/app/[locale]/_components/`
- `src/app/client-layout.tsx` → `src/app/[locale]/client-layout.tsx`
- Error/loading files move under `[locale]/` as well

### 2. Translation Strategy

- **Server Components**: Use `useTranslations()` (sync) or `getTranslations()` (async) — zero client bundle impact
- **Client Components**: Prefer passing pre-translated strings as props from Server Components. Use `useTranslations()` in Client Components only when dynamic translation is needed (e.g., language switcher)
- **Formatting**: Use `useFormatter()` / `getFormatter()` for dates, numbers, currency — automatically locale-aware

### 3. Locale Prefix Strategy

`localePrefix: 'as-needed'`:

- `/` → English (no prefix)
- `/es/fans` → Spanish
- `/fr/releases` → French
- `/pt/settings` → Portuguese
- `/en/fans` → redirects to `/fans` (removes superfluous prefix)

### 4. Static Rendering

`generateStaticParams()` in `[locale]/layout.tsx` generates all 4 locale variants at build time, maintaining the current static rendering behavior.

## Complexity Tracking

No constitution violations to justify.
