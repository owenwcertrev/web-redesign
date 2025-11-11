/**
 * Blog Strategy Scorer
 * Calculates aggregate blog-level insights and strategy scores
 */

import type {
  BlogPostAnalysis,
  BlogInsights,
  PublishingFrequencyInsight,
  ContentDepthInsight,
  TopicDiversityInsight,
  AuthorConsistencyInsight,
  SchemaAdoptionInsight,
  InternalLinkingInsight,
  KeywordCluster,
  AuthorStats,
  SchemaTypeStats,
} from '../types/blog-analysis'
import type { EEATScore, Issue, Suggestion } from './eeat-scorer'

/**
 * Calculate comprehensive blog strategy insights from analyzed posts
 */
export function calculateBlogInsights(posts: BlogPostAnalysis[]): BlogInsights {
  if (posts.length === 0) {
    throw new Error('Cannot calculate blog insights with 0 posts')
  }

  const publishingFrequency = calculatePublishingFrequency(posts)
  const contentDepth = calculateContentDepth(posts)
  const topicDiversity = calculateTopicDiversity(posts)
  const authorConsistency = calculateAuthorConsistency(posts)
  const schemaAdoption = calculateSchemaAdoption(posts)
  const internalLinking = calculateInternalLinking(posts)

  // Overall blog score is weighted average
  const overallBlogScore = Math.round(
    publishingFrequency.score * 0.15 +
      contentDepth.score * 0.25 +
      topicDiversity.score * 0.15 +
      authorConsistency.score * 0.15 +
      schemaAdoption.score * 0.15 +
      internalLinking.score * 0.15
  )

  return {
    publishingFrequency,
    contentDepth,
    topicDiversity,
    authorConsistency,
    schemaAdoption,
    internalLinking,
    overallBlogScore,
  }
}

/**
 * Calculate publishing frequency and consistency
 */
function calculatePublishingFrequency(posts: BlogPostAnalysis[]): PublishingFrequencyInsight {
  const postsWithDates = posts.filter(p => p.publishedDate)

  if (postsWithDates.length < 2) {
    return {
      postsPerMonth: 0,
      totalPosts: posts.length,
      dateRange: {
        spanMonths: 0,
      },
      trend: 'unknown',
      score: 50, // Neutral score when dates unavailable
      recommendation:
        'Add published dates to your posts (in URL structure or schema markup) to track publishing frequency.',
    }
  }

  // Sort by date
  const sortedPosts = [...postsWithDates].sort(
    (a, b) => a.publishedDate!.getTime() - b.publishedDate!.getTime()
  )

  const earliest = sortedPosts[0].publishedDate!
  const latest = sortedPosts[sortedPosts.length - 1].publishedDate!

  const spanMs = latest.getTime() - earliest.getTime()
  const spanMonths = Math.max(1, spanMs / (1000 * 60 * 60 * 24 * 30))

  const postsPerMonth = postsWithDates.length / spanMonths

  // Determine trend (comparing first half to second half)
  const midpoint = Math.floor(sortedPosts.length / 2)
  const firstHalf = sortedPosts.slice(0, midpoint)
  const secondHalf = sortedPosts.slice(midpoint)

  const firstHalfMs =
    firstHalf[firstHalf.length - 1].publishedDate!.getTime() - firstHalf[0].publishedDate!.getTime()
  const secondHalfMs =
    secondHalf[secondHalf.length - 1].publishedDate!.getTime() -
    secondHalf[0].publishedDate!.getTime()

  const firstHalfRate = firstHalf.length / Math.max(1, firstHalfMs / (1000 * 60 * 60 * 24 * 30))
  const secondHalfRate =
    secondHalf.length / Math.max(1, secondHalfMs / (1000 * 60 * 60 * 24 * 30))

  let trend: PublishingFrequencyInsight['trend'] = 'stable'
  if (secondHalfRate > firstHalfRate * 1.3) {
    trend = 'increasing'
  } else if (secondHalfRate < firstHalfRate * 0.7) {
    trend = 'decreasing'
  } else if (Math.abs(secondHalfRate - firstHalfRate) > 2) {
    trend = 'irregular'
  }

  // Score based on frequency (optimal: 4-8 posts/month)
  let score = 50
  if (postsPerMonth >= 4 && postsPerMonth <= 8) {
    score = 100
  } else if (postsPerMonth >= 2 && postsPerMonth <= 12) {
    score = 80
  } else if (postsPerMonth >= 1 && postsPerMonth <= 16) {
    score = 60
  } else if (postsPerMonth < 1) {
    score = 30
  } else {
    score = 40 // Too frequent (> 16/month)
  }

  // Adjust for trend
  if (trend === 'decreasing') {
    score -= 10
  } else if (trend === 'increasing') {
    score += 10
  }

  score = Math.max(0, Math.min(100, score))

  // Generate recommendation
  let recommendation = ''
  if (postsPerMonth < 2) {
    recommendation = 'Increase publishing frequency to at least 2-4 posts per month for better SEO.'
  } else if (postsPerMonth > 12) {
    recommendation = 'Consider focusing on quality over quantity. 4-8 comprehensive posts per month is optimal.'
  } else if (trend === 'decreasing') {
    recommendation = 'Publishing frequency is declining. Maintain consistent output for better search rankings.'
  } else {
    recommendation = 'Publishing frequency is good. Maintain this consistency.'
  }

  return {
    postsPerMonth: Math.round(postsPerMonth * 10) / 10,
    totalPosts: posts.length,
    dateRange: {
      earliest,
      latest,
      spanMonths: Math.round(spanMonths),
    },
    trend,
    score,
    recommendation,
  }
}

