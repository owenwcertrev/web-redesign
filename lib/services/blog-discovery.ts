import { SitemapStream, parseSitemap } from 'sitemap';
import { Readable } from 'stream';
import { gunzipSync } from 'zlib';

export interface BlogPost {
  url: string;
  lastmod?: Date;
  priority?: number;
  changefreq?: string;
}

export interface BlogDiscoveryResult {
  posts: BlogPost[];
  totalFound: number;
  source: 'sitemap' | 'rss' | 'html' | 'manual';
  error?: string;
}

/**
 * Enterprise-grade blog discovery service
 * Discovers blog posts from sitemaps, RSS feeds, and HTML sitemaps with comprehensive redundancies
 */
export class BlogDiscoveryService {
  // Configuration constants
  private static readonly MAX_RETRY_ATTEMPTS = 3;
  private static readonly MAX_SITEMAP_DEPTH = 5;
  private static readonly MAX_CONCURRENT_FETCHES = 5;
  private static readonly FETCH_TIMEOUT = 10000; // 10 seconds

  // Expanded sitemap paths (P1)
  private static readonly SITEMAP_PATHS = [
    '/sitemap.xml',
    '/sitemap_index.xml',
    '/blog-sitemap.xml',
    '/post-sitemap.xml',
    '/sitemap-posts.xml',
    '/news-sitemap.xml',
    '/page-sitemap.xml',
    '/category-sitemap.xml',
    '/author-sitemap.xml',
    '/sitemap-misc.xml',
    '/sitemaps/sitemap.xml',
    '/blog/sitemap.xml',
    '/wp-sitemap.xml',
    '/wp-sitemap-posts-post-1.xml',
    '/sitemap.xml.gz', // Compressed sitemap
  ];

  // RSS/Atom feed paths (P1)
  private static readonly RSS_FEED_PATHS = [
    '/feed',
    '/feed/',
    '/rss',
    '/rss.xml',
    '/atom.xml',
    '/blog/feed',
    '/blog/rss',
    '/index.xml',
    // Shopify-specific feed paths (plural /blogs/)
    '/blogs/journal.atom',
    '/blogs/news.atom',
    '/blogs/journal',
    '/blogs/news',
  ];

  // HTML sitemap paths (P2)
  private static readonly HTML_SITEMAP_PATHS = [
    '/sitemap',
    '/sitemap.html',
    '/site-map',
    '/sitemap.htm',
  ];

