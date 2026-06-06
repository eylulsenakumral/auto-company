#!/bin/bash
# GitHub App Setup Helper for Outreach Automation
#
# This script helps configure the repository variables and secrets
# after creating the GitHub App.
#
# Usage: ./scripts/distribution/setup-gh-app.sh <app-id> <path-to-private-key>

set -e

REPO="tolgabrk/auto-company"
APP_ID="${1:-}"
KEY_PATH="${2:-}"

if [ -z "$APP_ID" ] || [ -z "$KEY_PATH" ]; then
  echo "GitHub App Setup Helper"
  echo ""
  echo "Usage: $0 <app-id> <path-to-private-key.pem>"
  echo ""
  echo "Example:"
  echo "  $0 123456 ~/Downloads/auto-company-outreach.20241206.pem"
  echo ""
  echo "Before running:"
  echo "  1. Create GitHub App at https://github.com/settings/apps"
  echo "  2. Generate private key (download .pem file)"
  echo "  3. Install app on this repository"
  echo "  4. Get App ID from app page URL"
  echo ""
  exit 1
fi

if [ ! -f "$KEY_PATH" ]; then
  echo "Error: Private key file not found: $KEY_PATH"
  exit 1
fi

echo "Configuring GitHub App for $REPO..."
echo ""

# Set App ID as repository variable
echo "Setting GITHUB_OUTREACH_APP_ID variable..."
gh variable set GITHUB_OUTREACH_APP_ID --body "$APP_ID" --repo "$REPO"

# Set private key as secret
echo "Setting GITHUB_OUTREACH_APP_KEY secret..."
gh secret set GITHUB_OUTREACH_APP_KEY --repo "$REPO" < "$KEY_PATH"

echo ""
echo "✓ Configuration complete!"
echo ""
echo "Verify with:"
echo "  gh variable list --repo $REPO"
echo "  gh secret list --repo $REPO"
echo ""
echo "Test the workflow:"
echo "  gh workflow run gh-outreach.yml --repo $REPO"