/**
 * Calculate content depth and quality distribution
 */
function calculateContentDepth(posts: BlogPostAnalysis[]): ContentDepthInsight {
  const wordCounts = posts.map(p => p.wordCount)
  const avgWordCount = Math.round(wordCounts.reduce((a, b) => a + b, 0) / posts.length)

  // Calculate median
  const sorted = [...wordCounts].sort((a, b) => a - b)
  const medianWordCount =
    sorted.length % 2 === 0
      ? Math.round((sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2)
      : sorted[Math.floor(sorted.length / 2)]

  // Distribution
  const distribution = {
    short: wordCounts.filter(wc => wc < 500).length,
    medium: wordCounts.filter(wc => wc >= 500 && wc < 1500).length,
    long: wordCounts.filter(wc => wc >= 1500 && wc < 3000).length,
    comprehensive: wordCounts.filter(wc => wc >= 3000).length,
  }

  // Average citations and readability
  const avgCitations =
    posts.reduce((sum, p) => sum + p.pageAnalysis.citations, 0) / posts.length
  const avgReadability =
    posts.reduce((sum, p) => sum + p.pageAnalysis.readabilityScore, 0) / posts.length

  // Score based on word count and quality
  let score = 50

  // Word count scoring (optimal: 1500-3000)
  if (avgWordCount >= 1500 && avgWordCount <= 3000) {
    score += 30
  } else if (avgWordCount >= 1000 && avgWordCount <= 4000) {
    score += 20
  } else if (avgWordCount >= 500) {
    score += 10
  }

  // Citations scoring
  if (avgCitations >= 5) {
    score += 15
  } else if (avgCitations >= 3) {
    score += 10
  } else if (avgCitations >= 1) {
    score += 5
  }

  // Readability scoring
  if (avgReadability >= 40 && avgReadability <= 70) {
    score += 10
  } else if (avgReadability > 0) {
    score += 5
  }

  score = Math.max(0, Math.min(100, score))

  // Generate recommendation
  let recommendation = ''
  if (avgWordCount < 800) {
    recommendation = 'Average post length is too short. Aim for 1500-3000 words for comprehensive coverage.'
  } else if (avgWordCount > 4000) {
    recommendation = 'Posts are very long. Consider breaking into series or adding better structure.'
  } else if (avgCitations < 2) {
    recommendation = 'Add more citations to authoritative sources to boost credibility.'
  } else if (distribution.comprehensive > posts.length * 0.5) {
    recommendation = 'Excellent content depth! Continue creating comprehensive, well-researched posts.'
  } else {
    recommendation = 'Good content depth. Consider adding more comprehensive (3000+) word posts.'
  }

  return {
    avgWordCount,
    medianWordCount,
    distribution,
    avgCitations: Math.round(avgCitations * 10) / 10,
    avgReadability: Math.round(avgReadability),
    score,
    recommendation,
  }
}

/**
 * Calculate topic diversity and keyword clustering
 */
function calculateTopicDiversity(posts: BlogPostAnalysis[]): TopicDiversityInsight {
  // Collect all topics
  const allTopics = posts.flatMap(p => p.topics)
  const topicCounts = new Map<string, number>()
  const topicPosts = new Map<string, Set<string>>()

  for (const post of posts) {
    for (const topic of post.topics) {
      topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1)

      if (!topicPosts.has(topic)) {
        topicPosts.set(topic, new Set())
      }
      topicPosts.get(topic)!.add(post.url)
    }
  }

  const uniqueTopics = topicCounts.size

  // Top keywords
  const topKeywords: KeywordCluster[] = Array.from(topicCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([keyword, frequency]) => ({
      keyword,
      frequency,
      relatedPosts: topicPosts.get(keyword)?.size || 0,
    }))

  // Estimate topic clusters (simple heuristic: keywords appearing in multiple posts)
  const clusteredTopics = Array.from(topicCounts.entries()).filter(([, count]) => count >= 3)
  const topicClusters = clusteredTopics.length

  // Calculate focus score (how well topics are distributed)
  const avgTopicsPerPost = allTopics.length / posts.length
  const topicRepetition = allTopics.length / Math.max(1, uniqueTopics)

  // Good focus: 3-7 topics per post, moderate repetition (2-4x)
  let focusScore = 50
  if (topicRepetition >= 2 && topicRepetition <= 4 && avgTopicsPerPost >= 3 && avgTopicsPerPost <= 7) {
    focusScore = 100
  } else if (topicRepetition >= 1.5 && topicRepetition <= 6) {
    focusScore = 75
  } else if (topicRepetition < 1.2) {
    focusScore = 40 // Too scattered
  } else if (topicRepetition > 8) {
    focusScore = 40 // Too narrow
  }

  // Determine coverage
  let coverage: TopicDiversityInsight['coverage'] = 'focused'
  if (uniqueTopics < posts.length * 2) {
    coverage = 'narrow'
  } else if (uniqueTopics > posts.length * 8) {
    coverage = 'scattered'
  } else if (uniqueTopics > posts.length * 5) {
    coverage = 'diverse'
  }

  // Score
  let score = focusScore

  // Adjust for coverage
  if (coverage === 'focused' || coverage === 'diverse') {
    score = Math.min(100, score + 10)
  } else if (coverage === 'narrow') {
    score = Math.max(0, score - 20)
  } else if (coverage === 'scattered') {
    score = Math.max(0, score - 15)
  }

  // Generate recommendation
  let recommendation = ''
  if (coverage === 'narrow') {
    recommendation = 'Expand topic coverage. Explore related subtopics to attract diverse search queries.'
  } else if (coverage === 'scattered') {
    recommendation = 'Topics are too scattered. Focus on building topical authority in 3-5 core areas.'
  } else if (coverage === 'focused') {
    recommendation = 'Excellent topical focus! Building strong authority in your core areas.'
  } else {
    recommendation = 'Good topic diversity. Ensure sufficient depth in each topic cluster.'
  }

  return {
    uniqueTopics,
    topKeywords,
    topicClusters,
    focusScore: Math.round(focusScore),
    coverage,
    score: Math.round(score),
    recommendation,
  }
}

