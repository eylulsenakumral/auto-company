#!/usr/bin/env node

/**
 * Hashnode Cross-Post Script
 *
 * Posts articles to Hashnode via GraphQL API
 *
 * Usage:
 *   HASHNODE_TOKEN=xxx HASHNODE_PUBLICATION_ID=yyy node scripts/distribution/hashnode-poster.cjs           # Dry-run (preview)
 *   HASHNODE_TOKEN=xxx HASHNODE_PUBLICATION_ID=yyy node scripts/distribution/hashnode-poster.cjs --execute # Publish
 *
 * Environment:
 *   HASHNODE_TOKEN - Your Hashnode Personal Access Token (https://hashnode.com/settings/developer)
 *   HASHNODE_PUBLICATION_ID - Your publication ID (find in URL or via GraphQL)
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
  graphqlEndpoint: 'https://gql.hashnode.com',
  articleDir: path.join(projectRoot, 'docs/marketing/reviewflow-launch'),
  outputDir: path.join(projectRoot, 'data/distribution/outcome'),
};

/**
 * GraphQL mutation for creating a post
 */
const CREATE_POST_MUTATION = `
mutation CreatePublicationPost($input: CreatePostInput!) {
  createPost(input: $input) {
    post {
      id
      slug
      url
      publication {
        username
      }
    }
  }
}
`;

/**
 * Read and parse article markdown
 * Frontmatter format:
 * ---
 * title: Post Title
 * tags: tag1,tag2,tag3
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
      contentMarkdown: content,
      tags: [],
      coverImage: null,
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
    contentMarkdown: body,
    tags: meta.tags ? meta.tags.split(',').map(t => t.trim()) : [],
    coverImage: meta.cover_image || meta.coverImage || null,
    raw: content,
  };
}

/**
 * Make HTTPS request to Hashnode GraphQL
 */
function graphqlRequest(query, variables, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(CONFIG.graphqlEndpoint);
    const payload = JSON.stringify({ query, variables });

    const options = {
      method: 'POST',
      hostname: url.hostname,
      path: url.pathname,
      headers: {
        'Authorization': token,
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
            const response = JSON.parse(body);
            if (response.errors) {
              const errors = response.errors.map(e => e.message).join(', ');
              reject(new Error(`GraphQL errors: ${errors}`));
            } else {
              resolve(response.data);
            }
          } catch (err) {
            reject(new Error(`Failed to parse response: ${err.message}`));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
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
 * Post article to Hashnode
 */
async function publishArticle(article, publicationId, token, isDryRun) {
  const variables = {
    input: {
      publicationId: publicationId,
      title: article.title,
      contentMarkdown: article.contentMarkdown,
      tags: article.tags.map(tag => ({ name: tag, slug: tag.toLowerCase().replace(/\s+/g, '-') })),
      coverImage: article.coverImage,
      publishRevision: true, // Publish immediately
    },
  };

  if (isDryRun) {
    console.log('\n=== DRY RUN PREVIEW ===');
    console.log(`Title: ${article.title}`);
    console.log(`Tags: ${article.tags.join(', ') || 'none'}`);
    console.log(`Cover Image: ${article.coverImage || 'none'}`);
    console.log(`\nGraphQL Variables:`);
    console.log(JSON.stringify(variables, null, 2));
    console.log(`\nQuery:\n${CREATE_POST_MUTATION.trim()}`);
    return { dryRun: true };
  }

  const maxRetries = 3;
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await graphqlRequest(CREATE_POST_MUTATION, variables, token);
      const post = response.createPost.post;
      return {
        id: post.id,
        slug: post.slug,
        url: post.url,
        publication: `https://hashnode.com/${post.publication.username}`,
      };
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
  const filename = `hashnode-${path.basename(articleName, '.md')}-${timestamp}.json`;
  const filepath = path.join(CONFIG.outputDir, filename);

  fs.writeFileSync(filepath, JSON.stringify(result, null, 2));
  return filepath;
}

/**
 * Get user's publications (helper for finding publication ID)
 */
async function listPublications(token) {
  const query = `
query {
  me {
    publications {
      id
      username
      title
    }
  }
}
`;
  try {
    const response = await graphqlRequest(query, {}, token);
    return response.me.publications;
  } catch (err) {
    console.error('Failed to list publications:', err.message);
    return [];
  }
}

/**
 * Main execution
 */
async function main() {
  const token = process.env.HASHNODE_TOKEN;
  if (!token) {
    console.error('Error: HASHNODE_TOKEN environment variable required');
    console.error('Get your token at: https://hashnode.com/settings/developer');
    process.exit(1);
  }

  const publicationId = process.env.HASHNODE_PUBLICATION_ID;
  const isExecute = process.argv.includes('--execute');
  const isDryRun = !isExecute;
  const shouldList = process.argv.includes('--list-publications');

  console.log(`Mode: ${isExecute ? 'EXECUTE (will publish)' : 'DRY RUN (preview only)'}`);

  // Handle --list-publications flag
  if (shouldList) {
    console.log('\nFetching your publications...');
    const publications = await listPublications(token);
    if (publications.length === 0) {
      console.log('No publications found.');
    } else {
      console.log('\nYour publications:');
      publications.forEach(pub => {
        console.log(`  - ${pub.title} (@${pub.username})`);
        console.log(`    ID: ${pub.id}`);
        console.log(`    URL: https://hashnode.com/${pub.username}`);
      });
      console.log('\nSet HASHNODE_PUBLICATION_ID to the ID above to publish.');
    }
    return;
  }

  if (!publicationId) {
    console.error('Error: HASHNODE_PUBLICATION_ID environment variable required');
    console.error('Run with --list-publications to see your publications and IDs');
    console.error('Or find it in your publication URL: https://hashnode.com/USERNAME/settings/general');
    process.exit(1);
  }

  const articles = listArticles();

  if (articles.length === 0) {
    console.log('No articles found in', CONFIG.articleDir);
    return;
  }

  console.log(`Found ${articles.length} article(s)`);
  console.log(`Publication ID: ${publicationId}`);

  for (const articlePath of articles) {
    const content = fs.readFileSync(articlePath, 'utf8');
    const article = parseArticle(content);
    const basename = path.basename(articlePath);

    console.log(`\n--- Processing: ${basename} ---`);

    try {
      const result = await publishArticle(article, publicationId, token, isDryRun);

      if (isDryRun) {
        console.log('✓ Preview complete');
      } else {
        console.log('✓ Published!');
        console.log(`  URL: ${result.url}`);
        console.log(`  Slug: ${result.slug}`);
        console.log(`  Post ID: ${result.id}`);
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
