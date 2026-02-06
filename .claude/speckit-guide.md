# Speckit Workflow Guide

Best practices for using the speckit pipeline in this project.

## Workflow Order

```
/speckit.specify → /speckit.clarify → /speckit.plan → /speckit.tasks → /speckit.analyze → /speckit.implement
```

Each step builds on the previous. Do NOT skip steps unless explicitly noted.

## Step-by-Step

### 1. `/speckit.specify` — Feature Specification

**Creates**: `specs/NNN-feature/spec.md` + `checklists/requirements.md`

- Transforms natural language into formal spec
- Creates branch `feature/NNN-feature-name` (follow project convention)
- Focus on WHAT and WHY, never HOW (no tech stack, no code)
- Max 3 `[NEEDS CLARIFICATION]` markers
- User stories must be independently testable (each is a viable MVP slice)
- All requirements must be testable (Given/When/Then format)
- Success criteria must be measurable and technology-agnostic

### 2. `/speckit.clarify` — Resolve Ambiguities

**Updates**: `spec.md` (adds `## Clarifications` section)

- Max 5 questions, asked one at a time
- Each question has multiple-choice options with a recommended answer
- Answers are integrated directly into spec sections (not just appended)
- Skip if spec has zero `[NEEDS CLARIFICATION]` markers AND the feature scope is clear
- Run even without markers if user stories are ambiguous

### 3. `/speckit.plan` — Technical Implementation Plan

**Creates**: `plan.md`, `research.md`, `data-model.md`, `quickstart.md`, `contracts/`

Three phases:
- **Phase 0 (Research)**: Evaluate options, document decisions and rationale in `research.md`
- **Phase 1 (Design)**: Define entities (`data-model.md`), API contracts, integration scenarios (`quickstart.md`)
- **Phase 2 (Structure)**: Define project file organization, architecture decisions

### 4. `/speckit.tasks` — Task Breakdown

**Creates**: `tasks.md`

- Tasks organized by phase: Setup → Foundation → User Stories (P1→P2→P3) → Polish
- Strict format: `- [ ] T001 [P] [US1] Description with src/path/file.tsx`
- `[P]` = parallelizable (different files, no deps)
- `[US1]` = user story label for traceability
- Every phase ends with a checkpoint
- Every user story is independently testable at its checkpoint

### 5. `/speckit.analyze` — Consistency Check (Optional but Recommended)

**Output**: Markdown report (READ-ONLY, no file changes)

- Cross-checks spec ↔ plan ↔ tasks for gaps, duplicates, contradictions
- Validates constitution compliance
- Reports severity: CRITICAL > HIGH > MEDIUM > LOW
- Run before `/speckit.implement` to catch issues early

### 6. `/speckit.implement` — Execute Tasks

**Updates**: Source code + marks tasks `[x]` in `tasks.md`

- Follows phase order strictly
- Respects `[P]` parallel markers
- Stops at checkpoints to validate
- Marks each task complete as it finishes

## Commit Strategy

- **DO NOT commit after each step** — complete the full spec pipeline first (specify → clarify → plan → tasks)
- **Single commit** for all spec artifacts before implementation begins
- **Implementation commits** follow conventional commits (`feat`, `fix`, `test`, `docs`, etc.)
- Branch convention: `feature/NNN-short-name`

## Artifacts Summary

```
specs/NNN-feature-name/
├── spec.md              # WHAT and WHY (from /speckit.specify + /speckit.clarify)
├── plan.md              # HOW technically (from /speckit.plan)
├── research.md          # Decision rationale (from /speckit.plan Phase 0)
├── data-model.md        # Entity definitions (from /speckit.plan Phase 1)
├── quickstart.md        # Integration scenarios (from /speckit.plan Phase 1)
├── contracts/           # API specifications (from /speckit.plan Phase 1)
├── tasks.md             # Execution plan (from /speckit.tasks)
└── checklists/
    └── requirements.md  # Quality validation (from /speckit.specify)
```

## Key Rules

1. **spec.md** is for business stakeholders — no implementation details
2. **plan.md** is for developers — tech stack, architecture, file paths
3. **tasks.md** is for execution — exact files, exact actions, exact order
4. User stories are prioritized P1 > P2 > P3 — P1 is always the MVP
5. Every user story must be independently deployable and testable
6. Maximum 3 `[NEEDS CLARIFICATION]` in spec, maximum 5 questions in clarify
7. `/speckit.analyze` is read-only — it never modifies files
8. Follow the project branch convention: `feature/NNN-short-name`