/**
 * Calculate author consistency and attribution
 */
function calculateAuthorConsistency(posts: BlogPostAnalysis[]): AuthorConsistencyInsight {
  const authorCounts = new Map<string, number>()
  const authorCredentials = new Map<string, boolean>()

  let postsWithAuthor = 0

  for (const post of posts) {
    if (post.authorName) {
      postsWithAuthor++
      authorCounts.set(post.authorName, (authorCounts.get(post.authorName) || 0) + 1)

      // Check if author has credentials
      const hasCredentials = post.pageAnalysis.authors.some(a => a.credentials)
      if (hasCredentials) {
        authorCredentials.set(post.authorName, true)
      }
    }
  }

  const totalAuthors = authorCounts.size
  const postsWithoutAuthor = posts.length - postsWithAuthor
  const attributionRate = (postsWithAuthor / posts.length) * 100

  // Primary authors (top 5)
  const primaryAuthors: AuthorStats[] = Array.from(authorCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, postCount]) => ({
      name,
      postCount,
      percentage: Math.round((postCount / posts.length) * 100),
      hasCredentials: authorCredentials.get(name) || false,
    }))

  // Determine consistency
  let consistency: AuthorConsistencyInsight['consistency'] = 'varied'
  if (attributionRate < 50) {
    consistency = 'missing'
  } else if (totalAuthors === 1) {
    consistency = 'single'
  } else if (totalAuthors <= 3 && attributionRate >= 90) {
    consistency = 'consistent-team'
  } else if (totalAuthors > 10) {
    consistency = 'inconsistent'
  }

  // Score
  let score = 50

  // Attribution rate scoring
  if (attributionRate >= 95) {
    score += 30
  } else if (attributionRate >= 80) {
    score += 20
  } else if (attributionRate >= 60) {
    score += 10
  } else {
    score -= 10
  }

  // Consistency scoring
  if (consistency === 'single' || consistency === 'consistent-team') {
    score += 20
  } else if (consistency === 'inconsistent') {
    score -= 10
  } else if (consistency === 'missing') {
    score -= 20
  }

  // Credentials bonus
  const authorsWithCredentials = Array.from(authorCredentials.values()).filter(Boolean).length
  if (authorsWithCredentials > 0) {
    score += Math.min(10, authorsWithCredentials * 5)
  }

  score = Math.max(0, Math.min(100, score))

  // Generate recommendation
  let recommendation = ''
  if (attributionRate < 80) {
    recommendation = 'Add clear author attribution to all posts. Use schema markup for better visibility.'
  } else if (totalAuthors > 10) {
    recommendation = 'Too many authors reduces consistency. Consider featuring 3-5 core contributors.'
  } else if (authorsWithCredentials === 0) {
    recommendation = 'Add author credentials and bios to establish expertise and authority.'
  } else if (consistency === 'consistent-team') {
    recommendation = 'Excellent author consistency! Ensure all authors have detailed bios and credentials.'
  } else {
    recommendation = 'Good author attribution. Continue building author profiles and expertise signals.'
  }

  return {
    totalAuthors,
    primaryAuthors,
    postsWithAuthor,
    postsWithoutAuthor,
    attributionRate: Math.round(attributionRate),
    consistency,
    score,
    recommendation,
  }
}

