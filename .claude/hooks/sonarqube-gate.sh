#!/bin/bash
# Stop hook: verify SonarQube quality gate and zero open issues
# Uses SonarQube Web API directly via curl

set -uo pipefail

# Load .env if vars not already in environment
if [[ -z "${SONARQUBE_URL:-}" || -z "${SONARQUBE_TOKEN:-}" ]]; then
  ENV_FILE="$CLAUDE_PROJECT_DIR/.env"
  if [[ -f "$ENV_FILE" ]]; then
    set -a
    source "$ENV_FILE"
    set +a
  fi
fi

SONAR_URL="${SONARQUBE_URL:?Missing SONARQUBE_URL env var}"
SONAR_TOKEN="${SONARQUBE_TOKEN:?Missing SONARQUBE_TOKEN env var}"
PROJECT_KEY="artist-dashboard"

# 1. Check Quality Gate status
QG_RESPONSE=$(curl -s -u "${SONAR_TOKEN}:" \
  "${SONAR_URL}/api/qualitygates/project_status?projectKey=${PROJECT_KEY}" 2>&1)

QG_STATUS=$(echo "$QG_RESPONSE" | jq -r '.projectStatus.status // empty')

if [[ -z "$QG_STATUS" ]]; then
  echo "SonarQube: Could not reach server or parse response" >&2
  echo "$QG_RESPONSE" >&2
  exit 2
fi

if [[ "$QG_STATUS" != "OK" ]]; then
  echo "SonarQube Quality Gate FAILED (status: $QG_STATUS)" >&2
  echo "$QG_RESPONSE" | jq '.projectStatus.conditions[] | select(.status != "OK")' >&2
  exit 2
fi

# 2. Check for open issues (OPEN, CONFIRMED, REOPENED)
ISSUES_RESPONSE=$(curl -s -u "${SONAR_TOKEN}:" \
  "${SONAR_URL}/api/issues/search?projects=${PROJECT_KEY}&statuses=OPEN,CONFIRMED,REOPENED&ps=1" 2>&1)

OPEN_COUNT=$(echo "$ISSUES_RESPONSE" | jq -r '.paging.total // 0')

if [[ "$OPEN_COUNT" -gt 0 ]]; then
  # Fetch details of open issues
  DETAILS=$(curl -s -u "${SONAR_TOKEN}:" \
    "${SONAR_URL}/api/issues/search?projects=${PROJECT_KEY}&statuses=OPEN,CONFIRMED,REOPENED&ps=20" 2>&1)

  echo "SonarQube: $OPEN_COUNT open issue(s) found. Fix ALL before finishing:" >&2
  echo "$DETAILS" | jq -r '.issues[] | "  [\(.severity)] \(.component):\(.textRange.startLine) - \(.message)"' >&2
  exit 2
fi

echo "SonarQube: Quality Gate OK, 0 open issues" >&2
exit 0
