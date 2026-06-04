#!/bin/bash
# deploy-product-7.sh - Deploy Product #7 without human dependency
# Auto Company Zero-Human-Dependency Credential Pipeline
# Cycle #236

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== Product #7 Deployment ===${NC}"
echo "Product: Week 1 Smoke Test Landing Pages"
echo "Repo: https://github.com/eylulsenakumral/smoke-test-landing-pages"
echo ""

# Source credentials
if [ -f .env ]; then
    set -a
    source .env
    set +a
fi

# Check GitHub token
if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}ERROR: GITHUB_TOKEN not set${NC}"
    echo "Add to .env file:"
    echo "  GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxx"
    exit 1
fi

export GITHUB_TOKEN

# Setup authentication
echo -e "${BLUE}Setting up GitHub authentication...${NC}"
echo "$GITHUB_TOKEN" | gh auth login --with-token 2>/dev/null || true

# Verify
USERNAME=$(gh api /user --jq '.login' 2>/dev/null)
echo -e "${GREEN}✓ Authenticated as: $USERNAME${NC}"
echo ""

# Navigate to project
PROJECT_PATH="projects-archive/ultimatum-cycle/smoke-test-landing-pages-action"

if [ ! -d "$PROJECT_PATH" ]; then
    echo -e "${RED}ERROR: Project not found at $PROJECT_PATH${NC}"
    exit 1
fi

cd "$PROJECT_PATH"

# Check pending commits
echo -e "${BLUE}Checking pending commits...${NC}"
PENDING=$(git log origin/main..HEAD --oneline || echo "No commits")

if [ "$PENDING" = "No commits" ] || [ -z "$PENDING" ]; then
    echo -e "${YELLOW}⚠ No pending commits to push${NC}"
    echo "Repository is up to date"
    exit 0
fi

echo -e "${GREEN}Pending commits:${NC}"
echo "$PENDING"
echo ""

# Push
echo -e "${BLUE}Pushing to GitHub...${NC}"
git push origin main

echo -e "${GREEN}✓ Push complete${NC}"
echo ""
echo -e "${GREEN}=== Product #7 Deployed ===${NC}"