/**
 * Calculate schema markup adoption rate
 */
function calculateSchemaAdoption(posts: BlogPostAnalysis[]): SchemaAdoptionInsight {
  const postsWithSchema = posts.filter(p => p.pageAnalysis.schemaMarkup.length > 0).length
  const postsWithoutSchema = posts.length - postsWithSchema
  const adoptionRate = (postsWithSchema / posts.length) * 100

  // Count specific schema types
  const schemaTypeCounts = new Map<string, number>()
  let hasArticleSchema = 0
  let hasBreadcrumbSchema = 0
  let hasAuthorSchema = 0

  for (const post of posts) {
    for (const schema of post.pageAnalysis.schemaMarkup) {
      schemaTypeCounts.set(schema.type, (schemaTypeCounts.get(schema.type) || 0) + 1)

      if (schema.type === 'Article' || schema.type === 'BlogPosting') {
        hasArticleSchema++
      }
      if (schema.type === 'BreadcrumbList') {
        hasBreadcrumbSchema++
      }
      if (schema.type === 'Person' && schema.data?.name) {
        hasAuthorSchema++
      }
    }
  }

  const commonSchemaTypes: SchemaTypeStats[] = Array.from(schemaTypeCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / posts.length) * 100),
    }))

  // Score based on adoption
  let score = 0

  if (adoptionRate >= 95) {
    score = 100
  } else if (adoptionRate >= 80) {
    score = 85
  } else if (adoptionRate >= 60) {
    score = 70
  } else if (adoptionRate >= 40) {
    score = 55
  } else if (adoptionRate >= 20) {
    score = 40
  } else {
    score = 20
  }

  // Bonus for specific schema types
  if (hasArticleSchema >= posts.length * 0.8) {
    score = Math.min(100, score + 10)
  }
  if (hasAuthorSchema >= posts.length * 0.5) {
    score = Math.min(100, score + 5)
  }

  // Generate recommendation
  let recommendation = ''
  if (adoptionRate < 50) {
    recommendation =
      'Add Article or BlogPosting schema markup to all posts. This significantly boosts search visibility.'
  } else if (adoptionRate < 90) {
    recommendation = 'Good schema adoption. Ensure all new posts include Article schema and author information.'
  } else if (hasAuthorSchema < posts.length * 0.5) {
    recommendation = 'Excellent schema adoption! Consider adding Person schema for author attribution.'
  } else {
    recommendation = 'Outstanding schema implementation! Maintain this standard for all new content.'
  }

  return {
    adoptionRate: Math.round(adoptionRate),
    postsWithSchema,
    postsWithoutSchema,
    commonSchemaTypes,
    hasArticleSchema,
    hasBreadcrumbSchema,
    hasAuthorSchema,
    score,
    recommendation,
  }
}

