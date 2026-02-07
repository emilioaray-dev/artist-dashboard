# ADR-003: next-intl v4 for Internationalization with App Router

**Status:** Accepted
**Date:** 2026-02-05
**Authors:** Celsius Aray

## Context

The dashboard requires multi-language support (English, Spanish, French, Portuguese) for all UI text, dates, numbers, and currency formatting. Next.js 16 with the App Router introduces Server Components as the default, which constrains how i18n libraries can operate — translations must be available both on the server (for SSR/SSG) and on the client (for interactive components).

### Options Considered

1. **next-intl v4** — Purpose-built for Next.js App Router. Supports Server Components natively, provides `useTranslations()` (client) and `getTranslations()` (server), built-in locale routing with middleware, and ICU message format.
2. **react-i18next + i18next** — Most popular React i18n library. Mature ecosystem but requires manual hydration for Server Components, no built-in Next.js routing integration.
3. **next-translate** — Lightweight but limited App Router support at the time of evaluation.
4. **Custom solution with JSON + Context** — Full control but significant effort to replicate formatting, pluralization, routing, and SSR/SSG optimizations.

## Decision

Use **next-intl v4** with the following architecture:

### Locale Routing

- `localePrefix: "as-needed"` — English (default) has no prefix (`/`, `/releases`), other locales use prefixes (`/es/`, `/fr/releases`, `/pt/fans`)
- All pages live under `src/app/[locale]/` dynamic segment
- Middleware at `src/proxy.ts` handles locale detection from `Accept-Language` header and cookie persistence
- API routes (`/api/*`) are excluded from locale middleware via matcher pattern

### Translation Loading

- JSON message files per locale in `messages/{en,es,fr,pt}.json`
- Messages loaded server-side in `src/i18n/request.ts` via dynamic import
- `NextIntlClientProvider` in locale layout passes messages to client components
- `generateStaticParams()` pre-renders all locale variants at build time

### Navigation

- `createNavigation(routing)` exports locale-aware `Link`, `usePathname`, `useRouter`, `redirect`
- All internal links use `@/i18n/navigation` instead of `next/link` to preserve locale context

### Formatting

- Centralized number/date formats defined in `src/i18n/request.ts` (`currency`, `compact`, `percent`, `short`, `chartDate`)
- Utility functions in `src/lib/utils.ts` accept a `locale` parameter for server-side formatting

## Consequences

- **Positive:** Zero-config locale routing; Server Components get translations without client JS; static generation works for all locale variants; ICU message format supports pluralization and interpolation out of the box.
- **Negative:** `next-intl` is a single-vendor dependency — migration to another i18n library would require touching every component that uses `useTranslations()`. The `[locale]` dynamic segment adds a nesting level to the entire route tree.
- **Trade-off:** `localePrefix: "as-needed"` gives clean English URLs but means the default locale behaves differently from others in routing logic, which can cause subtle bugs in `usePathname()` comparisons.

### Key Files

- `src/i18n/routing.ts` — Locale list, default locale, prefix strategy
- `src/i18n/request.ts` — Per-request config, message loading, format definitions
- `src/i18n/navigation.ts` — Locale-aware navigation exports
- `src/proxy.ts` — Middleware for locale detection and routing
- `src/app/[locale]/layout.tsx` — `NextIntlClientProvider` with server-loaded messages
- `messages/*.json` — Translation files (en, es, fr, pt)
