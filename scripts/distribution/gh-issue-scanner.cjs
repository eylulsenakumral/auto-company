#!/usr/bin/env node

/**
 * GitHub Issue Scanner
 *
 * Scan GitHub for issues mentioning relevant keywords to find outreach opportunities.
 * Keywords: "code review", "PR triage", "AI slop", "CI/CD"
 *
 * Usage:
 *   node gh-issue-scanner.js scan --query "code review tool"
 *   node gh-issue-scanner.js digest
 *   node gh-issue-scanner.js --help
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function error(message) {
  log(`ERROR: ${message}`, colors.red);
}

function warn(message) {
  log(`WARN: ${message}`, colors.yellow);
}

function success(message) {
  log(`✓ ${message}`, colors.green);
}

function info(message) {
  log(`ℹ ${message}`, colors.cyan);
}

// Default keywords to search for
const DEFAULT_KEYWORDS = [
  'code review',
  'PR triage',
  'AI slop',
  'CI/CD',
  'pull request automation',
  'code quality',
  'linting',
  'pre-commit',
  'code formatting'
];

// Data directory
const DATA_DIR = path.join(__dirname, '../../data/distribution');
const ISSUES_FILE = path.join(DATA_DIR, 'gh-issues.json');

/**
 * Ensure data directory exists
 */
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Load issues data
 */
function loadIssuesData() {
  ensureDataDir();
  if (fs.existsSync(ISSUES_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(ISSUES_FILE, 'utf8'));
    } catch (e) {
      warn('Could not load issues data, starting fresh');
    }
  }
  return { issues: [], lastUpdate: null };
}

/**
 * Save issues data
 */
function saveIssuesData(data) {
  ensureDataDir();
  data.lastUpdate = new Date().toISOString();
  fs.writeFileSync(ISSUES_FILE, JSON.stringify(data, null, 2));
  success('Issues data updated');
}

/**
 * Check if gh CLI is installed and authenticated
 */
function checkGhCLI() {
  try {
    const auth = execSync('gh auth status', { encoding: 'utf8' });
    return true;
  } catch (e) {
    error('GitHub CLI not authenticated');
    log('Run: gh auth login', colors.cyan);
    return false;
  }
}

/**
 * Search GitHub issues with query
 */
function searchIssues(query, limit = 10) {
  try {
    // Build search query - look for open issues
    const searchQuery = `${query} state:open`;
    const cmd = `gh search issues "${searchQuery}" --limit ${limit} --json title,url,repository,state,author,createdAt,commentsCount`;
    const result = execSync(cmd, { encoding: 'utf8' });
    return JSON.parse(result);
  } catch (e) {
    error(`Failed to search issues: ${e.message}`);
    return [];
  }
}

/**
 * Scan for issues with specific keyword
 */
function scanKeyword(keyword, limit = 10) {
  log(`\n=== Scanning for: "${keyword}" ===`, colors.bright);

  const issues = searchIssues(keyword, limit);

  if (issues.length === 0) {
    info('No issues found');
    return [];
  }

  log(`Found ${issues.length} issues:\n`, colors.green);

  const filteredIssues = [];

  for (const issue of issues) {
    // Filter out very old issues (more than 6 months)
    const createdDate = new Date(issue.createdAt);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    if (createdDate < sixMonthsAgo) {
      continue;
    }

    filteredIssues.push({
      id: issue.url.split('/').pop(),
      title: issue.title,
      url: issue.url,
      repository: issue.repository.nameWithOwner,
      author: issue.author?.login || 'unknown',
      createdAt: issue.createdAt,
      comments: issue.commentsCount || 0,
      keyword
    });

    log(`• ${issue.title}`, colors.cyan);
    log(`  ↳ ${issue.repository.nameWithOwner}`, colors.reset);
    log(`  ↳ ${issue.commentsCount || 0} comments | ${new Date(issue.createdAt).toLocaleDateString()}`, colors.reset);
    log(`  ↳ ${issue.url}\n`, colors.blue);
  }

  return filteredIssues;
}

/**
 * Scan all keywords and generate digest
 */
function scanAllKeywords() {
  log('\n=== GitHub Issue Scanner ===', colors.bright);
  log('Searching for outreach opportunities...\n', colors.reset);

  const data = loadIssuesData();
  const newIssues = [];
  const seenUrls = new Set(data.issues.map(i => i.url));

  for (const keyword of DEFAULT_KEYWORDS) {
    const issues = scanKeyword(keyword, 10);
    for (const issue of issues) {
      if (!seenUrls.has(issue.url)) {
        newIssues.push(issue);
        seenUrls.add(issue.url);
      }
    }
  }

  // Add new issues to data
  if (newIssues.length > 0) {
    data.issues = [...newIssues, ...data.issues];
    // Keep last 500 issues
    if (data.issues.length > 500) {
      data.issues = data.issues.slice(0, 500);
    }
    saveIssuesData(data);
    success(`Added ${newIssues.length} new issues`);
  } else {
    info('No new issues found');
  }

  return data.issues;
}

