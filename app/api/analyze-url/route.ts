import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { analyzeURL, getAuthoritativeDomain } from '@/lib/services/url-analyzer'
import { getDataForSEOMetrics } from '@/lib/services/dataforseo-api'
import { estimateDomainRank, identifyIssues, generateSuggestions } from '@/lib/services/eeat-scorer'
import { calculateInstantEEATScores as calculateInstantEEATScoresV2, calculateBlogEEATScores } from '@/lib/services/eeat-scorer-v2'
import { analyzeContentWithNLP } from '@/lib/services/nlp-analyzer'
import { checkAuthorReputation, type ReputationResult } from '@/lib/services/reputation-checker'
import { inngest } from '@/lib/inngest/client'
import { BlogDiscoveryService } from '@/lib/services/blog-discovery'
import { analyzeBlogPosts } from '@/lib/services/batch-analyzer'
import {
  calculateBlogInsights,
  generateBlogIssues,
  generateBlogSuggestions
} from '@/lib/services/blog-strategy-scorer'
import type { BlogAnalysisProgress } from '@/lib/types/blog-analysis'

// Force Node.js runtime for Buffer support and external API calls
export const runtime = 'nodejs'

// Lazy initialize Resend to avoid build-time errors
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('RESEND_API_KEY not configured - emails will not be sent')
    return null
  }
  return new Resend(apiKey)
}

