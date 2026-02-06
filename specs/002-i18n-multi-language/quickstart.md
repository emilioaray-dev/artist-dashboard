# Quickstart: Internationalization (i18n)

**Feature**: 002-i18n-multi-language
**Date**: 2026-02-06

## Prerequisites

- Node.js 18+
- Project cloned and dependencies installed (`npm install`)
- Branch: `feature/002-i18n-multi-language`

## Setup

```bash
# Install i18n dependency
npm install next-intl
```

## Integration Scenarios

### Scenario 1: Default Language (English)

1. Visit `http://localhost:3000/`
2. All UI text displays in English
3. URL has no locale prefix
4. Dates formatted as "Feb 6, 2026"
5. Numbers formatted as "12,400"
6. Currency formatted as "$12,400.50"

### Scenario 2: Browser Language Detection

1. Set browser language to Spanish (`es`)
2. Visit `http://localhost:3000/` for the first time (no cookie set)
3. Proxy detects `Accept-Language: es` header
4. Redirects to `http://localhost:3000/es/`
5. All UI text displays in Spanish
6. `NEXT_LOCALE=es` cookie is set

### Scenario 3: Manual Language Switch

1. Visit `http://localhost:3000/` (English)
2. Click the language dropdown in the sidebar ("EN ▾")
3. Select "Francais"
4. URL changes to `http://localhost:3000/fr/`
5. All UI text updates to French without full page reload
6. Refresh page → still in French (cookie persisted)

### Scenario 4: Localized Formatting

1. Visit `http://localhost:3000/fr/`
2. Revenue chart X-axis shows "6 fevr.", "7 fevr." (French dates)
3. Metric cards show "12 400" (French thousand separator)
4. Currency shows "12 400,50 $US" (French currency format)

### Scenario 5: Unsupported Language Fallback

1. Set browser language to Japanese (`ja`)
2. Visit `http://localhost:3000/` for the first time
3. No redirect occurs — defaults to English at root
4. All text in English

### Scenario 6: Settings Page Language Preference

1. Visit `http://localhost:3000/settings`
2. See "Language" dropdown in Preferences card
3. Select "Portugues"
4. URL changes to `http://localhost:3000/pt/settings`
5. Settings page labels now in Portuguese
6. Navigate to other pages → all in Portuguese

## Verification Checklist

```bash
# Build verification (all 4 locale variants should generate)
npm run build

# Expected output should show:
# ○ /[locale]              (4 variants: en, es, fr, pt)
# ○ /[locale]/fans
# ○ /[locale]/releases
# ○ /[locale]/settings

# Unit tests
npm test

# E2E tests (requires dev server on port 3000)
npx playwright test
```

## Test Cases

### Unit Tests

| Test | Description |
| --- | --- |
| Language dropdown renders | Selector shows current locale code, expands to 4 options |
| Translation fallback | Missing key falls back to English string |
| Locale detection priority | URL > cookie > Accept-Language > default |
| Format helpers | Currency/date/number format correctly per locale |

### E2E Tests

| Test | Description |
| --- | --- |
| Default language loads | Visit `/` → English UI |
| Language switch via dropdown | Click selector → choose Spanish → URL updates to `/es/`, all text Spanish |
| Persistence across pages | Switch to French → navigate to Releases → still French |
| Persistence across sessions | Switch to Portuguese → reload → still Portuguese |
| Settings language dropdown | Change language in Settings → same effect as sidebar selector |
| Chart formatting | Revenue chart in French shows French date/number formatting |