/**
 * Generate daily digest
 */
function generateDigest() {
  const data = loadIssuesData();

  log('\n=== GitHub Issues Daily Digest ===', colors.bright);
  log(`Last Update: ${data.lastUpdate || 'Never'}`, colors.reset);
  log(`Total Issues Tracked: ${data.issues.length}\n`, colors.cyan);

  if (data.issues.length === 0) {
    info('No issues tracked yet. Run scan first.');
    log('\nTo scan for issues:', colors.cyan);
    log('  node gh-issue-scanner.js scan');
    return;
  }

  // Group by keyword
  const byKeyword = {};
  data.issues.forEach(issue => {
    if (!byKeyword[issue.keyword]) {
      byKeyword[issue.keyword] = [];
    }
    byKeyword[issue.keyword].push(issue);
  });

  log('Issues by Keyword:\n', colors.green);
  for (const [keyword, issues] of Object.entries(byKeyword)) {
    log(`"${keyword}": ${issues.length} issues`, colors.cyan);
  }

  // Show recent issues (last 10)
  log('\n=== Recent Opportunities ===', colors.bright);
  const recent = data.issues.slice(0, 10);

  recent.forEach((issue, i) => {
    log(`\n${i + 1}. ${issue.title}`, colors.cyan);
    log(`   Repo: ${issue.repository}`, colors.reset);
    log(`   Match: "${issue.keyword}"`, colors.yellow);
    log(`   Posted: ${new Date(issue.createdAt).toLocaleDateString()}`, colors.reset);
    log(`   ${issue.url}`, colors.blue);
  });

  // Statistics
  const totalComments = data.issues.reduce((sum, i) => sum + (i.comments || 0), 0);
  const uniqueRepos = new Set(data.issues.map(i => i.repository)).size;

  log('\n=== Statistics ===', colors.bright);
  log(`Unique repositories: ${uniqueRepos}`, colors.green);
  log(`Total comments across issues: ${totalComments}`, colors.cyan);
  log(`Average comments per issue: ${(totalComments / data.issues.length).toFixed(1)}\n`, colors.reset);

  log('💡 Tip: High-comment issues indicate strong demand. Consider reaching out!\n', colors.yellow);
}

/**
 * CLI handler
 */
async function main() {
  const args = process.argv.slice(2);

  // Help
  if (args.includes('--help') || args.includes('-h')) {
    log('\nGitHub Issue Scanner - Find outreach opportunities\n', colors.bright);
    log('Usage:', colors.cyan);
    log('  node gh-issue-scanner.js scan [--query "custom query"]');
    log('  node gh-issue-scanner.js digest');
    log('  node gh-issue-scanner.js --help\n');
    log('Commands:', colors.green);
    log('  scan   Search GitHub for issues with relevant keywords');
    log('  digest Generate daily digest of tracked issues\n');
    log('Default Keywords:', colors.cyan);
    log(DEFAULT_KEYWORDS.map(k => `  - ${k}`).join('\n'));
    log('\nExamples:', colors.reset);
    log('  node gh-issue-scanner.js scan');
    log('  node gh-issue-scanner.js scan --query "code review CLI"');
    log('  node gh-issue-scanner.js digest\n');
    log('Requires: gh CLI (GitHub CLI) installed and authenticated\n', colors.yellow);
    return;
  }

  const command = args[0];

  // Scan command
  if (command === 'scan') {
    if (!checkGhCLI()) {
      return;
    }

    const queryIdx = args.indexOf('--query');
    const customQuery = queryIdx !== -1 ? args[queryIdx + 1] : null;

    if (customQuery) {
      log(`\n=== Custom Scan: "${customQuery}" ===`, colors.bright);
      scanKeyword(customQuery, 20);
    } else {
      scanAllKeywords();
    }
    return;
  }

  // Digest command
  if (command === 'digest') {
    generateDigest();
    return;
  }

  // No command - show help
  log('\nGitHub Issue Scanner\n', colors.bright);
  log('Run with --help for usage information\n', colors.cyan);
}

if (require.main === module) {
  main().catch(err => {
    error(err.message);
    process.exit(1);
  });
}

module.exports = { scanAllKeywords, generateDigest };
