# Data Model: Internationalization (i18n)

**Feature**: 002-i18n-multi-language
**Date**: 2026-02-06

## Entities

### Locale

Represents a supported language configuration.

| Attribute | Type | Description |
| --- | --- | --- |
| code | string | ISO 639-1 language code: `en`, `es`, `fr`, `pt` |
| nativeName | string | Language name in its own script: "English", "Espanol", "Francais", "Portugues" |
| isDefault | boolean | Whether this is the default locale (true for `en`) |

**Supported locales**: `['en', 'es', 'fr', 'pt']`
**Default locale**: `en`

### Translation Messages

JSON structure organized by namespace. Each locale has one file at `messages/{locale}.json`.

**Namespaces**:

| Namespace | Scope | Approximate Keys |
| --- | --- | --- |
| Common | Shared UI text (loading, error, retry, save, cancel) | 15 |
| Navigation | Sidebar and mobile nav labels | 5 |
| Overview | Overview page headings, metric labels, chart titles | 25 |
| Releases | Releases page headings, card labels, status badges | 20 |
| Fans | Fans page headings, metric labels, fan list headers | 15 |
| Settings | Settings page form labels, preference labels | 20 |
| Errors | Error page messages, boundary fallbacks | 10 |
| Formats | Format descriptions (date ranges, time periods) | 10 |

**Total**: ~120-140 keys per locale, 4 locales = ~480-560 translation entries

### Format Definitions

Defined in `src/i18n/request.ts`, used by `useFormatter()` / `getFormatter()`.

| Format Name | Type | Example (en) | Example (es) |
| --- | --- | --- | --- |
| short (date) | dateTime | "Feb 6, 2026" | "6 feb 2026" |
| chartDate | dateTime | "Feb 6" | "6 feb" |
| currency | number | "$12,400.50" | "12.400,50 US$" |
| compact | number | "12.4K" | "12,4 mil" |
| percent | number | "85%" | "85 %" |

### User Language Preference

Managed automatically by next-intl via the `NEXT_LOCALE` cookie.

| Attribute | Type | Description |
| --- | --- | --- |
| locale | string | Selected locale code (en/es/fr/pt) |
| storage | cookie | `NEXT_LOCALE` cookie set by next-intl middleware |
| priority | ordered | 1. URL path prefix → 2. Cookie → 3. Accept-Language header → 4. Default (en) |

## Relationships

```
Locale (1) ──── has ──── (1) Translation Messages file
Locale (1) ──── defines ── (many) Format rules (date, number, currency)
User (1) ────── selects ── (1) Locale preference (stored in cookie)
Proxy ────────── detects ── (1) Locale per request (URL → cookie → header → default)
```

## State Transitions

### Locale Resolution Flow

```
Request arrives
    │
    ├── URL has locale prefix? (/es/fans)
    │   └── Yes → Use URL locale
    │
    ├── NEXT_LOCALE cookie set?
    │   └── Yes → Redirect to cookie locale path
    │
    ├── Accept-Language header matches supported locale?
    │   └── Yes → Redirect to matched locale path
    │
    └── Default → Serve English at root path
```

### Language Switch Flow

```
User clicks language dropdown
    │
    └── Selects new locale (e.g., "Espanol")
        │
        ├── Router replaces URL with new locale prefix
        │   (e.g., /fans → /es/fans)
        │
        ├── next-intl sets NEXT_LOCALE cookie
        │
        └── Page re-renders with new messages + formatting
```
