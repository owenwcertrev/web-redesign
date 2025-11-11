import { SitemapStream, parseSitemap } from 'sitemap';
import { Readable } from 'stream';

export interface BlogPost {
  url: string;
  lastmod?: Date;
  priority?: number;
  changefreq?: string;
}

export interface BlogDiscoveryResult {
  posts: BlogPost[];
  totalFound: number;
  source: 'sitemap' | 'manual';
  error?: string;
}

/**
 * Discovers blog posts from a domain by parsing sitemaps
 */
export class BlogDiscoveryService {
  private static readonly SITEMAP_PATHS = [
    '/sitemap.xml',
    '/sitemap_index.xml',
    '/blog-sitemap.xml',
    '/post-sitemap.xml',
    '/sitemap-posts.xml',
  ];

  private static readonly BLOG_URL_PATTERNS = [
    /\/blog\//i,
    /\/article\//i,
    /\/articles\//i,
    /\/post\//i,
    /\/posts\//i,
    /\/news\//i,
    /\/insights\//i,
    /\/learn\//i,
    /\/resources\//i,
    // Date patterns: /2024/01/post-title
    /\/\d{4}\/\d{1,2}\//,
    // Slug patterns (but not homepage, about, contact, etc.)
    /\/[a-z0-9-]+\/?$/i,
  ];

  private static readonly EXCLUDE_PATTERNS = [
    /\/(about|contact|privacy|terms|cookie|legal|faq|help|support|pricing|features)\/?$/i,
    /\/(wp-content|wp-includes|wp-admin)/i,
    /\.(jpg|jpeg|png|gif|svg|pdf|zip|css|js)$/i,
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
   * Fetch and parse a sitemap XML file
   */
  private static async fetchSitemap(url: string): Promise<BlogPost[]> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'CertRev-EEAT-Analyzer/1.0',
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const xmlText = await response.text();

      // Parse sitemap XML
      const urls = await this.parseSitemapXML(xmlText);

      return urls;
    } catch (error) {
      console.error(`Failed to fetch sitemap ${url}:`, error);
      return [];
    }
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
   * Try to find sitemap index and nested sitemaps
   */
  private static async fetchSitemapIndex(baseUrl: string): Promise<BlogPost[]> {
    const allPosts: BlogPost[] = [];

    for (const path of this.SITEMAP_PATHS) {
      const sitemapUrl = baseUrl + path;
      const posts = await this.fetchSitemap(sitemapUrl);

      if (posts.length > 0) {
        console.log(`Found ${posts.length} URLs in ${path}`);
        allPosts.push(...posts);

        // If we found a sitemap index, try to fetch nested sitemaps
        if (path.includes('index')) {
          const nestedSitemaps = posts.filter(p => p.url.includes('sitemap') && p.url.endsWith('.xml'));

          for (const nested of nestedSitemaps) {
            const nestedPosts = await this.fetchSitemap(nested.url);
            allPosts.push(...nestedPosts);
          }
        }
      }
    }

    return allPosts;
  }

  /**
   * Discover blog posts from a domain
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
      console.log(`Discovering blog posts for: ${baseUrl}`);

      // Fetch all sitemaps
      const allPosts = await this.fetchSitemapIndex(baseUrl);

      if (allPosts.length === 0) {
        return {
          posts: [],
          totalFound: 0,
          source: 'sitemap',
          error: 'No sitemap found. Please ensure your site has a sitemap.xml file.',
        };
      }

      // Filter for blog posts
      const blogPosts = allPosts.filter(post => this.isBlogPost(post.url));

      console.log(`Found ${blogPosts.length} blog posts out of ${allPosts.length} total URLs`);

      if (blogPosts.length === 0) {
        return {
          posts: [],
          totalFound: allPosts.length,
          source: 'sitemap',
          error: 'No blog posts found in sitemap. Try entering specific blog post URLs manually.',
        };
      }

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
   * Manual blog post input (for when sitemap parsing fails)
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
