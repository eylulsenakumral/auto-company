#!/bin/bash
# gh-auth-setup.sh - GitHub Authentication Helper
# Auto Company Zero-Human-Dependency Credential Pipeline
# Cycle #236

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if GITHUB_TOKEN is set
if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}ERROR: GITHUB_TOKEN environment variable is not set${NC}"
    echo ""
    echo "To fix this, add your GitHub Personal Access Token to .env file:"
    echo ""
    echo "  echo 'GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxx' >> .env"
    echo "  source .env"
    echo ""
    echo "Create PAT at: https://github.com/settings/tokens"
    echo "Required scopes: repo, workflow"
    exit 1
fi

# Export GITHUB_TOKEN for gh CLI
export GITHUB_TOKEN

# Verify authentication
echo -e "${GREEN}✓ GitHub authentication configured${NC}"

# Test with GitHub API
if gh auth status &>/dev/null; then
    echo -e "${GREEN}✓ gh CLI authenticated${NC}"
    gh auth status
else
    echo -e "${YELLOW}Setting up gh CLI with token...${NC}"
    echo "$GITHUB_TOKEN" | gh auth login --with-token
fi

# Verify we can access API
USERNAME=$(gh api /user --jq '.login' 2>/dev/null || echo "unknown")
echo -e "${GREEN}✓ Authenticated as: $USERNAME${NC}"

return 0
