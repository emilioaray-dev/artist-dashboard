#!/bin/bash
# PostToolUse hook: auto-format + lint fix on every file Write/Edit
# Runs Prettier and ESLint --fix on the changed file

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Skip if no file path
if [[ -z "$FILE_PATH" || ! -f "$FILE_PATH" ]]; then
  exit 0
fi

# Only process source files
if [[ ! "$FILE_PATH" =~ \.(ts|tsx|js|jsx|json|css|md)$ ]]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# Run Prettier --write
PRETTIER_OUTPUT=$(npx prettier --write "$FILE_PATH" 2>&1) || {
  echo "Prettier failed on $FILE_PATH:" >&2
  echo "$PRETTIER_OUTPUT" >&2
  exit 2
}

# Run ESLint --fix (only on JS/TS files)
if [[ "$FILE_PATH" =~ \.(ts|tsx|js|jsx)$ ]]; then
  ESLINT_OUTPUT=$(npx eslint --fix "$FILE_PATH" 2>&1) || {
    echo "ESLint errors in $FILE_PATH (auto-fix could not resolve all issues):" >&2
    echo "$ESLINT_OUTPUT" >&2
    exit 2
  }
fi

exit 0
