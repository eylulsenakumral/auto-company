#!/usr/bin/env npx tsx
/**
 * Dev.to Auto-Publish CLI Tool
 *
 * Publishes markdown articles to Dev.to via REST API v1
 *
 * Usage:
 *   npx tsx scripts/devto-publish.ts \
 *     --title "Article Title" \
 *     --file ./posts/article.md \
 *     --tags "github,actions,automation" \
 *     --published true
 *
 * Env vars (required):
 *   DEVTO_API_KEY=your_api_key
 *   DEVTO_API_BASE=https://dev.to/api
 *
 * @author Auto Company
 * @license MIT
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

// ============== Types ==============

interface DevtoArticle {
  title: string
  description?: string
  cover_image?: string
  canonical_url?: string
  tags: string[]
  series?: string
  organization_id?: number
  published: boolean
  body_markdown: string
  main_image?: string
}

interface DevtoArticleResponse {
  type_of: string
  id: number
  title: string
  description: string
  cover_image: string | null
  readable_publish_date: string
  social_image: string | null
  slug: string
  path: string
  url: string
  canonical_url: string
  comments_count: number
  positive_reactions_count: number
  public_reactions_count: number
  user: {
    name: string
    username: string
    twitter_username: string | null
    github_username: string | null
    website_url: string | null
    profile_image: string
    profile_image_90: string
  }
  organization: {
    name: string
    slug: string
    profile_image: string
    profile_image_90: string
  } | null
  flare_tag: {
    name: string
    bg_color_hex: string
    text_color_hex: string
  } | null
  published_at: string
  last_comment_at: string
  published_timestamp: string
  reading_time_minutes: number
  tag_list: string[]
  tags: string
  body_html: string
  body_markdown: string
  url: string
}

interface DevtoErrorResponse {
  error: string
  status?: number
}

interface DevtoArticleListItem {
  type_of: string
  id: number
  title: string
  description: string
  url: string
  cover_image: string | null
  readable_publish_date: string
  slug: string
  path: string
  published_at: string | null
  created_at: string
  edited_at: string | null
  tag_list: string[]
  tags: string
  user: {
    name: string
    username: string
    profile_image: string
  }
}

// ============== Config ==============

const CONFIG = {
  API_BASE: process.env.DEVTO_API_BASE || 'https://dev.to/api',
  API_KEY: process.env.DEVTO_API_KEY,
  RATE_LIMIT_DELAY: 3000, // 3 seconds between requests (safe for 10 req/30s)
  MAX_RETRIES: 3,
  RETRY_DELAY_BASE: 1000, // Exponential backoff base
}

// ============== Utilities ==============

/**
 * Delay with promise
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Exponential backoff with jitter
 */
function getRetryDelay(attempt: number): number {
  return CONFIG.RETRY_DELAY_BASE * Math.pow(2, attempt) + Math.random() * 500
}

/**
 * Parse tags from comma-separated string
 */
function parseTags(tagsStr: string): string[] {
  return tagsStr
    .split(',')
    .map(t => t.trim().toLowerCase())
    .filter(t => t.length > 0 && t.length <= 25)
}

/**
 * Extract frontmatter and body from markdown
 * Supports both YAML and TOML frontmatter
 */
function parseMarkdown(content: string): { frontmatter: Record<string, any>, body: string } {
  const yamlFrontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const tomlFrontmatterRegex = /^\+\+\+\s*\n([\s\S]*?)\n\+\+\+\s*\n([\s\S]*)$/

  const yamlMatch = content.match(yamlFrontmatterRegex)
  if (yamlMatch) {
    return { frontmatter: parseYamlFrontmatter(yamlMatch[1]), body: yamlMatch[2].trim() }
  }

  const tomlMatch = content.match(tomlFrontmatterRegex)
  if (tomlMatch) {
    return { frontmatter: parseTomlFrontmatter(tomlMatch[1]), body: tomlMatch[2].trim() }
  }

  return { frontmatter: {}, body: content.trim() }
}

/**
 * Simple YAML frontmatter parser (supports common keys)
 */
function parseYamlFrontmatter(yaml: string): Record<string, any> {
  const result: Record<string, any> = {}
  const lines = yaml.split('\n')

  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.+)$/)
    if (match) {
      const [, key, value] = match
      result[key] = value
    }
  }

  return result
}

/**
 * Simple TOML frontmatter parser (supports common keys)
 */
