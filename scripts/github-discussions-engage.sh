#!/usr/bin/env bash
# Autonomous GitHub Discussions Engagement Script for Changelog Generator
# Operations-PG (Paul Graham) style: Do things that don't scale, but do them wisely.
# Target: https://github.com/eylulsenakumral/changelog-generator
#
# Philosophy:
# - Only respond to GENUINELY relevant discussions
# - Provide real value, not spam
# - Build trust through helpfulness
# - Track every engagement for learning

set -euo pipefail

# ============================================================================
# CONFIGURATION
# ============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="${SCRIPT_DIR}/github-discengagement.log"
STATE_FILE="${SCRIPT_DIR}/.github-discuss-state.json"
REPO="eylulsenakumral/changelog-generator"
MAX_REPLIES_PER_RUN=3
MIN_DISCUSSION_AGE_HOURS=1
MAX_DISCUSSION_AGE_DAYS=30

# Rate limiting: GitHub GraphQL allows 5000 points/hour
# Each search + query + reply uses ~50-100 points
# Conservative: max 50 operations per run

# ============================================================================
# TEMPLATES (from cycle230-plan-b-distribution.md)
# ============================================================================

TEMPLATE_1_HOW_TO='If you'\''re looking for zero-config release notes, I built a GitHub Actions workflow that auto-generates changelogs from commits.

It:
- Parses conventional commits (feat, fix, etc.)
- Categorizes by type
- Generates markdown with links
- Highlights breaking changes

Setup is one workflow file. Free for public repos.

https://github.com/eylulsenakumral/changelog-generator'

TEMPLATE_2_BEST_PRACTICES='One option: automate it entirely.

I use a GitHub Actions workflow that reads commits and generates structured release notes. No manual writing – just push commits and create a release.

The key is using conventional commits (feat:, fix:, feat!:) so the parser knows how to categorize changes.

If you want to try: https://github.com/eylulsenakumral/changelog-generator'

TEMPLATE_3_TIRED_WRITING='I solved this by automating it completely.

Built a GitHub Action that:
1. Reads commit history
2. Parses commit types
3. Generates categorized markdown
4. Adds to release notes automatically

Zero config if you use conventional commits.

https://github.com/eylulsenakumral/changelog-generator

Saved me 2-3 hours per release.'

# ============================================================================
# SEARCH QUERIES
# ============================================================================

QUERIES=(
  '"release notes" "how to"'
  '"changelog" automation'
  '"GitHub Actions" release notes'
  '"conventional commits" changelog'
  '"automatic" changelog'
  '"generate" release notes'
  '"writing" changelogs'
)

# ============================================================================
# LOGGING FUNCTIONS
# ============================================================================

log() {
  local level="$1"
  shift
  local msg="[$(date -u '+%Y-%m-%d %H:%M:%S UTC')] [$level] $*"
  echo "$msg" | tee -a "$LOG_FILE"
}

log_info() { log "INFO" "$@"; }
log_success() { log "SUCCESS" "$@"; }
log_warn() { log "WARN" "$@"; }
log_error() { log "ERROR" "$@"; }
log_engagement() { log "ENGAGEMENT" "$@"; }

# ============================================================================
# STATE MANAGEMENT
# ============================================================================

init_state() {
  if [[ ! -f "$STATE_FILE" ]]; then
    cat > "$STATE_FILE" << 'EOF'
{
  "replied_discussions": [],
  "last_run": null,
  "total_replies": 0
}
EOF
  fi
}

get_replied_ids() {
  jq -r '.replied_discussions[]' "$STATE_FILE" 2>/dev/null || echo ""
}

add_replied_id() {
  local id="$1"
  local tmp=$(mktemp)
  jq --arg id "$id" '.replied_discussions += [$id]' "$STATE_FILE" > "$tmp"
  mv "$tmp" "$STATE_FILE"
}

update_last_run() {
  local tmp=$(mktemp)
  jq --arg ts "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" '.last_run = $ts | .total_replies += 1' "$STATE_FILE" > "$tmp"
  mv "$tmp" "$STATE_FILE"
}

# ============================================================================
# RELEVANCE SCORING
# ============================================================================

# Score discussion relevance 0-100
score_relevance() {
  local title="$1"
  local body="$2"
  local comments="$3"

  local combined="${title} ${body} ${comments}"
  local score=0

  # High relevance indicators (40 points each)
  if echo "$combined" | grep -iqE "(release notes|changelog|CHANGELOG)"; then
    score=$((score + 40))
  fi

  if echo "$combined" | grep -iqE "(how to|how do I|best way|how can I|automatically|generate)"; then
    score=$((score + 40))
  fi

  # Medium relevance (20 points)
  if echo "$combined" | grep -iqE "(conventional commits|GitHub Actions|automation|writing|create)"; then
    score=$((score + 20))
  fi

  # Negative indicators (spam/inappropriate)
  if echo "$combined" | grep -iqE "(job|hire|freelance|paid service|buy|sale)"; then
    score=$((score - 50))
  fi

  # Cap at 100
  if [[ $score -gt 100 ]]; then
    score=100
  fi

  echo "$score"
}

# Check if we've already replied
has_replied() {
  local discussion_id="$1"
  local replied_ids=$(get_replied_ids)

  if echo "$replied_ids" | grep -qF "$discussion_id"; then
    return 0
  fi
  return 1
}

# ============================================================================
# TEMPLATE SELECTION
# ============================================================================

