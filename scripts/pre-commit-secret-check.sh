#!/bin/bash
# pre-commit-secret-check.sh - Prevent accidental secret commits
# Auto Company Zero-Human-Dependency Credential Pipeline
# Cycle #236

# Patterns that should never be committed
SECRET_PATTERNS=(
    "ghp_[A-Za-z0-9]{36}"          # GitHub PAT
    "gho_[A-Za-z0-9]{36}"          # GitHub OAuth
    "ghu_[A-Za-z0-9]{36}"          # GitHub User
    "ghs_[A-Za-z0-9]{36}"          # GitHub Server
    "ghr_[A-Za-z0-9]{36}"          # GitHub Refresh
    "xoxb-[0-9]{13}-[0-9]{13}-[A-Za-z0-9]{24}"  # Slack bot token
    "xoxp-[0-9]{13}-[0-9]{13}-[0-9]{12}-[A-Za-z0-9]{32}"  # Slack user token
    "AKIA[0-9A-Z]{16}"             # AWS access key
    "[0-9A-Za-z]{32}:"             # JWT with colon
    "api[_-]?key[\"']?:\s*[\"'][^\"']{20,}"  # API keys
    "password[\"']?:\s*[\"'][^\"']{8,}"       # Passwords
)

echo "🔍 Checking for secrets in staged files..."

# Get list of staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

if [ -z "$STAGED_FILES" ]; then
    exit 0
fi

FOUND_SECRET=0

for pattern in "${SECRET_PATTERNS[@]}"; do
    MATCHES=$(git diff --cached | grep -E "$pattern" || true)
    if [ -n "$MATCHES" ]; then
        echo "❌ POTENTIAL SECRET FOUND:"
        echo "$MATCHES" | head -3
        echo ""
        echo "Pattern matched: $pattern"
        FOUND_SECRET=1
    fi
done

# Check for .env files (except .env.example)
for file in $STAGED_FILES; do
    if [[ "$file" == *".env" && "$file" != *".env.example" && "$file" != *".env.template" ]]; then
        echo "❌ ENV FILE STAGED: $file"
        echo "   Only .env.example should be committed"
        FOUND_SECRET=1
    fi
done

if [ $FOUND_SECRET -eq 1 ]; then
    echo ""
    echo "🚨 COMMIT BLOCKED: Potential secrets detected"
    echo "   Review the output above and remove secrets before committing"
    exit 1
fi

echo "✅ No secrets detected"
exit 0