function parseTomlFrontmatter(toml: string): Record<string, any> {
  const result: Record<string, any> = {}
  const lines = toml.split('\n')

  for (const line of lines) {
    const match = line.match(/^(\w+)\s*=\s*["'](.+)["']$/)
    if (match) {
      const [, key, value] = match
      result[key] = value
    }
  }

  return result
}

/**
 * Color codes for console output
 */
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  dim: '\x1b[2m',
}

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// ============== API Client ==============

class DevtoClient {
  private baseUrl: string
  private apiKey: string
  private lastRequestTime: number = 0

  constructor(apiKey: string, baseUrl: string = CONFIG.API_BASE) {
    this.apiKey = apiKey
    this.baseUrl = baseUrl
  }

  /**
   * Enforce rate limiting between requests
   */
  private async enforceRateLimit(): Promise<void> {
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime

    if (timeSinceLastRequest < CONFIG.RATE_LIMIT_DELAY) {
      const waitTime = CONFIG.RATE_LIMIT_DELAY - timeSinceLastRequest
      log(`Rate limit: waiting ${waitTime}ms...`, 'dim')
      await delay(waitTime)
    }

    this.lastRequestTime = Date.now()
  }

  /**
   * Make authenticated API request with retry logic
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount: number = 0
  ): Promise<T> {
    await this.enforceRateLimit()

    const url = `${this.baseUrl}${endpoint}`
    const headers = {
      'Content-Type': 'application/json',
      'API-Key': this.apiKey,
      'User-Agent': 'Devto-Publish-CLI/1.0',
      ...options.headers,
    }

    try {
      const response = await fetch(url, { ...options, headers })

      // Handle rate limiting (429)
      if (response.status === 429) {
        if (retryCount < CONFIG.MAX_RETRIES) {
          const retryDelay = getRetryDelay(retryCount)
          log(`Rate limited. Retrying in ${retryDelay}ms...`, 'yellow')
          await delay(retryDelay)
          return this.request<T>(endpoint, options, retryCount + 1)
        }
        throw new Error('Rate limit exceeded. Max retries reached.')
      }

      // Handle client errors
      if (!response.ok) {
        const errorData: DevtoErrorResponse = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(`HTTP ${response.status}: ${errorData.error}`)
      }

      return response.json()
    } catch (error) {
      // Retry on network errors
      if (retryCount < CONFIG.MAX_RETRIES && error instanceof Error && !error.message.includes('HTTP')) {
        const retryDelay = getRetryDelay(retryCount)
        log(`Network error. Retrying in ${retryDelay}ms...`, 'yellow')
        await delay(retryDelay)
        return this.request<T>(endpoint, options, retryCount + 1)
      }
      throw error
    }
  }

  /**
   * Get user's published articles
   */
  async getArticles(perPage: number = 1000, page: number = 1): Promise<DevtoArticleListItem[]> {
    return this.request<DevtoArticleListItem[]>(`/articles/me?per_page=${perPage}&page=${page}`)
  }

  /**
   * Check if article with title already exists
   */
  async articleExists(title: string): Promise<boolean> {
    try {
      const articles = await this.getArticles()
      const normalizedTitle = title.toLowerCase().trim()
      return articles.some(
        article => article.title.toLowerCase().trim() === normalizedTitle
      )
    } catch (error) {
      log(`Warning: Could not check for duplicates. Proceeding anyway...`, 'yellow')
      return false
    }
  }

  /**
   * Create a new article
   */
  async createArticle(article: DevtoArticle): Promise<DevtoArticleResponse> {
    return this.request<DevtoArticleResponse>('/articles', {
      method: 'POST',
      body: JSON.stringify({ article }),
    })
  }

  /**
   * Update an existing article
   */
  async updateArticle(id: number, article: DevtoArticle): Promise<DevtoArticleResponse> {
    return this.request<DevtoArticleResponse>(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ article }),
    })
  }
}

// ============== CLI ==============

interface CliOptions {
  title?: string
  file?: string
  tags?: string
  published?: boolean
  description?: string
  series?: string
  canonical?: string
  dryRun?: boolean
  update?: boolean
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2)
  const options: CliOptions = {}

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    const nextArg = args[i + 1]

    switch (arg) {
      case '--title':
        options.title = nextArg
        i++
        break
      case '--file':
        options.file = nextArg
        i++
        break
      case '--tags':
        options.tags = nextArg
        i++
        break
      case '--published':
        options.published = nextArg === 'true' || nextArg === undefined
        if (nextArg !== undefined) i++
        break
      case '--description':
        options.description = nextArg
        i++
        break
      case '--series':
        options.series = nextArg
        i++
        break
      case '--canonical':
        options.canonical = nextArg
        i++
        break
      case '--dry-run':
        options.dryRun = true
        break
      case '--update':
        options.update = true
        break
      case '--help':
        printHelp()
        process.exit(0)
        break
    }
  }

  return options
}

function printHelp() {
  console.log(`
Dev.to Auto-Publish CLI Tool

Usage:
  npx tsx scripts/devto-publish.ts [options]

Options:
  --title <string>          Article title (required unless in frontmatter)
  --file <path>             Path to markdown file (required)
  --tags <csv>              Comma-separated tags (required unless in frontmatter)
  --published [true|false]  Publish immediately or save as draft (default: true)
  --description <string>    Article description
  --series <string>         Series name for grouped articles
  --canonical <url>         Canonical URL for original post
  --dry-run                 Validate without posting
  --update                  Update existing article (matches by title)
  --help                    Show this help

Environment variables (required):
  DEVTO_API_KEY             Your Dev.to API key
  DEVTO_API_BASE           API base URL (default: https://dev.to/api)

Examples:
  # Publish new article
  npx tsx scripts/devto-publish.ts \\
    --title "My Article" \\
    --file ./posts/article.md \\
    --tags "javascript,typescript" \\
    --published true

  # Dry run to validate
  npx tsx scripts/devto-publish.ts \\
    --file ./posts/article.md \\
    --dry-run

  # Update existing article
  npx tsx scripts/devto-publish.ts \\
    --file ./posts/article.md \\
    --update

Frontmatter in markdown (overrides --tags, --title, etc.):
  ---
  title: My Article Title
  description: Article description
  tags: javascript, typescript
  published: true
  series: My Series
  canonical_url: https://example.com/original
  ---

  Article body starts here...
`)
}

