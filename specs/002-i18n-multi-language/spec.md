# Feature Specification: Internationalization (i18n)

**Feature Branch**: `feature/002-i18n-multi-language`
**Created**: 2026-02-06
**Status**: Draft
**Input**: User description: "Add multi-language support to the artist dashboard with English, Spanish, French, and Portuguese. All UI text is currently hardcoded in English. Implement i18n to support 4 languages: en, es, fr, pt. Includes all UI text, labels, navigation, metrics, charts, settings, error messages, and date/currency formatting per locale. Default language is English. Users can switch languages from settings or a language selector in the sidebar."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Browse Dashboard in Preferred Language (Priority: P1)

An artist whose primary language is Spanish opens the dashboard. The system detects their browser language preference and displays the entire UI in Spanish — navigation labels, metric titles, chart labels, button text, and page headings. All content is readable and correctly translated without broken layouts or truncated text.

**Why this priority**: Core value proposition — without translated UI content, the feature has no purpose. This covers the bulk of translation work across all 4 pages.

**Independent Test**: Set browser language to `es`, load any page → all visible UI text appears in Spanish. Repeat for `fr` and `pt`.

**Acceptance Scenarios**:

1. **Given** a user with browser language set to `es`, **When** they visit the dashboard for the first time, **Then** all UI text displays in Spanish
2. **Given** a user viewing the dashboard in French, **When** they navigate between Overview, Releases, Fans, and Settings pages, **Then** every page displays French text consistently
3. **Given** a user with browser language set to `ja` (unsupported), **When** they visit the dashboard, **Then** the UI defaults to English

---

### User Story 2 - Switch Language Manually (Priority: P1)

An artist wants to switch from English to Portuguese. They click a compact language dropdown in the sidebar (desktop) — displayed as a language code like "EN ▾" — and select "Portugues" from the expanded list showing native language names. The URL updates to include the language prefix (e.g., `/pt/releases`) and the entire UI updates immediately. Their preference persists across sessions. On mobile, the language dropdown is accessible from the navigation area.

**Why this priority**: Users must be able to override browser detection. Without manual switching, users on shared devices or with misconfigured browsers cannot access their preferred language.

**Independent Test**: Click language selector → choose Portuguese → all text updates to Portuguese. Refresh page → Portuguese persists.

**Acceptance Scenarios**:

1. **Given** a user viewing the dashboard in English, **When** they select "Portugues" from the language selector, **Then** all UI text updates to Portuguese without full page reload
2. **Given** a user who previously selected French, **When** they close and reopen the browser, **Then** the dashboard loads in French
3. **Given** a user on mobile, **When** they access the language selector, **Then** it is reachable and usable without obstructing navigation

---

### User Story 3 - View Localized Dates, Numbers, and Currency (Priority: P2)

An artist viewing the dashboard in French sees dates formatted as "6 fevr. 2026" instead of "Feb 6, 2026", numbers with spaces as thousand separators (12 400 instead of 12,400), and currency formatted as "1 234,56 $US". All locale-specific formatting adapts automatically when the language changes.

**Why this priority**: Incorrect formatting undermines trust in data accuracy. Artists making financial decisions need numbers and currency presented in their expected format.

**Independent Test**: Switch to French → verify date on chart X-axis uses French month abbreviations, revenue values use French number formatting, metric cards show localized numbers.

**Acceptance Scenarios**:

1. **Given** a user viewing in Spanish, **When** they look at the Revenue chart, **Then** dates on the X-axis display Spanish month abbreviations (ene, feb, mar...)
2. **Given** a user viewing in Portuguese, **When** they look at metric cards, **Then** currency values use Portuguese formatting with comma as decimal separator
3. **Given** a user switches from English to French, **When** the fan count shows "12,400" in English, **Then** it displays "12 400" in French

---

### User Story 4 - Settings Page Language Preference (Priority: P3)

An artist visits the Settings page and sees a "Language" preference alongside the existing Theme preference. They can select their preferred language from a dropdown. This setting is the authoritative source for language preference, overriding browser detection.

**Why this priority**: Provides a discoverable, standard location for language configuration. Complements the quick-access sidebar selector.

**Independent Test**: Navigate to Settings → change language dropdown → UI updates and preference persists.

**Acceptance Scenarios**:

1. **Given** a user on the Settings page, **When** they see the Preferences card, **Then** a Language dropdown is visible with options: English, Espanol, Francais, Portugues
2. **Given** a user selects "Francais" in Settings, **When** the page updates, **Then** the Settings page itself displays in French including the language option labels