/**
 * Calculate internal linking strength
 */
function calculateInternalLinking(posts: BlogPostAnalysis[]): InternalLinkingInsight {
  const internalLinkCounts = posts.map(p => p.pageAnalysis.links.internal)
  const avgInternalLinksPerPost =
    internalLinkCounts.reduce((a, b) => a + b, 0) / posts.length

  const postsWithNoInternalLinks = internalLinkCounts.filter(count => count === 0).length
  const postsWithGoodLinking = internalLinkCounts.filter(count => count >= 3).length

  // Calculate link density (links per 1000 words)
  const totalWords = posts.reduce((sum, p) => sum + p.wordCount, 0)
  const totalInternalLinks = internalLinkCounts.reduce((a, b) => a + b, 0)
  const linkDensity = (totalInternalLinks / Math.max(1, totalWords)) * 1000

  // Determine network strength
  let networkStrength: InternalLinkingInsight['networkStrength'] = 'moderate'
  if (avgInternalLinksPerPost < 2 || postsWithNoInternalLinks > posts.length * 0.3) {
    networkStrength = 'weak'
  } else if (postsWithNoInternalLinks > posts.length * 0.1) {
    networkStrength = 'isolated'
  } else if (avgInternalLinksPerPost >= 5 && linkDensity >= 3) {
    networkStrength = 'strong'
  }

  // Score
  let score = 50

  if (avgInternalLinksPerPost >= 5) {
    score += 30
  } else if (avgInternalLinksPerPost >= 3) {
    score += 20
  } else if (avgInternalLinksPerPost >= 2) {
    score += 10
  } else {
    score -= 10
  }

  if (postsWithNoInternalLinks === 0) {
    score += 20
  } else if (postsWithNoInternalLinks < posts.length * 0.1) {
    score += 10
  } else if (postsWithNoInternalLinks > posts.length * 0.3) {
    score -= 20
  }

  score = Math.max(0, Math.min(100, score))

  // Generate recommendation
  let recommendation = ''
  if (postsWithNoInternalLinks > posts.length * 0.2) {
    recommendation =
      'Many posts lack internal links. Add 3-5 contextual links to related posts to improve SEO.'
  } else if (avgInternalLinksPerPost < 3) {
    recommendation = 'Increase internal linking. Aim for 3-5 relevant internal links per post.'
  } else if (networkStrength === 'strong') {
    recommendation = 'Excellent internal linking strategy! This builds strong topical authority.'
  } else {
    recommendation = 'Good internal linking. Continue building connections between related content.'
  }

  return {
    avgInternalLinksPerPost: Math.round(avgInternalLinksPerPost * 10) / 10,
    postsWithNoInternalLinks,
    postsWithGoodLinking,
    linkDensity: Math.round(linkDensity * 10) / 10,
    networkStrength,
    score,
    recommendation,
  }
}

/**
 * Calculate aggregate EEAT scores across all posts
 */
export function calculateAggregateBlogScores(posts: BlogPostAnalysis[]): EEATScore {
  if (posts.length === 0) {
    return {
      overall: 0,
      experience: 0,
      expertise: 0,
      authoritativeness: 0,
      trustworthiness: 0,
    }
  }

  const avgExperience =
    posts.reduce((sum, p) => sum + p.scores.experience, 0) / posts.length
  const avgExpertise =
    posts.reduce((sum, p) => sum + p.scores.expertise, 0) / posts.length
  const avgAuthoritativeness =
    posts.reduce((sum, p) => sum + p.scores.authoritativeness, 0) / posts.length
  const avgTrustworthiness =
    posts.reduce((sum, p) => sum + p.scores.trustworthiness, 0) / posts.length

  const overall = Math.round(
    (avgExperience + avgExpertise + avgAuthoritativeness + avgTrustworthiness) / 4
  )

  return {
    overall,
    experience: Math.round(avgExperience),
    expertise: Math.round(avgExpertise),
    authoritativeness: Math.round(avgAuthoritativeness),
    trustworthiness: Math.round(avgTrustworthiness),
  }
}

/**
 * Generate aggregate issues from blog insights
 */
