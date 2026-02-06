# Artist Dashboard - Roadmap

## Completed

- [x] Feature 001: Artist Dashboard (overview, releases, fans, settings)
- [x] Folder architecture restructuring (8 phases, PR #2 merged)
- [x] Speckit: Feature 002 - i18n Multi-Language (`feature/002-i18n-multi-language` branch pushed)

## Speckit Pending

- [ ] **Speckit: Feature 003 - Landing Page with Try Demo**
  - Branch: `feature/003-landing-page`
  - Steps: specify → clarify → plan → tasks → analyze → commit → push
  - Description: Landing page with Try Demo button pointing to deployed dashboard

- [ ] **Speckit: Feature 004 - GitHub Actions CI/CD**
  - Branch: `feature/004-github-actions-cicd`
  - Steps: specify → clarify → plan → tasks → analyze → commit → push
  - Description: CI/CD pipeline for build/test validation on push and PR

## Implementation Pending

- [ ] **Implement Feature 002 - i18n Multi-Language**
  - Branch: `feature/002-i18n-multi-language`
  - 58 tasks across 7 phases (spec ready)
  - Phase 1: Setup (next-intl, i18n config)
  - Phase 2: Foundational (page migration under `[locale]/`)
  - Phase 3: US1 - Translate all UI text (P1)
  - Phase 4: US2 - Language selector dropdown (P1)
  - Phase 5: US3 - Locale-aware formatting (P2)
  - Phase 6: US4 - Settings language preference (P3)
  - Phase 7: Polish & verification
  - PR to main when complete

- [ ] **Implement Feature 003 - Landing Page**
  - Blocked by: Speckit 003 completion
  - PR to main when complete

- [ ] **Implement Feature 004 - GitHub Actions CI/CD**
  - Blocked by: Speckit 004 completion
  - PR to main when complete

## Execution Order

```
1. Speckit 003 (Landing Page)          ← next
2. Speckit 004 (CI/CD)
3. Implement 002 (i18n)                ← speckit ready
4. Implement 003 (Landing Page)
5. Implement 004 (CI/CD)
```

## Notes

- Each speckit must run from its own feature branch (e.g., `feature/003-landing-page`)
- Switch to `main` before creating a new feature branch with `/speckit.specify`
- All speckit artifacts committed in a single commit per feature branch
- PR to main only when implementation is complete and verified
- Never push to main without explicit permission
