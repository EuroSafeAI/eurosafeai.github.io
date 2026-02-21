#!/usr/bin/env bash
# Generate a PDF certificate for every model in data/models.json.
# Each model is processed individually so one failure doesn't stop the rest.
#
# Usage:
#   bash scripts/generate-all-certificates.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
RESET='\033[0m'

MODELS_FILE="$ROOT/data/models.json"

if [[ ! -f "$MODELS_FILE" ]]; then
  echo -e "${RED}✗ data/models.json not found at $MODELS_FILE${RESET}" >&2
  exit 1
fi

# Extract all model IDs using node (already a dependency)
MODEL_IDS=$(node -e "
  const m = JSON.parse(require('fs').readFileSync('$MODELS_FILE', 'utf-8'))
  console.log(m.map(x => x.id).join('\n'))
")

TOTAL=$(echo "$MODEL_IDS" | wc -l | tr -d ' ')
PASSED=0
FAILED=0
FAILED_IDS=()

echo -e "${YELLOW}Generating certificates for $TOTAL model(s)…${RESET}"
echo ""

while IFS= read -r id; do
  if node "$SCRIPT_DIR/generate-certificates.mjs" "$id" 2>&1; then
    PASSED=$((PASSED + 1))
  else
    echo -e "${RED}✗ Failed: $id${RESET}"
    FAILED=$((FAILED + 1))
    FAILED_IDS+=("$id")
  fi
done <<< "$MODEL_IDS"

echo ""
echo "────────────────────────────────────"
echo -e "${GREEN}✓ $PASSED succeeded${RESET}  ${RED}✗ $FAILED failed${RESET}"

if [[ ${#FAILED_IDS[@]} -gt 0 ]]; then
  echo ""
  echo -e "${RED}Failed models:${RESET}"
  for id in "${FAILED_IDS[@]}"; do
    echo "  - $id"
  done
  exit 1
fi