export function generateBlogIssues(
  insights: BlogInsights,
  posts: BlogPostAnalysis[]
): Issue[] {
  const issues: Issue[] = []

  // Publishing frequency issues
  if (insights.publishingFrequency.score < 50) {
    issues.push({
      severity: 'high',
      category: 'authoritativeness',
      title: 'Low Publishing Frequency',
      description: `Only ${insights.publishingFrequency.postsPerMonth} posts per month. Search engines favor regularly updated content.`,
      impact: 'Reduces search visibility and topical authority',
    })
  }

  // Content depth issues
  if (insights.contentDepth.avgWordCount < 800) {
    issues.push({
      severity: 'high',
      category: 'expertise',
      title: 'Thin Content',
      description: `Average post length is ${insights.contentDepth.avgWordCount} words. Aim for 1500+ for comprehensive coverage.`,
      impact: 'Limits ability to rank for competitive keywords',
    })
  }

  if (insights.contentDepth.avgCitations < 2) {
    issues.push({
      severity: 'medium',
      category: 'trustworthiness',
      title: 'Insufficient Citations',
      description: `Only ${insights.contentDepth.avgCitations} citations per post. Add more authoritative sources.`,
      impact: 'Reduces credibility and trust signals',
    })
  }

  // Author consistency issues
  if (insights.authorConsistency.attributionRate < 80) {
    issues.push({
      severity: 'high',
      category: 'experience',
      title: 'Missing Author Attribution',
      description: `${insights.authorConsistency.postsWithoutAuthor} posts lack clear author attribution.`,
      impact: 'Reduces experience and expertise signals',
    })
  }

  // Schema adoption issues
  if (insights.schemaAdoption.adoptionRate < 70) {
    issues.push({
      severity: 'critical',
      category: 'trustworthiness',
      title: 'Low Schema Markup Adoption',
      description: `Only ${insights.schemaAdoption.adoptionRate}% of posts have schema markup.`,
      impact: 'Misses rich snippet opportunities and search visibility',
    })
  }

  // Internal linking issues
  if (insights.internalLinking.postsWithNoInternalLinks > posts.length * 0.2) {
    issues.push({
      severity: 'medium',
      category: 'authoritativeness',
      title: 'Weak Internal Linking',
      description: `${insights.internalLinking.postsWithNoInternalLinks} posts have no internal links.`,
      impact: 'Fails to build topical authority and spread link equity',
    })
  }

  // Topic diversity issues
  if (insights.topicDiversity.coverage === 'narrow') {
    issues.push({
      severity: 'medium',
      category: 'authoritativeness',
      title: 'Limited Topic Coverage',
      description: 'Blog covers a narrow range of topics. Expand to related areas.',
      impact: 'Limits potential search traffic and audience reach',
    })
  } else if (insights.topicDiversity.coverage === 'scattered') {
    issues.push({
      severity: 'medium',
      category: 'authoritativeness',
      title: 'Scattered Topic Focus',
      description: 'Blog lacks topical focus. Concentrate on 3-5 core areas.',
      impact: 'Dilutes topical authority and confuses search engines',
    })
  }

  // Sort by severity
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
  issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])

  return issues.slice(0, 10) // Top 10 issues
}

/**
 * Generate suggestions from blog insights
 */
export function generateBlogSuggestions(insights: BlogInsights): Suggestion[] {
  const suggestions: Suggestion[] = []

  // Add top suggestions based on scores
  if (insights.schemaAdoption.score < 80) {
    suggestions.push({
      category: 'trustworthiness',
      title: 'Implement Schema Markup',
      description: insights.schemaAdoption.recommendation,
      priority: 'high',
    })
  }

  if (insights.contentDepth.score < 70) {
    suggestions.push({
      category: 'expertise',
      title: 'Improve Content Depth',
      description: insights.contentDepth.recommendation,
      priority: 'high',
    })
  }

  if (insights.authorConsistency.score < 70) {
    suggestions.push({
      category: 'experience',
      title: 'Add Author Attribution',
      description: insights.authorConsistency.recommendation,
      priority: 'high',
    })
  }

  if (insights.internalLinking.score < 60) {
    suggestions.push({
      category: 'authoritativeness',
      title: 'Strengthen Internal Linking',
      description: insights.internalLinking.recommendation,
      priority: 'medium',
    })
  }

  if (insights.publishingFrequency.score < 60) {
    suggestions.push({
      category: 'authoritativeness',
      title: 'Maintain Publishing Schedule',
      description: insights.publishingFrequency.recommendation,
      priority: 'medium',
    })
  }

  if (insights.topicDiversity.score < 70) {
    suggestions.push({
      category: 'authoritativeness',
      title: 'Optimize Topic Strategy',
      description: insights.topicDiversity.recommendation,
      priority: 'medium',
    })
  }

  return suggestions
}
