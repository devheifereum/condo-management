#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# cleanup-legacy.sh — remove every legacy file left over from the mock condo
# management prototype that pre-dated the MyUnitManager rewrite.
#
# The sandbox that scaffolded this repo could not `rm` files, so it renamed
# them with `_LEGACY_delete` in the path. This script deletes them.
#
# Compatible with macOS default Bash 3.2 and modern Bash 4+.
#
# Usage:
#   chmod +x cleanup-legacy.sh
#   ./cleanup-legacy.sh          # dry-run: prints what it would delete
#   ./cleanup-legacy.sh --force  # actually delete
# ─────────────────────────────────────────────────────────────────────────────
set -eu

DRY_RUN=1
if [ "${1-}" = "--force" ]; then DRY_RUN=0; fi

cd "$(dirname "$0")"

count=0

# 1) Legacy source files (identified by *_LEGACY_delete.* naming)
echo "── Legacy source files"
while IFS= read -r f; do
    [ -z "$f" ] && continue
    echo "  rm $f"
    if [ $DRY_RUN -eq 0 ]; then rm -f "$f"; fi
    count=$((count+1))
done <<EOF
$(find . -type f \( \
       -name "*_LEGACY_delete.ts" \
    -o -name "*_LEGACY_delete.tsx" \
    -o -name "*_LEGACY_delete.html" \
    -o -name "*_LEGACY_delete.css" \
    -o -name "*_LEGACY_delete.js" \
  \) -not -path "./node_modules/*" -not -path "./.git/*" 2>/dev/null)
EOF

# 2) Empty legacy directories left behind after files are removed
echo "── Legacy directories (removed only if empty)"
for d in src/mock src/components/eform src/components/shells src/routes/guard src/routes/manager src/routes/resident; do
    if [ -d "$d" ]; then
        if [ $DRY_RUN -eq 0 ]; then
            # try rmdir; ignore failure if not empty
            if rmdir "$d" 2>/dev/null; then
                echo "  rmdir $d"
                count=$((count+1))
            else
                echo "  (skipped, not empty) $d"
            fi
        else
            echo "  (would rmdir if empty) $d"
        fi
    fi
done

echo
if [ $DRY_RUN -eq 1 ]; then
    echo "Dry-run complete — $count files would be removed."
    echo "Re-run with --force to actually delete."
else
    echo "Done — $count items removed."
    echo
    echo "Follow-up:"
    echo "  rm -rf dist         # clear stale build output"
    echo "  npm install          # re-lock deps"
    echo "  npm run typecheck    # verify the app still type-checks"
fi