async function main() {
  const options = parseArgs()

  // Check API key (skip for --help and --dry-run)
  if (!options.dryRun && !CONFIG.API_KEY) {
    log('Error: DEVTO_API_KEY environment variable not set', 'red')
    log('Get your API key from: https://dev.to/settings/extensions', 'blue')
    process.exit(1)
  }

  // Validate file path
  if (!options.file) {
    log('Error: --file is required', 'red')
    printHelp()
    process.exit(1)
  }

  const filePath = join(process.cwd(), options.file)

  if (!existsSync(filePath)) {
    log(`Error: File not found: ${filePath}`, 'red')
    process.exit(1)
  }

  // Read markdown file
  log(`Reading: ${filePath}`, 'dim')
  const content = readFileSync(filePath, 'utf-8')
  const { frontmatter, body } = parseMarkdown(content)

  // Merge options with frontmatter (frontmatter takes precedence)
  const title = frontmatter.title || options.title
  const tags = frontmatter.tags
    ? parseTags(frontmatter.tags as string)
    : options.tags
      ? parseTags(options.tags)
      : []
  const description = frontmatter.description || options.description
  const series = frontmatter.series || options.series
  const canonical = frontmatter.canonical_url || frontmatter.canonical || options.canonical
  const published = frontmatter.published !== undefined
    ? frontmatter.published === true
    : options.published !== undefined
      ? options.published
      : true

  // Validation
  if (!title) {
    log('Error: Title is required (use --title or frontmatter)', 'red')
    process.exit(1)
  }

  if (tags.length === 0) {
    log('Error: At least one tag is required (use --tags or frontmatter)', 'red')
    process.exit(1)
  }

  if (!body || body.length === 0) {
    log('Error: Article body is empty', 'red')
    process.exit(1)
  }

  // Show article preview
  log('\n═══════════════════════════════════════════════════════════════', 'blue')
  log('Dev.to Article Preview', 'blue')
  log('═══════════════════════════════════════════════════════════════', 'blue')
  log(`Title:       ${title}`, 'reset')
  log(`Description: ${description || '(none)'}`, 'reset')
  log(`Tags:        ${tags.join(', ')}`, 'reset')
  log(`Series:      ${series || '(none)'}`, 'reset')
  log(`Canonical:   ${canonical || '(none)'}`, 'reset')
  log(`Published:   ${published ? 'YES' : 'NO (draft)'}`, published ? 'green' : 'yellow')
  log(`Body length: ${body.length} chars`, 'dim')
  log('═══════════════════════════════════════════════════════════════\n', 'blue')

  // Dry run
  if (options.dryRun) {
    log('Dry run complete. Article is ready to publish.', 'green')
    process.exit(0)
  }

  // Initialize client
  const client = new DevtoClient(CONFIG.API_KEY, CONFIG.API_BASE)

  // Check for existing article
  if (!options.update) {
    log('Checking for existing articles with same title...', 'dim')
    const exists = await client.articleExists(title)

    if (exists) {
      log(`Error: Article "${title}" already exists on Dev.to`, 'red')
      log('Use --update to modify the existing article, or change the title.', 'yellow')
      process.exit(1)
    }
  }

  // Create article payload
  const article: DevtoArticle = {
    title,
    description,
    tags,
    series,
    canonical_url: canonical,
    published,
    body_markdown: body,
  }

  // Publish
  try {
    log(options.update ? 'Updating article...' : 'Publishing article...', 'dim')
    const result = await client.createArticle(article)

    log('\n═══════════════════════════════════════════════════════════════', 'green')
    log('Success! Article published', 'green')
    log('═══════════════════════════════════════════════════════════════', 'green')
    log(`URL: ${result.url}`, 'blue')
    log(`Path: ${result.path}`, 'dim')
    log(`ID: ${result.id}`, 'dim')
    log(`Published at: ${result.published_at}`, 'dim')
    log('═══════════════════════════════════════════════════════════════\n', 'green')

    process.exit(0)
  } catch (error) {
    log(`\nError: ${error instanceof Error ? error.message : 'Unknown error'}`, 'red')

    if (error instanceof Error) {
      if (error.message.includes('401')) {
        log('Hint: Check your DEVTO_API_KEY is valid', 'yellow')
      } else if (error.message.includes('422')) {
        log('Hint: Check your article content meets Dev.to requirements', 'yellow')
      } else if (error.message.includes('429')) {
        log('Hint: Rate limit exceeded. Wait a few minutes and try again', 'yellow')
      }
    }

    process.exit(1)
  }
}

main().catch(error => {
  log(`Fatal error: ${error}`, 'red')
  process.exit(1)
})
