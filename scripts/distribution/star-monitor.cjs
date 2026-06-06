#!/usr/bin/env node

/**
 * Star Monitoring Dashboard
 *
 * Track star counts across all our repos with daily delta reports.
 * Alerts on spikes (>5 stars/day).
 *
 * Usage:
 *   node star-monitor.js scan --owner "tolga-brk"
 *   node star-monitor.js report
 *   node star-monitor.js alert-threshold <number>
 *   node star-monitor.js --help
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

// Data directory
const DATA_DIR = path.join(__dirname, '../../data/distribution');
const STARS_FILE = path.join(DATA_DIR, 'star-monitor.json');
const ALERT_THRESHOLD = 5;

/**
 * Ensure data directory exists
 */
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Load star data
 */
function loadStarData() {
  ensureDataDir();
  if (fs.existsSync(STARS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(STARS_FILE, 'utf8'));
    } catch (e) {
      warn('Could not load star data, starting fresh');
    }
  }
  return { repos: {}, lastUpdate: null, alertThreshold: ALERT_THRESHOLD };
}

/**
 * Save star data
 */
function saveStarData(data) {
  ensureDataDir();
  data.lastUpdate = new Date().toISOString();
  fs.writeFileSync(STARS_FILE, JSON.stringify(data, null, 2));
  success('Star data updated');
}

/**
 * Check if gh CLI is available
 */
function checkGhCLI() {
  try {
    execSync('gh --version', { encoding: 'utf8' });
    return true;
  } catch (e) {
    error('GitHub CLI not installed');
    log('Install: https://cli.github.com/', colors.cyan);
    return false;
  }
}

/**
 * Get all repos for an owner
 */
function getRepos(owner) {
  try {
    const cmd = `gh repo list ${owner} --limit 100 --json name,nameWithOwner,stargazerCount,updatedAt,isPrivate`;
    const result = execSync(cmd, { encoding: 'utf8' });
    return JSON.parse(result);
  } catch (e) {
    error(`Failed to fetch repos: ${e.message}`);
    return [];
  }
}

/**
 * Scan repos and update star counts
 */
function scanRepos(owner) {
  log('\n=== Star Monitor Scan ===', colors.bright);
  log(`Scanning repos for @${owner}...\n`, colors.reset);

  const repos = getRepos(owner);
  const data = loadStarData();
  const spikes = [];

  if (repos.length === 0) {
    warn('No repos found');
    return;
  }

  log(`Found ${repos.length} repositories\n`, colors.cyan);

  for (const repo of repos) {
    // Skip private repos
    if (repo.isPrivate) {
      continue;
    }

    const repoName = repo.nameWithOwner;
    const currentStars = repo.stargazerCount;
    const lastData = data.repos[repoName];

    // Calculate delta
    let delta = 0;
    let deltaDays = 1;

    if (lastData && lastData.history && lastData.history.length > 0) {
      const lastEntry = lastData.history[0];
      delta = currentStars - lastEntry.stars;
      const lastDate = new Date(lastEntry.timestamp);
      const now = new Date();
      deltaDays = Math.max(1, Math.ceil((now - lastDate) / (1000 * 60 * 60 * 24)));
    }

    // Initialize or update repo data
    if (!data.repos[repoName]) {
      data.repos[repoName] = { history: [] };
    }

    const entry = {
      stars: currentStars,
      timestamp: new Date().toISOString(),
      delta: delta,
      deltaDays: deltaDays
    };

    data.repos[repoName].history.unshift(entry);
    // Keep last 90 days of data
    if (data.repos[repoName].history.length > 90) {
      data.repos[repoName].history = data.repos[repoName].history.slice(0, 90);
    }
    data.repos[repoName].current = entry;

    // Display
    const deltaStr = delta >= 0 ? `+${delta}` : delta;
    const color = delta > data.alertThreshold ? colors.green : (delta > 0 ? colors.cyan : colors.reset);

    log(`${repo.name}`, colors.bright);
    log(`  Stars: ${currentStars} | Delta: ${deltaStr} (last ${deltaDays} day${deltaDays > 1 ? 's' : ''})`, color);
    log(`  Updated: ${new Date(repo.updatedAt).toLocaleDateString()}\n`, colors.reset);

    // Check for spike
    if (delta >= data.alertThreshold) {
      spikes.push({
        repo: repoName,
        delta: delta,
        current: currentStars,
        url: `https://github.com/${repoName}`
      });
    }
  }

  saveStarData(data);

  // Show alerts
  if (spikes.length > 0) {
    log('\n⚠️  SPIKE ALERT! ⚠️', colors.bright + colors.yellow);
    spikes.forEach(spike => {
      log(`  ${spike.repo}: +${spike.delta} stars (now: ${spike.current})`, colors.green);
      log(`  → ${spike.url}\n`, colors.blue);
    });
  } else {
    info('\nNo star spikes detected (>5/day)');
  }

  return { repos: data.repos, spikes };
}

/**
 * Generate daily report
 */
