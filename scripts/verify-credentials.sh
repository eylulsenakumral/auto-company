#!/bin/bash
# verify-credentials.sh - Verify GitHub credentials without human interaction
# Auto Company Zero-Human-Dependency Credential Pipeline
# Cycle #236

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== Auto Company Credential Verification ===${NC}"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}✗ .env file not found${NC}"
    echo "Create .env from .env.example:"
    echo "  cp .env.example .env"
    echo "  # Edit .env and add your GITHUB_TOKEN"
    exit 1
fi

# Source .env
set -a
source .env
set +a

# Check GITHUB_TOKEN
if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}✗ GITHUB_TOKEN not set in .env${NC}"
    echo ""
    echo "Create PAT at: https://github.com/settings/tokens"
    echo "Required scopes: repo, workflow"
    echo ""
    echo "Add to .env:"
    echo "  GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxx"
    exit 1
fi

echo -e "${GREEN}✓ GITHUB_TOKEN found in .env${NC}"

# Export for gh CLI
export GITHUB_TOKEN

# Test GitHub API
echo -e "${BLUE}Testing GitHub API access...${NC}"

if ! command -v gh &> /dev/null; then
    echo -e "${RED}✗ gh CLI not installed${NC}"
    echo "Install with: npm install -g @cli/github"
    exit 1
fi

# Authenticate
echo "$GITHUB_TOKEN" | gh auth login --with-token 2>/dev/null || true

# Test API call
USERNAME=$(gh api /user --jq '.login' 2>/dev/null)

if [ -n "$USERNAME" ]; then
    echo -e "${GREEN}✓ GitHub API access working${NC}"
    echo -e "${GREEN}✓ Authenticated as: $USERNAME${NC}"
else
    echo -e "${RED}✗ GitHub API access failed${NC}"
    echo "Check your GITHUB_TOKEN"
    exit 1
fi

# Test repo access
REPO_TEST=$(gh repo view eylulsenakumral/changelog-generator --json name --jq '.name' 2>/dev/null)
if [ "$REPO_TEST" = "changelog-generator" ]; then
    echo -e "${GREEN}✓ Repository access verified${NC}"
else
    echo -e "${YELLOW}⚠ Repository access limited${NC}"
fi

echo ""
echo -e "${GREEN}=== All Checks Passed ===${NC}"
echo -e "${BLUE}Zero-Human-Dependency: Ready${NC}"
