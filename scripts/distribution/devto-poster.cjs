#!/usr/bin/env node

/**
 * dev.to Cross-Post Script
 *
 * Posts articles to dev.to via REST API
 *
 * Usage:
 *   DEVTO_API_KEY=xxx node scripts/distribution/devto-poster.cjs           # Dry-run (preview)
 *   DEVTO_API_KEY=xxx node scripts/distribution/devto-poster.cjs --execute # Publish
 *
 * Environment:
 *   DEVTO_API_KEY - Your dev.to API key (https://dev.to/settings/account)
 *
 * Article source: docs/marketing/reviewflow-launch/*.md
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Resolve paths relative to script location, then to project root
const scriptDir = __dirname;
const projectRoot = path.resolve(scriptDir, '../..');

const CONFIG = {
  apiBaseUrl: 'https://dev.to/api',
  articleDir: path.join(projectRoot, 'docs/marketing/reviewflow-launch'),
  outputDir: path.join(projectRoot, 'data/distribution/outcome'),
};

/**
 * Read and parse article markdown
 * Frontmatter format:
 * ---
 * title: Post Title
 * tags: tag1,tag2,tag3
 * series: Series Name
 * cover_image: https://...
 * ---
 */
function parseArticle(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return {
      raw: content,
      title: content.split('\n')[0].replace(/^#+\s*/, ''),
      body_markdown: content,
      tags: ['javascript', 'developer-tools'],
    };
  }

  const frontmatter = match[1];
  const body = match[2];
  const meta = {};

  frontmatter.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
      meta[key.trim()] = value;
    }
  });

  return {
    title: meta.title || 'Untitled',
    body_markdown: body,
    tags: meta.tags ? meta.tags.split(',').map(t => t.trim()) : ['javascript'],
    series: meta.series || null,
    cover_image: meta.cover_image || null,
    raw: content,
  };
}

/**
 * Make HTTPS request to dev.to API
 */
function apiRequest(method, endpoint, data, apiKey) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, CONFIG.apiBaseUrl);
    const options = {
      method,
      hostname: url.hostname,
      path: url.pathname + url.search,
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(body || '{}'));
          } catch {
            resolve(body);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

/**
 * List all markdown files in article directory
 */
function listArticles() {
  if (!fs.existsSync(CONFIG.articleDir)) {
    return [];
  }
  return fs.readdirSync(CONFIG.articleDir)
    .filter(f => f.endsWith('.md'))
    .map(f => path.join(CONFIG.articleDir, f));
}

/**
 * Post article to dev.to
 */
async function publishArticle(article, apiKey, isDryRun) {
  const url = `${CONFIG.apiBaseUrl}/articles`;

  const payload = {
    article: {
      title: article.title,
      body_markdown: article.body_markdown,
      published: true,
      tags: article.tags,
      series: article.series,
      cover_image: article.cover_image,
    },
  };

  if (isDryRun) {
    console.log('\n=== DRY RUN PREVIEW ===');
    console.log(`Title: ${article.title}`);
    console.log(`Tags: ${article.tags.join(', ')}`);
    console.log(`Series: ${article.series || 'none'}`);
    console.log(`\nPayload:`);
    console.log(JSON.stringify(payload, null, 2));
    return { dryRun: true, url: null };
  }

  const maxRetries = 3;
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await apiRequest('POST', '/articles', payload.article, apiKey);
      return response;
    } catch (err) {
      lastError = err;
      console.warn(`Attempt ${i + 1}/${maxRetries} failed: ${err.message}`);
      if (i < maxRetries - 1) {
        await new Promise(r => setTimeout(r, 1000 * (i + 1)));
      }
    }
  }

  throw lastError;
}

/**
 * Save outcome to file
 */
function saveOutcome(articleName, result) {
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `devto-${path.basename(articleName, '.md')}-${timestamp}.json`;
  const filepath = path.join(CONFIG.outputDir, filename);

  fs.writeFileSync(filepath, JSON.stringify(result, null, 2));
  return filepath;
}

/**
 * Main execution
 */
async function main() {
  const apiKey = process.env.DEVTO_API_KEY;
  if (!apiKey) {
    console.error('Error: DEVTO_API_KEY environment variable required');
    console.error('Get your API key at: https://dev.to/settings/account');
    process.exit(1);
  }

  const isExecute = process.argv.includes('--execute');
  const isDryRun = !isExecute;

  console.log(`Mode: ${isExecute ? 'EXECUTE (will publish)' : 'DRY RUN (preview only)'}`);

  const articles = listArticles();

  if (articles.length === 0) {
    console.log('No articles found in', CONFIG.articleDir);
    return;
  }

  console.log(`Found ${articles.length} article(s)`);

  for (const articlePath of articles) {
    const content = fs.readFileSync(articlePath, 'utf8');
    const article = parseArticle(content);
    const basename = path.basename(articlePath);

    console.log(`\n--- Processing: ${basename} ---`);

    try {
      const result = await publishArticle(article, apiKey, isDryRun);

      if (isDryRun) {
        console.log('✓ Preview complete');
      } else {
        console.log('✓ Published:', result.url);
        const outcomeFile = saveOutcome(basename, result);
        console.log('  Outcome saved to:', outcomeFile);
      }
    } catch (err) {
      console.error('✗ Failed:', err.message);
      saveOutcome(basename, { error: err.message, article: basename });
    }
  }

  console.log('\n--- Done ---');
}

if (require.main === module) {
  main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}