function generateReport() {
  const data = loadStarData();

  log('\n=== Star Monitor Daily Report ===', colors.bright);
  log(`Last Update: ${data.lastUpdate || 'Never'}`, colors.reset);
  log(`Alert Threshold: ${data.alertThreshold || ALERT_THRESHOLD} stars/day\n`, colors.cyan);

  if (Object.keys(data.repos).length === 0) {
    info('No repos tracked yet. Run scan first.');
    log('\nTo scan repos:', colors.cyan);
    log('  node star-monitor.js scan --owner "username"');
    return;
  }

  const summary = [];

  for (const [repoName, repoData] of Object.entries(data.repos)) {
    const current = repoData.current;
    const history = repoData.history || [];

    if (!current) continue;

    // Calculate totals
    const totalStars = current.stars;
    const firstEntry = history[history.length - 1];
    const totalGrowth = firstEntry ? totalStars - firstEntry.stars : 0;
    const daysTracked = history.length || 1;
    const avgGrowth = totalGrowth / daysTracked;

    summary.push({
      repo: repoName,
      stars: totalStars,
      growth: totalGrowth,
      avgGrowth: avgGrowth.toFixed(1),
      daysTracked: daysTracked
    });
  }

  // Sort by stars
  summary.sort((a, b) => b.stars - a.stars);

  log('\nRepository Summary:\n', colors.green);
  summary.forEach((s, i) => {
    log(`${i + 1}. ${s.repo}`, colors.cyan);
    log(`   Stars: ${s.stars} | Growth: +${s.growth} (${s.avgGrowth}/day avg)`, colors.reset);
  });

  // Calculate totals
  const totalStars = summary.reduce((sum, s) => sum + s.stars, 0);
  const totalGrowth = summary.reduce((sum, s) => sum + s.growth, 0);
  const totalGrowthAvg = (totalGrowth / Math.max(summary.length, 1)).toFixed(1);

  log('\n=== Totals ===', colors.bright);
  log(`Repos tracked: ${summary.length}`, colors.green);
  log(`Total stars: ${totalStars}`, colors.cyan);
  log(`Total growth: +${totalGrowth}`, colors.cyan);
  log(`Average growth per repo: ${totalGrowthAvg} stars/day\n`, colors.reset);

  // Trend analysis
  log('=== Growth Leaders (last 24h) ===', colors.bright);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const recentGrowth = summary.map(s => {
    const repoData = data.repos[s.repo];
    const current = repoData.current;
    const prevDay = repoData.history.find(h => {
      const hDate = new Date(h.timestamp);
      return hDate < yesterday;
    });
    const dayGrowth = prevDay ? current.stars - prevDay.stars : 0;
    return { repo: s.repo, dayGrowth, current: current.stars };
  }).sort((a, b) => b.dayGrowth - a.dayGrowth);

  recentGrowth.slice(0, 5).forEach((r, i) => {
    if (r.dayGrowth > 0) {
      log(`${i + 1}. ${r.repo}: +${r.dayGrowth} (now: ${r.current})`, colors.green);
    }
  });

  log('\n');
}

/**
 * CLI handler
 */
async function main() {
  const args = process.argv.slice(2);

  // Help
  if (args.includes('--help') || args.includes('-h')) {
    log('\nStar Monitoring Dashboard - Track repo star growth\n', colors.bright);
    log('Usage:', colors.cyan);
    log('  node star-monitor.js scan --owner "username"');
    log('  node star-monitor.js report');
    log('  node star-monitor.js alert-threshold <number>');
    log('  node star-monitor.js --help\n');
    log('Commands:', colors.green);
    log('  scan              Scan and update star counts for all repos');
    log('  report            Generate daily summary report');
    log('  alert-threshold   Set spike alert threshold (default: 5)\n');
    log('Examples:', colors.reset);
    log('  node star-monitor.js scan --owner "tolga-brk"');
    log('  node star-monitor.js report');
    log('  node star-monitor.js alert-threshold 10\n');
    log('Requires: gh CLI (GitHub CLI) installed\n', colors.yellow);
    return;
  }

  const command = args[0];

  // Scan command
  if (command === 'scan') {
    if (!checkGhCLI()) {
      return;
    }

    const ownerIdx = args.indexOf('--owner');
    const owner = ownerIdx !== -1 ? args[ownerIdx + 1] : null;

    if (!owner) {
      error('Owner required for scan');
      log('Usage: node star-monitor.js scan --owner "username"', colors.cyan);
      return;
    }

    scanRepos(owner);
    return;
  }

  // Report command
  if (command === 'report') {
    generateReport();
    return;
  }

  // Alert threshold command
  if (command === 'alert-threshold') {
    const threshold = parseInt(args[1]);
    if (isNaN(threshold) || threshold < 1) {
      error('Valid threshold required');
      log('Usage: node star-monitor.js alert-threshold <number>', colors.cyan);
      return;
    }

    const data = loadStarData();
    data.alertThreshold = threshold;
    saveStarData(data);
    success(`Alert threshold set to ${threshold} stars/day`);
    return;
  }

  // No command - show help
  log('\nStar Monitoring Dashboard\n', colors.bright);
  log('Run with --help for usage information\n', colors.cyan);
}

if (require.main === module) {
  main().catch(err => {
    error(err.message);
    process.exit(1);
  });
}

module.exports = { scanRepos, generateReport };
