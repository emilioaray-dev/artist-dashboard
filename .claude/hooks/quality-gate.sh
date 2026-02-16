#!/bin/bash
# Stop hook: full quality gate — lint, unit tests, e2e tests, build
# Blocks Claude from finishing if ANY check fails

set -uo pipefail

cd "$CLAUDE_PROJECT_DIR"

ERRORS=""

# 1. ESLint (no warnings allowed)
echo "Running ESLint..." >&2
LINT_OUTPUT=$(npm run lint 2>&1)
LINT_EXIT=$?
if [[ $LINT_EXIT -ne 0 ]]; then
  ERRORS+="--- LINT ERRORS ---\n$LINT_OUTPUT\n\n"
fi

# 2. Unit tests (vitest)
echo "Running unit tests..." >&2
UNIT_OUTPUT=$(npx vitest run 2>&1)
UNIT_EXIT=$?
if [[ $UNIT_EXIT -ne 0 ]]; then
  ERRORS+="--- UNIT TEST FAILURES ---\n$UNIT_OUTPUT\n\n"
fi

# 3. E2E tests (Playwright)
echo "Running Playwright E2E tests..." >&2
E2E_OUTPUT=$(npx playwright test 2>&1)
E2E_EXIT=$?
if [[ $E2E_EXIT -ne 0 ]]; then
  ERRORS+="--- E2E TEST FAILURES ---\n$E2E_OUTPUT\n\n"
fi

# 4. Production build (no errors or warnings)
echo "Running production build..." >&2
BUILD_OUTPUT=$(npm run build 2>&1)
BUILD_EXIT=$?
if [[ $BUILD_EXIT -ne 0 ]]; then
  ERRORS+="--- BUILD ERRORS ---\n$BUILD_OUTPUT\n\n"
fi

# Report results
if [[ -n "$ERRORS" ]]; then
  echo -e "Quality gate FAILED. Fix ALL issues before finishing:\n\n$ERRORS" >&2
  exit 2
fi

exit 0
