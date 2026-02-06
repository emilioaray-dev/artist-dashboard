# Research: Internationalization (i18n)

**Feature**: 002-i18n-multi-language
**Date**: 2026-02-06

## Decision 1: i18n Library

**Decision**: next-intl v4.x

**Rationale**:
- Industry standard for Next.js App Router (~1.5M weekly npm downloads, 3k+ GitHub stars)
- Confirmed Next.js 16 support including `proxy.ts` rename (documented in official docs)
- Full feature set: translations (ICU message syntax), date/time formatting, number/currency formatting, locale-based routing, Server + Client Component support, static rendering
- `localePrefix: 'as-needed'` supports English at root, other languages prefixed
- Automatic locale detection via cookie → Accept-Language header → default fallback
- Type-safe translations available

**Alternatives considered**:

| Library | Rejected Because |
| --- | --- |
| next-international | Smaller community (1.4k stars), no date/number/currency formatting, no ICU support, no confirmed Next.js 16/proxy.ts compatibility, last release Oct 2024 |
| react-i18next | Not designed for App Router Server Components, requires more manual setup for routing |
| Built-in Next.js i18n | Only supports Pages Router, explicitly removed from App Router |
| lingui | Smaller ecosystem for Next.js, less documentation for App Router pattern |

## Decision 2: URL Routing Strategy

**Decision**: Path prefix with `localePrefix: 'as-needed'`

**Rationale**:
- SEO-friendly: each locale has its own URL, indexable by search engines
- Shareable: users can share links in a specific language
- next-intl native support via `defineRouting({ localePrefix: 'as-needed' })`
- English at root (`/releases`) — no `/en/` prefix for the default language
- Other languages prefixed (`/es/releases`, `/fr/fans`, `/pt/settings`)
- `/en/releases` automatically redirects to `/releases`

**Alternatives considered**:

| Strategy | Rejected Because |
| --- | --- |
| No URL change (cookie/localStorage only) | Not SEO-friendly, not shareable, poor UX for bookmarking |
| Query parameter (`?lang=es`) | Less clean URLs, poorer SEO, non-standard pattern |
| Subdomain (`es.example.com`) | Requires DNS configuration, overkill for 4 languages |

## Decision 3: Next.js 16 Middleware → Proxy

**Decision**: Use `src/proxy.ts` (not `middleware.ts`)

**Rationale**:
- Next.js 16 renamed `middleware.ts` → `proxy.ts`
- Runs on Node.js runtime (not Edge) in Next.js 16
- next-intl's `createMiddleware()` is compatible with `proxy.ts` (default export works)
- No existing middleware.ts in the project, so this is a clean addition

## Decision 4: Translation File Organization

**Decision**: Single JSON file per locale at project root (`messages/{locale}.json`)

**Rationale**:
- Simplest approach for 4 pages with ~150-200 keys per language
- next-intl's default pattern: `messages/en.json`, `messages/es.json`, etc.
- Namespaced within each file (Navigation, Dashboard, Releases, Fans, Settings, Common, Errors)
- Can be split into per-namespace files later if translations grow significantly

**Alternatives considered**:

| Strategy | Rejected Because |
| --- | --- |
| One file per namespace per locale (`messages/en/navigation.json`) | Unnecessary complexity for ~200 keys, more import boilerplate |
| Database-driven translations | Overkill for static content, adds runtime dependency |
| External translation service (Crowdin, Lokalise) | Out of scope, no ongoing translation workflow needed |

## Decision 5: Language Selector Component

**Decision**: Compact dropdown in sidebar showing current locale code (e.g., "EN ▾")

**Rationale**:
- Minimal sidebar footprint
- Widely recognized pattern for language switching
- Expands to show all 4 options with native names (English, Espanol, Francais, Portugues)
- On mobile: accessible from navigation area
- Uses next-intl's `useRouter()` with `router.replace(pathname, { locale })` for client-side locale switching

## Decision 6: Server vs Client Component Translation Strategy

**Decision**: Translate in Server Components, pass strings as props to Client Components where possible

**Rationale**:
- Zero client bundle impact for translations done server-side
- Client Components that need dynamic translation (charts with interactive tooltips, language switcher) use `useTranslations()` directly
- `useFormatter()` needed in Client Components for dynamic date/number/currency formatting (e.g., RevenueChart tooltip values)
- `NextIntlClientProvider` automatically provides messages to Client Components without manual prop drilling