  private static readonly BLOG_URL_PATTERNS = [
    /\/blogs?\//i,  // Matches both /blog/ and /blogs/ (Shopify uses plural)
    /\/article\//i,
    /\/articles\//i,
    /\/post\//i,
    /\/posts\//i,
    /\/news\//i,
    /\/insights\//i,
    /\/learn\//i,
    /\/resources\//i,
    /\/stories\//i,
    /\/opinion\//i,
    // Date patterns: /2024/01/post-title
    /\/\d{4}\/\d{1,2}\//,
    // Multi-segment paths (more likely to be articles): /health/diabetes/article-title
    /\/[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+\/?$/i,
    // Long slugs (15+ chars likely articles): /nutrition/how-many-calories-per-day
    /\/[a-z0-9-]+\/[a-z0-9-]{15,}\/?$/i,
    // Two-segment paths (articles with category): /nutrition/article-title
    /\/[a-z0-9-]+\/[a-z0-9-]+\/?$/i,
  ];

  private static readonly EXCLUDE_PATTERNS = [
    // Specific pages
    /\/(about|contact|privacy|terms|cookie|legal|faq|help|support|pricing|features|services|team|careers)\/?$/i,
    // WordPress/admin paths
    /\/(wp-content|wp-includes|wp-admin)/i,
    // File extensions
    /\.(jpg|jpeg|png|gif|svg|pdf|zip|css|js|woff|woff2|ttf|eot|ico)$/i,
    // Homepage (just domain with optional trailing slash)
    /^https?:\/\/[^\/]+\/?$/i,
    // Directory pages
    /\/directory\//i,
    // Single-segment paths (category hubs like /health, /nutrition, /topics)
    /^https?:\/\/[^\/]+\/[a-z-]+\/?$/i,
    // Blog category/tag pages (Shopify: /blogs/news, WordPress: /blog/category)
    /^https?:\/\/[^\/]+\/blogs?\/[a-z0-9-]+\/?$/i,
  ];

  /**
   * Normalize domain input to base URL
   */
  private static normalizeDomain(input: string): string {
    let url = input.trim();

    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    try {
      const urlObj = new URL(url);
      // Return just the origin (protocol + domain)
      return urlObj.origin;
    } catch (error) {
      throw new Error(`Invalid domain: ${input}`);
    }
  }

  /**
   * Check if URL matches blog post patterns
   */
  private static isBlogPost(url: string): boolean {
    // Exclude common non-blog pages
    if (this.EXCLUDE_PATTERNS.some(pattern => pattern.test(url))) {
      return false;
    }

    // Match blog URL patterns
    return this.BLOG_URL_PATTERNS.some(pattern => pattern.test(url));
  }

  /**
   * P2: Check if URL exists using HEAD request (optimization)
   */
  private static async checkWithHead(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'CertRev-EEAT-Analyzer/1.0 (+https://certrev.com)',
        },
        signal: AbortSignal.timeout(5000), // Shorter timeout for HEAD
      });
      return response.ok;
    } catch {
      // If HEAD fails, we'll try GET anyway (some servers block HEAD)
      return true;
    }
  }

  /**
   * P0: Retry fetch with exponential backoff
   */
  private static async retryFetch(
    url: string,
    attempt: number = 1
  ): Promise<Response> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'CertRev-EEAT-Analyzer/1.0 (+https://certrev.com)',
          'Accept-Encoding': 'gzip, deflate',
        },
        signal: AbortSignal.timeout(this.FETCH_TIMEOUT),
      });

      // Retry on specific status codes
      if (
        (response.status === 429 || // Rate limited
          response.status >= 500) && // Server error
        attempt < this.MAX_RETRY_ATTEMPTS
      ) {
        // Check for Retry-After header
        const retryAfter = response.headers.get('Retry-After');
        const delay = retryAfter
          ? parseInt(retryAfter) * 1000
          : this.calculateBackoff(attempt);

        console.log(
          `Retrying ${url} after ${delay}ms (attempt ${attempt}/${this.MAX_RETRY_ATTEMPTS})`
        );
        await this.sleep(delay);
        return this.retryFetch(url, attempt + 1);
      }

      return response;
    } catch (error) {
      // Retry on network errors (timeout, connection refused, etc.)
      if (attempt < this.MAX_RETRY_ATTEMPTS) {
        const delay = this.calculateBackoff(attempt);
        console.log(
          `Network error for ${url}, retrying after ${delay}ms (attempt ${attempt}/${this.MAX_RETRY_ATTEMPTS})`
        );
        await this.sleep(delay);
        return this.retryFetch(url, attempt + 1);
      }
      throw error;
    }
  }

  /**
   * Calculate exponential backoff with jitter
   */
  private static calculateBackoff(attempt: number): number {
    const baseDelay = 1000; // 1 second
    const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
    const jitter = Math.random() * 1000; // Add up to 1 second jitter
    return Math.min(exponentialDelay + jitter, 5000); // Max 5 seconds
  }

  /**
   * Sleep helper for delays
   */
  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * P0: Decompress gzipped content
   */
  private static async decompressGzip(buffer: Buffer): Promise<string> {
    try {
      const decompressed = gunzipSync(buffer);
      return decompressed.toString('utf-8');
    } catch (error) {
      throw new Error('Failed to decompress gzip content');
    }
  }

  /**
   * P0: Fetch and parse robots.txt for sitemap declarations
   */
  private static async fetchRobotsTxt(baseUrl: string): Promise<string[]> {
    const sitemapUrls: string[] = [];

    try {
      console.log('Checking robots.txt for sitemap declarations...');
      const response = await this.retryFetch(`${baseUrl}/robots.txt`);

      if (!response.ok) {
        console.log('robots.txt not found or inaccessible');
        return sitemapUrls;
      }

      const robotsTxt = await response.text();

      // Parse Sitemap: directives
      const sitemapRegex = /^Sitemap:\s*(.+)$/gim;
      const matches = Array.from(robotsTxt.matchAll(sitemapRegex));

      for (const match of matches) {
        const sitemapUrl = match[1].trim();
        sitemapUrls.push(sitemapUrl);
        console.log(`Found sitemap in robots.txt: ${sitemapUrl}`);
      }
    } catch (error) {
      console.log('Failed to fetch robots.txt:', error);
    }

    return sitemapUrls;
  }

  /**
   * P0: Fetch and parse a sitemap XML file with retry and compression support
   */
  private static async fetchSitemap(
    url: string,
    depth: number = 0
  ): Promise<BlogPost[]> {
    // Prevent infinite recursion
    if (depth > this.MAX_SITEMAP_DEPTH) {
      console.warn(`Max sitemap depth (${this.MAX_SITEMAP_DEPTH}) reached for ${url}`);
      return [];
    }

    try {
      // P2: Optional HEAD check for existence
      // Disabled by default to avoid extra requests
      // const exists = await this.checkWithHead(url);
      // if (!exists) return [];

      const response = await this.retryFetch(url);

      if (!response.ok) {
        // P0: Improved error handling
        if (response.status === 404) {
          console.log(`Sitemap not found (404): ${url}`);
        } else if (response.status === 403 || response.status === 401) {
          console.warn(`Access denied (${response.status}): ${url}`);
        } else {
          console.error(`HTTP ${response.status}: ${response.statusText} for ${url}`);
        }
        return [];
      }

      // Check if content is gzipped
      // Note: Fetch API auto-decompresses Content-Encoding: gzip
      // Only manually decompress if URL explicitly ends with .gz
      const isGzipped = url.endsWith('.gz');

      let xmlText: string;
      if (isGzipped) {
        // P0: Decompress gzipped content (.gz files only)
        const buffer = Buffer.from(await response.arrayBuffer());
        xmlText = await this.decompressGzip(buffer);
        console.log(`Decompressed .gz sitemap: ${url}`);
      } else {
        xmlText = await response.text();
      }

      // Parse sitemap XML
      const urls = await this.parseSitemapXML(xmlText);

      // P0: Fix nested sitemap recursion
      // Always check for nested sitemaps (not just when path includes 'index')
      const nestedSitemaps = urls.filter(
        p => p.url.includes('sitemap') && (p.url.endsWith('.xml') || p.url.endsWith('.xml.gz'))
      );

      if (nestedSitemaps.length > 0) {
        console.log(`Found ${nestedSitemaps.length} nested sitemaps in ${url}`);

        // P2: Fetch nested sitemaps in parallel with concurrency control
        const nestedPosts = await this.fetchSitemapsInParallel(
          nestedSitemaps.map(s => s.url),
          depth + 1
        );

        // Filter out the nested sitemap URLs themselves, keep only the posts
        const actualPosts = urls.filter(
          p => !nestedSitemaps.some(nested => nested.url === p.url)
        );

        return [...actualPosts, ...nestedPosts];
      }

      return urls;
    } catch (error) {
      console.error(`Failed to fetch sitemap ${url}:`, error);
      return [];
    }
  }

  /**
   * P2: Fetch multiple sitemaps in parallel with concurrency control
   */
  private static async fetchSitemapsInParallel(
    urls: string[],
    depth: number
  ): Promise<BlogPost[]> {
    const allPosts: BlogPost[] = [];

    // Process in chunks to control concurrency
    for (let i = 0; i < urls.length; i += this.MAX_CONCURRENT_FETCHES) {
      const chunk = urls.slice(i, i + this.MAX_CONCURRENT_FETCHES);
      const chunkResults = await Promise.all(
        chunk.map(url => this.fetchSitemap(url, depth))
      );

      for (const posts of chunkResults) {
        allPosts.push(...posts);
      }
    }

    return allPosts;
  }

  /**
   * Parse sitemap XML content
   */
  private static async parseSitemapXML(xmlContent: string): Promise<BlogPost[]> {
    const posts: BlogPost[] = [];

    try {
      // Parse using sitemap library - convert string to Readable stream
      const stream = Readable.from([xmlContent]);
      const parsed = await parseSitemap(stream);

      for (const entry of parsed) {
        if (entry.url) {
          posts.push({
            url: entry.url,
            lastmod: entry.lastmod ? new Date(entry.lastmod) : undefined,
            priority: entry.priority,
            changefreq: entry.changefreq,
          });
        }
      }
    } catch (error) {
      console.error('Failed to parse sitemap XML:', error);

      // Fallback: Manual XML parsing using regex
      const urlMatches = Array.from(xmlContent.matchAll(/<loc>([^<]+)<\/loc>/g));
      for (const match of urlMatches) {
        posts.push({ url: match[1] });
      }
    }

    return posts;
  }

  /**
   * Try to find sitemaps using multiple strategies
   */
  private static async fetchSitemapIndex(baseUrl: string): Promise<BlogPost[]> {
    const allPosts: BlogPost[] = [];
    const urlsSeen = new Set<string>(); // P1: URL deduplication

    // Strategy 1: Check robots.txt for sitemap declarations (P0)
    const robotsSitemaps = await this.fetchRobotsTxt(baseUrl);

    // Combine robots.txt sitemaps with common paths
    const sitemapsToTry = [
      ...robotsSitemaps,
      ...this.SITEMAP_PATHS.map(path => baseUrl + path),
    ];

    console.log(`Trying ${sitemapsToTry.length} sitemap locations...`);

    // Fetch all sitemaps (P2: parallel with concurrency control)
    const sitemapResults = await this.fetchSitemapsInParallel(sitemapsToTry, 0);

    // P1: Deduplicate URLs
    for (const post of sitemapResults) {
      if (!urlsSeen.has(post.url)) {
        urlsSeen.add(post.url);
        allPosts.push(post);
      }
    }

    return allPosts;
  }

  /**
   * P1: Fetch and parse RSS/Atom feeds as fallback
   */
  private static async fetchRSSFeeds(baseUrl: string): Promise<BlogPost[]> {
    console.log('Attempting RSS/Atom feed discovery as fallback...');
    const posts: BlogPost[] = [];

    for (const path of this.RSS_FEED_PATHS) {
      try {
        const feedUrl = baseUrl + path;
        const response = await this.retryFetch(feedUrl);

        if (!response.ok) continue;

        const feedXml = await response.text();

        // Parse RSS 2.0 and Atom feeds
        const urlMatches = Array.from(
          feedXml.matchAll(/<link[^>]*>([^<]+)<\/link>|<link[^>]*href=["']([^"']+)["']/g)
        );

        for (const match of urlMatches) {
          const url = match[1] || match[2];
          if (url && url.startsWith('http')) {
            posts.push({ url: url.trim() });
          }
        }

        if (posts.length > 0) {
          console.log(`Found ${posts.length} posts from RSS feed: ${path}`);
          return posts; // Return on first successful feed
        }
      } catch (error) {
        console.log(`Failed to fetch RSS feed ${path}:`, error);
      }
    }

    return posts;
  }

  /**
   * P2: Parse HTML sitemap as last resort
   */
  private static async parseHTMLSitemap(baseUrl: string): Promise<BlogPost[]> {
    console.log('Attempting HTML sitemap parsing as last resort...');
    const posts: BlogPost[] = [];

    for (const path of this.HTML_SITEMAP_PATHS) {
      try {
        const htmlUrl = baseUrl + path;
        const response = await this.retryFetch(htmlUrl);

        if (!response.ok) continue;

        const html = await response.text();

        // Extract all links from HTML
        const linkMatches = Array.from(
          html.matchAll(/<a[^>]+href=["']([^"']+)["']/g)
        );

        for (const match of linkMatches) {
          let url = match[1];

          // Convert relative URLs to absolute
          if (url.startsWith('/')) {
            url = baseUrl + url;
          } else if (!url.startsWith('http')) {
            continue; // Skip non-http links
          }

          // Filter for blog posts
          if (this.isBlogPost(url)) {
            posts.push({ url });
          }
        }

        if (posts.length > 0) {
          console.log(`Found ${posts.length} posts from HTML sitemap: ${path}`);
          return posts; // Return on first successful HTML sitemap
        }
      } catch (error) {
        console.log(`Failed to parse HTML sitemap ${path}:`, error);
      }
    }

    return posts;
  }

  /**
   * Discover blog posts from a domain with comprehensive fallback strategies
   * @param domain - Domain URL (e.g., "example.com" or "https://example.com")
   * @param limit - Maximum number of posts to return (default: 50)
   * @returns BlogDiscoveryResult with discovered posts
   */
  static async discoverBlogPosts(
    domain: string,
    limit: number = 50
  ): Promise<BlogDiscoveryResult> {
    try {
      // Normalize domain
      const baseUrl = this.normalizeDomain(domain);
      console.log(`\n========================================`);
      console.log(`Discovering blog posts for: ${baseUrl}`);
      console.log(`========================================\n`);

      // Strategy 1: Try sitemaps (including robots.txt)
      console.log('Strategy 1: XML Sitemaps (including robots.txt)');
      const allPosts = await this.fetchSitemapIndex(baseUrl);

      console.log(`[DEBUG] Total URLs fetched from sitemaps: ${allPosts.length}`);
      if (allPosts.length > 0) {
        console.log(`[DEBUG] Sample URLs (first 10):`, allPosts.slice(0, 10).map(p => p.url));
      }

      if (allPosts.length > 0) {
        // Filter for blog posts
        const blogPosts = allPosts.filter(post => this.isBlogPost(post.url));

        console.log(`[DEBUG] After isBlogPost filtering: ${blogPosts.length} blog posts`);
        console.log(`[DEBUG] Sample blog posts (first 10):`, blogPosts.slice(0, 10).map(p => p.url));
        console.log(`[DEBUG] Sample filtered OUT (first 10):`, allPosts.filter(p => !this.isBlogPost(p.url)).slice(0, 10).map(p => p.url));
        console.log(`\nFound ${blogPosts.length} blog posts out of ${allPosts.length} total URLs`);

        if (blogPosts.length > 0) {
          // Sort by date (most recent first) and priority
          const sortedPosts = blogPosts.sort((a, b) => {
            // Primary sort: by lastmod date
            if (a.lastmod && b.lastmod) {
              return b.lastmod.getTime() - a.lastmod.getTime();
            }
            if (a.lastmod) return -1;
            if (b.lastmod) return 1;

            // Secondary sort: by priority
            if (a.priority && b.priority) {
              return b.priority - a.priority;
            }

            return 0;
          });

          // Limit results
          const limitedPosts = sortedPosts.slice(0, limit);

          return {
            posts: limitedPosts,
            totalFound: blogPosts.length,
            source: 'sitemap',
          };
        }
      }

      // Strategy 2: Try RSS/Atom feeds
      console.log('\nStrategy 2: RSS/Atom Feeds');
      const rssPosts = await this.fetchRSSFeeds(baseUrl);

      if (rssPosts.length > 0) {
        const blogPosts = rssPosts.filter(post => this.isBlogPost(post.url));

        if (blogPosts.length > 0) {
          console.log(`Found ${blogPosts.length} posts via RSS feeds`);
          return {
            posts: blogPosts.slice(0, limit),
            totalFound: blogPosts.length,
            source: 'rss',
          };
        }
      }

      // Strategy 3: Try HTML sitemaps
      console.log('\nStrategy 3: HTML Sitemaps');
      const htmlPosts = await this.parseHTMLSitemap(baseUrl);

      if (htmlPosts.length > 0) {
        console.log(`Found ${htmlPosts.length} posts via HTML sitemap`);
        return {
          posts: htmlPosts.slice(0, limit),
          totalFound: htmlPosts.length,
          source: 'html',
        };
      }

      // All strategies failed
      return {
        posts: [],
        totalFound: 0,
        source: 'sitemap',
        error: 'No blog posts found. We tried sitemaps (including robots.txt), RSS feeds, and HTML sitemaps. Please try entering specific blog post URLs manually.',
      };
    } catch (error) {
      console.error('Blog discovery error:', error);
      return {
        posts: [],
        totalFound: 0,
        source: 'sitemap',
        error: error instanceof Error ? error.message : 'Unknown error during blog discovery',
      };
    }
  }

  /**
   * Manual blog post input (for when automatic discovery fails)
   * @param urls - Array of blog post URLs
   * @returns BlogDiscoveryResult
   */
  static manualBlogPosts(urls: string[]): BlogDiscoveryResult {
    const posts: BlogPost[] = urls.map(url => ({
      url: url.trim(),
    }));

    return {
      posts,
      totalFound: posts.length,
      source: 'manual',
    };
  }
}