select_template() {
  local title="$1"
  local body="$2"

  local combined="${title} ${body}"

  # Template 1: "How do I" questions
  if echo "$combined" | grep -iqE "(how do I|how to|how can)"; then
    echo "$TEMPLATE_1_HOW_TO"
    return
  fi

  # Template 2: Best practices questions
  if echo "$combined" | grep -iqE "(best practice|what'?s the best|should I)"; then
    echo "$TEMPLATE_2_BEST_PRACTICES"
    return
  fi

  # Template 3: "Tired of" complaints
  if echo "$combined" | grep -iqE "(tired of|hate writing|manual|time consuming)"; then
    echo "$TEMPLATE_3_TIRED_WRITING"
    return
  fi

  # Default: Template 1
  echo "$TEMPLATE_1_HOW_TO"
}

# ============================================================================
# DISCOVERY
# ============================================================================

search_discussions() {
  local query="$1"
  log_info "Searching for: $query"

  # Use GitHub CLI to search discussions
  # Format: JSON with number, title, url, created_at
  gh api \
    --paginate \
    -H "Accept: application/vnd.github+json" \
    "/search/discussions?q=${query}+repo:${REPO}+state:open&per_page=10" \
    --jq '.items[] | {number, title, url, created_at, author: .author.login}' 2>/dev/null || echo ""
}

# ============================================================================
# ENGAGEMENT
# ============================================================================

get_discussion_details() {
  local discussion_num="$1"

  gh api \
    -H "Accept: application/vnd.github+json" \
    "/repos/${REPO}/discussions/${discussion_num}" \
    --jq '{title, body, comments: [.comments[].body] | join(" ")}' 2>/dev/null || echo '{}'
}

reply_to_discussion() {
  local discussion_num="$1"
  local body="$2"

  # Create reply as a new comment
  local result=$(gh api \
    --method POST \
    -H "Accept: application/vnd.github+json" \
    "/repos/${REPO}/discussions/${discussion_num}/comments" \
    -f body="$body" 2>&1)

  if echo "$result" | grep -q "id"; then
    return 0
  else
    log_error "Failed to reply: $result"
    return 1
  fi
}

process_discussion() {
  local discussion="$1"

  local num=$(echo "$discussion" | jq -r '.number // empty')
  local title=$(echo "$discussion" | jq -r '.title // empty')
  local url=$(echo "$discussion" | jq -r '.url // empty')
  local created_at=$(echo "$discussion" | jq -r '.created_at // empty')

  [[ -z "$num" ]] && return 0

  # Check age
  local age_days=$(( ($(date +%s) - $(date -d "$created_at" +%s)) / 86400 ))
  if [[ $age_days -gt $MAX_DISCUSSION_AGE_DAYS ]]; then
    log_info "Skipping #$num - too old ($age_days days)"
    return 0
  fi

  # Check if already replied
  if has_replied "$num"; then
    log_info "Skipping #$num - already replied"
    return 0
  fi

  # Get full content for relevance scoring
  log_info "Fetching details for #$num: $title"
  local details=$(get_discussion_details "$num")
  local body=$(echo "$details" | jq -r '.body // ""')
  local comments=$(echo "$details" | jq -r '.comments // ""')

  # Score relevance
  local score=$(score_relevance "$title" "$body" "$comments")
  log_info "Relevance score for #$num: $score/100"

  # Only engage if score >= 60 (highly relevant)
  if [[ $score -lt 60 ]]; then
    log_info "Skipping #$num - low relevance"
    return 0
  fi

  # Select appropriate template
  local response=$(select_template "$title" "$body")

  # Reply
  log_info "Replying to #$num..."
  if reply_to_discussion "$num" "$response"; then
    log_success "Replied to #$num: $url"
    log_engagement "{\"action\": \"reply\", \"discussion_number\": $num, \"url\": \"$url\", \"score\": $score}"
    add_replied_id "$num"
    return 1  # Signal we made a reply
  else
    log_error "Failed to reply to #$num"
    return 0
  fi
}

# ============================================================================
# MAIN LOOP
# ============================================================================

main() {
  log_info "=== Starting GitHub Discussions Engagement ==="
  init_state

  local replies_made=0

  for query in "${QUERIES[@]}"; do
    if [[ $replies_made -ge $MAX_REPLIES_PER_RUN ]]; then
      log_info "Reached max replies per run ($MAX_REPLIES_PER_RUN)"
      break
    fi

    # URL-encode the query
    local encoded_query=$(echo "$query" | jq -sRr @uri)

    local discussions=$(search_discussions "$encoded_query")

    if [[ -z "$discussions" ]]; then
      log_info "No results for query: $query"
      continue
    fi

    echo "$discussions" | while IFS= read -r discussion; do
      if [[ $replies_made -ge $MAX_REPLIES_PER_RUN ]]; then
        break
      fi

      if process_discussion "$discussion"; then
        ((replies_made++)) || true
      fi
    done

    # Rate limit delay between queries
    sleep 2
  done

  update_last_run
  log_info "=== Engagement complete. $replies_made replies made ==="
}

# ============================================================================
# ENTRY POINT
# ============================================================================

# Check dependencies
for cmd in gh jq; do
  if ! command -v "$cmd" &>/dev/null; then
    echo "Error: Required command not found: $cmd"
    exit 1
  fi
done

# Check gh auth
if ! gh auth status &>/dev/null; then
  echo "Error: Not authenticated with GitHub CLI. Run: gh auth login"
  exit 1
fi

main "$@"
