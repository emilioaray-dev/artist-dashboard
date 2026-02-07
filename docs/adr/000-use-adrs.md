# ADR-000: Use Architecture Decision Records

**Status:** Accepted
**Date:** 2026-02-06
**Authors:** Celsius Aray

## Context

As the project grows beyond a single feature (dashboard MVP, i18n, UI/UX redesign, audio proxy), the number of implicit architectural decisions increases. New contributors — or future-us — will struggle to understand _why_ specific patterns were chosen without digging through git history and PRs.

We need a lightweight way to capture decisions that:

- Explains trade-offs, not just outcomes
- Lives in the repo alongside the code it describes
- Is immutable once accepted (superseded, not edited)

## Decision

Adopt Architecture Decision Records (ADRs) following the format popularized by Michael Nygard. Each ADR is a numbered markdown file in `docs/adr/` with sections: Context, Decision, Consequences.

Numbering is sequential (`001`, `002`, ...). A decision is never deleted — it is marked **Superseded by ADR-NNN** when replaced.

## Consequences

- **Positive:** Onboarding becomes faster; trade-off reasoning is preserved; code reviews can reference ADRs instead of re-debating decisions.
- **Negative:** Adds a small overhead to the development workflow (writing ~200 words per significant decision).
- **Neutral:** ADRs are not a substitute for inline code comments — they capture _system-level_ choices, not implementation details.