function isValidURL(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Detect if input is a domain (for blog analysis) or specific URL (for single-page analysis)
 * Domain indicators: no path, or path is just "/" or "/blog" or "/articles"
 */
function isDomainForBlogAnalysis(url: string): boolean {
  try {
    const urlObj = new URL(url)
    const path = urlObj.pathname

    // Root domain or common blog paths
    if (path === '/' || path === '') {
      return true
    }

    // Common blog section paths
    const blogPaths = ['/blog', '/blog/', '/articles', '/articles/', '/posts', '/posts/', '/news', '/news/']
    if (blogPaths.includes(path.toLowerCase())) {
      return true
    }

    // Otherwise, treat as specific URL for single-page analysis
    return false
  } catch {
    return false
  }
}

/**
 * Handle blog analysis for a domain
 */
async function handleBlogAnalysis(domain: string, email?: string) {
  console.log('Starting blog analysis for:', domain)

  try {
    // Step 1: Discover blog posts via sitemap
    const discovery = await BlogDiscoveryService.discoverBlogPosts(domain, 50)

    if (discovery.error || discovery.posts.length === 0) {
      // Return detailed diagnostic info to help debug
      return NextResponse.json(
        {
          error: discovery.error || 'No blog posts found',
          debug: {
            totalUrlsFound: discovery.totalFound || 0,
            postsAfterFiltering: discovery.posts.length,
            discoverySource: discovery.source,
            message: 'Check Vercel server logs for detailed [DEBUG] output showing which URLs were fetched and filtered',
          },
          suggestion: 'Please ensure your site has a sitemap.xml file with blog posts, or try entering a specific blog post URL.',
        },
        { status: 404 }
      )
    }

    console.log(`Discovered ${discovery.posts.length} blog posts (${discovery.totalFound} total)`)

    // Step 2: Limit to 20 posts for analysis (to control API costs)
    const postsToAnalyze = discovery.posts.slice(0, 20)

    console.log(`Analyzing ${postsToAnalyze.length} posts...`)

    // Step 3: Batch analyze posts
    // BUG FIX (2025-11-12): Pass full BlogPost objects (with lastmod) instead of just URLs
    const batchResult = await analyzeBlogPosts(postsToAnalyze, {
      maxConcurrent: 3,
      onProgress: (progress: BlogAnalysisProgress) => {
        console.log(
          `Progress: ${progress.analyzedPosts}/${progress.totalPosts} (${progress.percentage}%)`
        )
      },
    })

    if (batchResult.successful.length === 0) {
      return NextResponse.json(
        {
          error: 'Failed to analyze blog posts',
          details: batchResult.failed.map(f => `${f.url}: ${f.error}`),
        },
        { status: 500 }
      )
    }

    console.log(
      `Batch analysis complete: ${batchResult.successful.length} successful, ${batchResult.failed.length} failed`
    )

    // Step 4: Calculate blog insights and E-E-A-T scores
    const blogInsights = calculateBlogInsights(batchResult.successful)
    const eeatScore = await calculateBlogEEATScores(
      batchResult.successful,
      blogInsights
    )
    const issues = generateBlogIssues(blogInsights, batchResult.successful)
    const suggestions = generateBlogSuggestions(blogInsights)

    // Step 5: Format response
    const instantAnalysis = {
      type: 'blog' as const,
      eeatScore, // New variable-based structure
      score: eeatScore.overall, // Backward compatibility
      blogScore: blogInsights.overallBlogScore,
      breakdown: { // Backward compatibility
        experience: eeatScore.categories.experience.totalScore,
        expertise: eeatScore.categories.expertise.totalScore,
        authoritativeness: eeatScore.categories.authoritativeness.totalScore,
        trustworthiness: eeatScore.categories.trustworthiness.totalScore,
      },
      blogInsights: {
        publishingFrequency: {
          score: blogInsights.publishingFrequency.score,
          postsPerMonth: blogInsights.publishingFrequency.postsPerMonth,
          trend: blogInsights.publishingFrequency.trend,
          recommendation: blogInsights.publishingFrequency.recommendation,
        },
        contentDepth: {
          score: blogInsights.contentDepth.score,
          avgWordCount: blogInsights.contentDepth.avgWordCount,
          avgCitations: blogInsights.contentDepth.avgCitations,
          distribution: blogInsights.contentDepth.distribution,
          recommendation: blogInsights.contentDepth.recommendation,
        },
        topicDiversity: {
          score: blogInsights.topicDiversity.score,
          uniqueTopics: blogInsights.topicDiversity.uniqueTopics,
          topKeywords: blogInsights.topicDiversity.topKeywords.slice(0, 10),
          coverage: blogInsights.topicDiversity.coverage,
          recommendation: blogInsights.topicDiversity.recommendation,
        },
        authorConsistency: {
          score: blogInsights.authorConsistency.score,
          totalAuthors: blogInsights.authorConsistency.totalAuthors,
          attributionRate: blogInsights.authorConsistency.attributionRate,
          primaryAuthors: blogInsights.authorConsistency.primaryAuthors,
          consistency: blogInsights.authorConsistency.consistency,
          recommendation: blogInsights.authorConsistency.recommendation,
        },
        schemaAdoption: {
          score: blogInsights.schemaAdoption.score,
          adoptionRate: blogInsights.schemaAdoption.adoptionRate,
          commonTypes: blogInsights.schemaAdoption.commonSchemaTypes.slice(0, 5),
          recommendation: blogInsights.schemaAdoption.recommendation,
        },
        internalLinking: {
          score: blogInsights.internalLinking.score,
          avgLinksPerPost: blogInsights.internalLinking.avgInternalLinksPerPost,
          networkStrength: blogInsights.internalLinking.networkStrength,
          recommendation: blogInsights.internalLinking.recommendation,
        },
      },
      domainInfo: {
        domain,
        postsAnalyzed: batchResult.successful.length,
        totalPostsFound: discovery.totalFound,
        failedAnalyses: batchResult.failed.length,
      },
      issues: issues.map(issue => ({
        type: issue.severity === 'critical' || issue.severity === 'high' ? 'missing' : issue.severity === 'medium' ? 'warning' : 'good',
        severity: issue.severity,
        message: issue.title,
        description: issue.description,
      })),
      suggestions: suggestions.map(s => s.description),
      topPosts: batchResult.successful
        .sort((a, b) => b.scores.overall - a.scores.overall)
        .slice(0, 5)
        .map(post => ({
          url: post.url,
          title: post.title,
          score: post.scores.overall,
          wordCount: post.wordCount,
        })),
      bottomPosts: batchResult.successful
        .sort((a, b) => a.scores.overall - b.scores.overall)
        .slice(0, 5)
        .map(post => ({
          url: post.url,
          title: post.title,
          score: post.scores.overall,
          wordCount: post.wordCount,
        })),
    }

    console.log('Blog analysis complete:', {
      domain,
      score: eeatScore.overall,
      blogScore: blogInsights.overallBlogScore,
      postsAnalyzed: batchResult.successful.length,
    })

    // Step 6: If email provided, trigger comprehensive analysis via Inngest
    if (email) {
      try {
        await inngest.send({
          name: 'eeat/analysis.blog-comprehensive',
          data: {
            domain,
            email,
            blogPosts: batchResult.successful,
            blogInsights,
            eeatScore, // New variable-based structure
          },
        })

        console.log('Triggered comprehensive blog analysis for:', email)

        return NextResponse.json({
          success: true,
          instant: instantAnalysis,
          comprehensive: {
            status: 'processing',
            estimatedTime: '3-5 minutes',
            message: 'Comprehensive blog strategy analysis with AI insights will be emailed to you shortly',
            features: [
              'Domain authority metrics (traffic, keywords, rank)',
              'AI content quality analysis across all posts',
              'Author reputation verification',
              'Content gap identification',
              'Competitor comparison',
              'Detailed blog strategy recommendations',
            ],
          },
        })
      } catch (inngestError) {
        console.error('Failed to trigger comprehensive blog analysis:', inngestError)
        // Fall through to return instant analysis only
      }
    }

    // No email provided - return instant analysis with upgrade prompt
    return NextResponse.json({
      success: true,
      instant: instantAnalysis,
      comprehensive: {
        status: 'not_requested',
        message: 'Want deeper insights? Provide your email for comprehensive AI-powered blog analysis',
        features: [
          'Domain authority metrics from DataForSEO',
          'AI content quality analysis via OpenAI GPT-4',
          'Author reputation verification via web search',
          'Content gap identification',
          'Competitor comparison',
          'Enhanced recommendations with priority rankings',
        ],
      },
    })
  } catch (error) {
    console.error('Blog analysis error:', error)
    return NextResponse.json(
      {
        error: 'Failed to analyze blog',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url, email } = await request.json()

    // Validate URL format
    if (!url || typeof url !== 'string' || url.trim() === '') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Normalize URL before validation
    let normalizedUrl = url.trim()
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl
    }

    // Validate URL structure
    if (!isValidURL(normalizedUrl)) {
      return NextResponse.json(
        { error: 'Invalid URL format. Please enter a valid domain (e.g., example.com)' },
        { status: 400 }
      )
    }

    // Detect if this is a domain (blog analysis) or specific URL (single-page analysis)
    const isBlogAnalysis = isDomainForBlogAnalysis(normalizedUrl)

    if (isBlogAnalysis) {
      // BLOG ANALYSIS MODE
      // Add timeout wrapper as backup (2 minutes for discovery + analysis)
      const BLOG_ANALYSIS_TIMEOUT = 120000 // 2 minutes
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Blog analysis timed out. This may indicate circular sitemap references or very large sitemaps.'))
        }, BLOG_ANALYSIS_TIMEOUT)
      })

      try {
        return await Promise.race([
          handleBlogAnalysis(normalizedUrl, email),
          timeoutPromise
        ])
      } catch (error) {
        if (error instanceof Error && error.message.includes('timed out')) {
          return NextResponse.json(
            { error: error.message },
            { status: 504 } // Gateway Timeout
          )
        }
        throw error
      }
    }

    // SINGLE-PAGE ANALYSIS MODE (existing behavior)
    // Perform instant E-E-A-T analysis (no external APIs)
    console.log('Starting instant E-E-A-T analysis for:', normalizedUrl)

    // First, analyze the page to get redirects and canonical URL
    const pageAnalysis = await analyzeURL(normalizedUrl).catch((err) => {
      console.error('Page analysis failed:', err.message)

      // Provide user-friendly error messages
      if (err.message.includes('Failed to fetch')) {
        if (err.message.includes('404')) {
          throw new Error('We couldn\'t find that page. Please check the URL and try again.')
        } else if (err.message.includes('403') || err.message.includes('401')) {
          throw new Error('This website is blocking automated access. Please try a different URL.')
        } else if (err.message.includes('500') || err.message.includes('502') || err.message.includes('503')) {
          throw new Error('The website is experiencing technical issues. Please try again later.')
        } else if (err.message.includes('timeout') || err.message.includes('ECONNREFUSED')) {
          throw new Error('Unable to connect to this website. Please verify the URL is correct and try again.')
        }
      }

      // Generic fallback
      throw new Error('We couldn\'t analyze this URL. Please verify it\'s a valid, publicly accessible website.')
    })

    // Get the authoritative domain (canonical > finalUrl > original)
    const authoritativeDomain = getAuthoritativeDomain(pageAnalysis)
    console.log('Domain resolution:', {
      entered: normalizedUrl,
      finalUrl: pageAnalysis.finalUrl,
      canonical: pageAnalysis.canonicalUrl,
      authoritative: authoritativeDomain,
    })

    // Calculate instant E-E-A-T scores with fast external APIs (DataForSEO + Brave Search)
    const eeatScore = await calculateInstantEEATScoresV2(pageAnalysis, authoritativeDomain)

    // Generate instant issues and suggestions (without LLM enhancements)
    const estimatedMetrics = {
      domainRank: estimateDomainRank(pageAnalysis), // Smart estimation based on page quality
      pageRank: 0,
      backlinks: 0,
      referringDomains: 0,
      referringMainDomains: 0,
      followedBacklinks: 0,
      nofollowedBacklinks: 0,
      govBacklinks: 0,
      eduBacklinks: 0,
      spamScore: 0,
      organicKeywords: 0,
      organicTraffic: 0,
      organicTrafficValue: 0,
    }
    // Create backward-compatible scores object for old functions
    const legacyScores = {
      overall: eeatScore.overall,
      experience: eeatScore.categories.experience.totalScore,
      expertise: eeatScore.categories.expertise.totalScore,
      authoritativeness: eeatScore.categories.authoritativeness.totalScore,
      trustworthiness: eeatScore.categories.trustworthiness.totalScore,
    }
    const instantIssues = identifyIssues(pageAnalysis, estimatedMetrics, legacyScores, null, [])
    const instantSuggestions = generateSuggestions(pageAnalysis, estimatedMetrics, legacyScores, null, [])

    // Format instant analysis results
    const instantAnalysis = {
      eeatScore, // New variable-based structure
      score: eeatScore.overall, // Backward compatibility
      breakdown: { // Backward compatibility
        experience: eeatScore.categories.experience.totalScore,
        expertise: eeatScore.categories.expertise.totalScore,
        authoritativeness: eeatScore.categories.authoritativeness.totalScore,
        trustworthiness: eeatScore.categories.trustworthiness.totalScore,
      },
      domainInfo: {
        entered: normalizedUrl,
        analyzed: authoritativeDomain,
        redirected: pageAnalysis.finalUrl !== normalizedUrl,
        canonical: pageAnalysis.canonicalUrl,
      },
      issues: instantIssues.map(issue => ({
        type: issue.severity === 'critical' || issue.severity === 'high' ? 'missing' : issue.severity === 'medium' ? 'warning' : 'good',
        severity: issue.severity,
        message: issue.title,
        description: issue.description,
      })),
      suggestions: instantSuggestions.map(s => s.description),
      metrics: {
        wordCount: pageAnalysis.wordCount,
        readabilityScore: pageAnalysis.readabilityScore,
        citations: pageAnalysis.citations,
        authors: pageAnalysis.authors.length,
        schemaMarkup: pageAnalysis.schemaMarkup.length,
        hasSSL: pageAnalysis.hasSSL,
      },
    }

    console.log('Instant E-E-A-T analysis complete:', { url, score: eeatScore.overall })

    // If email provided, trigger comprehensive analysis via Inngest
    if (email) {
      try {
        await inngest.send({
          name: 'eeat/analysis.comprehensive',
          data: {
            url: normalizedUrl,
            email,
            pageAnalysis,
            instantEEATScore: eeatScore, // Include instant score for reference
          },
        })

        console.log('Triggered comprehensive E-E-A-T analysis for:', email)

        return NextResponse.json({
          success: true,
          instant: instantAnalysis,
          comprehensive: {
            status: 'processing',
            estimatedTime: '2-4 minutes',
            message: 'Comprehensive analysis with AI-powered insights will be emailed to you shortly',
            features: [
              'Domain authority metrics (traffic, keywords, rank)',
              'AI content quality analysis (tone, experience, AI detection)',
              'Author reputation verification (profiles, publications, media)',
              'Enhanced E-E-A-T score with all intelligence layers',
              'Detailed actionable recommendations'
            ]
          },
        })
      } catch (inngestError) {
        console.error('Failed to trigger comprehensive analysis:', inngestError)
        // Fall through to return instant analysis only
      }
    }

    // No email provided - return instant analysis with upgrade prompt
    return NextResponse.json({
      success: true,
      instant: instantAnalysis,
      comprehensive: {
        status: 'not_requested',
        message: 'Want deeper insights? Provide your email for comprehensive AI-powered analysis',
        features: [
          'Domain authority metrics from DataForSEO',
          'AI content quality analysis via OpenAI GPT-4',
          'Author reputation verification via web search',
          'Enhanced E-E-A-T score (+8-21 potential points)',
          'Detect AI-generated content and promotional tone',
          'Verify author credentials and professional presence'
        ]
      },
    })
  } catch (error) {
    console.error('Error analyzing URL:', error)
    return NextResponse.json(
      { error: 'Failed to analyze URL' },
      { status: 500 }
    )
  }
}