---

### Edge Cases

- What happens when a translation key is missing for a specific language? The system falls back to the English string.
- How does the system handle right-to-left (RTL) languages? Not in scope for this feature (only LTR languages supported: en, es, fr, pt).
- What happens to chart tooltip content when language changes? Tooltips update to reflect the selected language formatting for dates, numbers, and currency.
- How are pluralization rules handled across languages? The i18n solution must support ICU plural rules (e.g., Spanish "1 fan" vs "2 fans", French "0 fan" vs "2 fans").
- What happens if the NEXT_LOCALE cookie is unavailable? The system falls back to browser language detection (Accept-Language header), then to English.

## Clarifications

### Session 2026-02-06

- Q: What format should the language selector use in the sidebar? → A: Compact dropdown showing current language code (e.g., "EN ▾") expanding to native names
- Q: Should language selection affect the URL? → A: URL path prefix (`/es/releases`, `/fr/fans`). English as default at root (`/releases`)

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST support 4 languages: English (en), Spanish (es), French (fr), and Portuguese (pt)
- **FR-002**: System MUST detect the user's browser language on first visit and apply the closest supported language (or default to English)
- **FR-003**: System MUST provide a compact language dropdown (showing current code, e.g., "EN ▾") in the sidebar on desktop and in the navigation area on mobile, expanding to show all 4 languages by native name
- **FR-004**: System MUST persist the user's language preference across browser sessions
- **FR-005**: System MUST translate all static UI text: navigation labels, page headings, subheadings, button text, empty states, error messages, and placeholder text
- **FR-006**: System MUST translate metric card labels (e.g., "Total Revenue", "Total Fans", "Active Buyers", "Engagement Rate")
- **FR-007**: System MUST translate chart labels, legends, and tooltip headers
- **FR-008**: System MUST format dates according to the selected locale (month names, date order)
- **FR-009**: System MUST format numbers according to the selected locale (thousand separators, decimal separators)
- **FR-010**: System MUST format currency values according to the selected locale
- **FR-011**: System MUST update all visible text when the user switches language without requiring a full page reload
- **FR-018**: System MUST use URL path prefixes for non-default languages (`/es/`, `/fr/`, `/pt/`), with English served at the root path (`/`)
- **FR-019**: System MUST redirect users to the appropriate language-prefixed URL based on their detected or stored preference on first visit
- **FR-012**: System MUST fall back to English for any missing translation key
- **FR-013**: System MUST include a Language preference in the Settings page alongside existing preferences
- **FR-014**: System MUST support pluralization rules appropriate to each language
- **FR-015**: System MUST maintain responsive layouts across all languages (text may be longer in some languages)
- **FR-016**: System MUST translate the Settings page form labels (Account Information, Preferences, Email, Display Name, etc.)
- **FR-017**: System MUST display each language's native name in the selector (e.g., "Espanol" not "Spanish")

### Key Entities

- **Locale**: Represents a supported language configuration — includes language code (en/es/fr/pt), display name in native language, date/number/currency formatting rules
- **Translation Namespace**: A logical group of translation strings organized by feature area (common, navigation, overview, releases, fans, settings, errors)
- **User Language Preference**: The user's selected language, persisted locally, with priority over browser detection

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% of visible UI text across all 4 pages is translated in all 4 supported languages
- **SC-002**: Language switching completes in under 500ms with no visible layout shift
- **SC-003**: Date, number, and currency formatting matches each locale's standard conventions on all metric cards and charts
- **SC-004**: Language preference persists across browser sessions with 100% reliability
- **SC-005**: No text truncation or layout breakage when switching between any of the 4 supported languages
- **SC-006**: Existing unit tests continue to pass (56/56) after i18n integration
- **SC-007**: Build completes successfully with no errors after i18n integration

## Assumptions

- All translations will be provided as static JSON/message files (no external translation service or API)
- Currency values are displayed in USD across all locales (only formatting changes, not currency conversion)
- The language selector is a compact dropdown showing current language code (e.g., "EN ▾") expanding to native names
- English is the default language served at the root URL; other languages use path prefixes (`/es/`, `/fr/`, `/pt/`)
- Mock data content (artist names, release titles, fan names) remains in English — only UI chrome is translated
- Browser language detection uses the `Accept-Language` header or `navigator.language`
