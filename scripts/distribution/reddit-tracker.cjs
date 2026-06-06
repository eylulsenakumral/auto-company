#!/usr/bin/env node

/**
 * Reddit Engagement Tracker
 *
 * Track Reddit post metrics (upvotes, comments) across relevant subreddits.
 * Monitors: r/webdev, r/SideProject, r/devtools, r/SaaS, r/startups
 *
 * Usage:
 *   node reddit-tracker.js scan --subreddit "webdev" --query "code review"
 *   node reddit-tracker.js track --post "https://reddit.com/r/..."
 *   node reddit-tracker.js daily-report
 *   node reddit-tracker.js --help
 */

const https = require('https');
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

// Default subreddits to monitor
const DEFAULT_SUBREDDITS = ['webdev', 'SideProject', 'devtools', 'SaaS', 'startups'];

// Data directory for storing tracking data
const DATA_DIR = path.join(__dirname, '../../data/distribution');
const TRACKING_FILE = path.join(DATA_DIR, 'reddit-tracker.json');

/**
 * Ensure data directory exists
 */
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Load tracking data
 */
function loadTrackingData() {
  ensureDataDir();
  if (fs.existsSync(TRACKING_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(TRACKING_FILE, 'utf8'));
    } catch (e) {
      warn('Could not load tracking data, starting fresh');
    }
  }
  return { posts: {}, lastUpdate: null };
}

/**
 * Save tracking data
 */
function saveTrackingData(data) {
  ensureDataDir();
  data.lastUpdate = new Date().toISOString();
  fs.writeFileSync(TRACKING_FILE, JSON.stringify(data, null, 2));
  success('Tracking data updated');
}

/**
 * Make HTTP request to Reddit API (public, no auth needed for read)
 */
function redditRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.reddit.com',
      path: path,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AutoCompany-Distribution/1.0)'
      }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) {
            reject(new Error(`Reddit API error: ${json.error}`));
          } else {
            resolve(json);
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

/**
 * Scan subreddit for posts matching keywords
 */
async function scanSubreddit(subreddit, keywords = []) {
  log(`\n=== Scanning r/${subreddit} ===`, colors.bright);

  try {
    const data = await redditRequest(`/r/${subreddit}/hot.json?limit=25`);
    const posts = data.data.children.map(child => child.data);

    const relevantPosts = [];

    for (const post of posts) {
      const title = post.title.toLowerCase();
      const selftext = (post.selftext || '').toLowerCase();
      const combined = title + ' ' + selftext;

      // Check if any keyword matches
      const matchesKeyword = keywords.length === 0 ||
        keywords.some(kw => combined.includes(kw.toLowerCase()));

      if (matchesKeyword) {
        relevantPosts.push({
          id: post.id,
          title: post.title,
          author: post.author,
          subreddit: post.subreddit,
          score: post.score,
          num_comments: post.num_comments,
          created_utc: post.created_utc,
          permalink: `https://reddit.com${post.permalink}`,
          url: post.url,
          is_self: post.is_self
        });
      }
    }

    if (relevantPosts.length > 0) {
      log(`Found ${relevantPosts.length} relevant posts:`, colors.green);
      relevantPosts.forEach((post, i) => {
        log(`\n${i + 1}. ${post.title}`, colors.cyan);
        log(`   ↳ ${post.score} points | ${post.num_comments} comments`, colors.reset);
        log(`   ↳ ${post.permalink}`, colors.blue);
      });
    } else {
      info('No matching posts found');
    }

    return relevantPosts;
  } catch (e) {
    error(`Failed to scan r/${subreddit}: ${e.message}`);
    return [];
  }
}

/**
 * Track a specific post's performance
 */
async function trackPost(postUrl) {
  // Extract post ID from URL
  const match = postUrl.match(/reddit\.com\/r\/\w+\/comments\/\w+\/([^\/]+)/);
  if (!match) {
    error('Invalid Reddit post URL format');
    return null;
  }

  const postId = match[1];
  const data = loadTrackingData();

  log(`\n=== Tracking Post: ${postId} ===`, colors.bright);

  // Try to find existing tracking data
  if (data.posts[postId]) {
    const last = data.posts[postId];
    const deltaScore = (last.score || 0) - (last.history?.[0]?.score || 0);
    log(`Previously tracked: ${last.score} points (${deltaScore >= 0 ? '+' : ''}${deltaScore} delta)`, colors.cyan);
  }

  try {
    const response = await redditRequest(`/comments/${postId}.json`);
    const postData = response[0].data.children[0].data;

    const metrics = {
      id: postId,
      title: postData.title,
      author: postData.author,
      subreddit: postData.subreddit,
      score: postData.score,
      num_comments: postData.num_comments,
      upvote_ratio: postData.upvote_ratio,
      created_utc: postData.created_utc,
      permalink: `https://reddit.com${postData.permalink}`,
      trackedAt: new Date().toISOString()
    };

    // Save to tracking data
    if (!data.posts[postId]) {
      data.posts[postId] = { history: [] };
    }
    data.posts[postId].history.unshift(metrics);
    // Keep last 30 data points
    if (data.posts[postId].history.length > 30) {
      data.posts[postId].history = data.posts[postId].history.slice(0, 30);
    }
    data.posts[postId].current = metrics;

    saveTrackingData(data);

    log('\nCurrent Metrics:', colors.green);
    log(`  Score: ${metrics.score}`, colors.cyan);
    log(`  Comments: ${metrics.num_comments}`, colors.cyan);
    log(`  Upvote Ratio: ${(metrics.upvote_ratio * 100).toFixed(1)}%`, colors.cyan);
    log(`  URL: ${metrics.permalink}\n`, colors.blue);

    return metrics;
  } catch (e) {
    error(`Failed to track post: ${e.message}`);
    return null;
  }
}

/**
 * Generate daily summary report
 */
function generateDailyReport() {
  const data = loadTrackingData();

  log('\n=== Reddit Engagement Daily Report ===', colors.bright);
  log(`Last Update: ${data.lastUpdate || 'Never'}\n`, colors.reset);

  if (Object.keys(data.posts).length === 0) {
    info('No posts are being tracked yet.');
    log('\nTo track a post:', colors.cyan);
    log('  node reddit-tracker.js track --post "https://reddit.com/r/..."');
    return;
  }

  const summary = [];

  for (const [postId, tracking] of Object.entries(data.posts)) {
    const current = tracking.current;
    const history = tracking.history || [];

    if (!current) continue;

    // Calculate deltas
    const prev = history.length > 1 ? history[1] : null;
    const scoreDelta = prev ? current.score - prev.score : 0;
    const commentsDelta = prev ? current.num_comments - prev.num_comments : 0;

    summary.push({
      postId,
      title: current.title,
      subreddit: current.subreddit,
      score: current.score,
      scoreDelta,
      numComments: current.num_comments,
      commentsDelta,
      upvoteRatio: current.upvote_ratio,
      url: current.permalink
    });
  }

  // Sort by score
  summary.sort((a, b) => b.score - a.score);

  log('\nTop Performing Posts:', colors.green);
  summary.forEach((post, i) => {
    log(`\n${i + 1}. ${post.title}`, colors.cyan);
    log(`   r/${post.subreddit} | ${post.score} points (${post.scoreDelta >= 0 ? '+' : ''}${post.scoreDelta})`, colors.reset);
    log(`   ${post.numComments} comments (${post.commentsDelta >= 0 ? '+' : ''}${post.commentsDelta}) | ${(post.upvoteRatio * 100).toFixed(0)}% upvote`, colors.reset);
    log(`   ${post.url}`, colors.blue);
  });

  // Total stats
  const totalScore = summary.reduce((sum, p) => sum + p.score, 0);
  const totalComments = summary.reduce((sum, p) => sum + p.numComments, 0);

  log('\n=== Totals ===', colors.bright);
  log(`Posts tracked: ${summary.length}`, colors.green);
  log(`Total score: ${totalScore}`, colors.cyan);
  log(`Total comments: ${totalComments}\n`, colors.cyan);
}

/**
 * CLI handler
 */
async function main() {
  const args = process.argv.slice(2);

  // Help
  if (args.includes('--help') || args.includes('-h')) {
    log('\nReddit Engagement Tracker - Monitor Reddit post performance\n', colors.bright);
    log('Usage:', colors.cyan);
    log('  node reddit-tracker.js scan [--subreddit "name"] [--query "keyword1,keyword2"]');
    log('  node reddit-tracker.js track --post "https://reddit.com/r/..."');
    log('  node reddit-tracker.js daily-report');
    log('  node reddit-tracker.js --help\n');
    log('Commands:', colors.green);
    log('  scan         Scan subreddit for posts matching keywords');
    log('  track        Track a specific post\'s performance');
    log('  daily-report Generate daily summary of tracked posts\n');
    log('Examples:', colors.reset);
    log('  node reddit-tracker.js scan --subreddit "webdev" --query "code review,PR triage"');
    log('  node reddit-tracker.js track --post "https://reddit.com/r/webdev/comments/xyz/"');
    log('  node reddit-tracker.js daily-report\n');
    return;
  }

  const command = args[0];

  // Scan command
  if (command === 'scan') {
    const subIdx = args.indexOf('--subreddit');
    const queryIdx = args.indexOf('--query');

    const subreddit = subIdx !== -1 ? args[subIdx + 1] : null;
    const query = queryIdx !== -1 ? args[queryIdx + 1] : '';
    const keywords = query ? query.split(',').map(k => k.trim()) : [];

    if (subreddit) {
      await scanSubreddit(subreddit, keywords);
    } else {
      // Scan all default subreddits
      for (const sr of DEFAULT_SUBREDDITS) {
        await scanSubreddit(sr, keywords);
      }
    }
    return;
  }

  // Track command
  if (command === 'track') {
    const postIdx = args.indexOf('--post');
    const postUrl = postIdx !== -1 ? args[postIdx + 1] : null;

    if (!postUrl) {
      error('Post URL required for tracking');
      log('Usage: node reddit-tracker.js track --post "https://reddit.com/r/..."', colors.cyan);
      return;
    }

    await trackPost(postUrl);
    return;
  }

  // Daily report command
  if (command === 'daily-report') {
    generateDailyReport();
    return;
  }

  // No command - show help
  log('\nReddit Engagement Tracker\n', colors.bright);
  log('Run with --help for usage information\n', colors.cyan);
}

if (require.main === module) {
  main().catch(err => {
    error(err.message);
    process.exit(1);
  });
}

module.exports = { scanSubreddit, trackPost, generateDailyReport };
