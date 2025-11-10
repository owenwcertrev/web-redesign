/**
 * Citation Quality Scorer
 *
 * Evaluates the quality of citations based on source authority.
 * Uses a 4-tier classification system to weight citations by credibility.
 */

export enum CitationTier {
  TIER_1_PEER_REVIEWED = 1,  // Highest quality: peer-reviewed, research
  TIER_2_GOVERNMENT_EDU = 2, // High quality: government, educational
  TIER_3_REPUTABLE_NEWS = 3, // Medium quality: established news organizations
  TIER_4_OTHER = 4,          // Basic quality: general websites, blogs
}

export interface CitationQualityResult {
  totalCitations: number
  qualityScore: number // Weighted score (0-100)
  breakdown: {
    tier1: number
    tier2: number
    tier3: number
    tier4: number
  }
  topSources: string[] // List of domains cited
}

/**
 * Tier 1: Peer-reviewed journals, research databases, medical authorities
 */
const TIER_1_DOMAINS = [
  // Research databases
  'pubmed.ncbi.nlm.nih.gov',
  'ncbi.nlm.nih.gov',
  'pubmed',
  'scholar.google.com',
  'researchgate.net',
  'sciencedirect.com',
  'springer.com',
  'wiley.com',
  'nature.com',
  'science.org',
  'cell.com',
  'thelancet.com',
  'bmj.com',
  'jamanetwork.com',
  'nejm.org', // New England Journal of Medicine

  // Medical/health authorities
  'nih.gov',
  'cdc.gov',
  'who.int',
  'fda.gov',
  'mayo.edu',
  'clevelandclinic.org',
  'hopkinsmedicine.org',

  // Research institutions
  'mit.edu',
  'stanford.edu',
  'harvard.edu',
  'oxford.ac.uk',
  'cambridge.org',
]

/**
 * Tier 2: Government sites (.gov), educational institutions (.edu)
 */
const TIER_2_PATTERNS = [
  '.gov',
  '.edu',
  '.ac.uk',
  '.edu.au',
  'government.',
]

/**
 * Tier 3: Reputable news organizations and established publications
 */
const TIER_3_DOMAINS = [
  // Major news wire services
  'apnews.com',
  'reuters.com',
  'bloomberg.com',
  'afp.com',

  // Established newspapers
  'nytimes.com',
  'wsj.com',
  'washingtonpost.com',
  'ft.com',
  'theguardian.com',
  'bbc.com',
  'bbc.co.uk',

  // News organizations
  'npr.org',
  'pbs.org',
  'cnn.com',
  'cbsnews.com',
  'nbcnews.com',
  'abcnews.go.com',

  // Business/financial
  'forbes.com',
  'fortune.com',
  'economist.com',
  'businessinsider.com',

  // Science/tech journalism
  'scientificamerican.com',
  'newscientist.com',
  'wired.com',
  'arstechnica.com',
  'techcrunch.com',
]

/**
 * Weight multipliers for each tier
 */
const TIER_WEIGHTS = {
  [CitationTier.TIER_1_PEER_REVIEWED]: 3.0,
  [CitationTier.TIER_2_GOVERNMENT_EDU]: 2.0,
  [CitationTier.TIER_3_REPUTABLE_NEWS]: 1.5,
  [CitationTier.TIER_4_OTHER]: 1.0,
}

/**
 * Classifies a domain or URL into a citation tier
 */
export function classifyCitationTier(urlOrDomain: string): CitationTier {
  const normalized = urlOrDomain.toLowerCase()

  // Check Tier 1 (peer-reviewed, research)
  for (const domain of TIER_1_DOMAINS) {
    if (normalized.includes(domain)) {
      return CitationTier.TIER_1_PEER_REVIEWED
    }
  }

  // Check Tier 2 (government, educational)
  for (const pattern of TIER_2_PATTERNS) {
    if (normalized.includes(pattern)) {
      return CitationTier.TIER_2_GOVERNMENT_EDU
    }
  }

  // Check Tier 3 (reputable news)
  for (const domain of TIER_3_DOMAINS) {
    if (normalized.includes(domain)) {
      return CitationTier.TIER_3_REPUTABLE_NEWS
    }
  }

  // Default to Tier 4 (other)
  return CitationTier.TIER_4_OTHER
}

/**
 * Calculates quality score for a list of citations
 * Returns a 0-100 score based on weighted tier distribution
 */
export function calculateCitationQuality(citations: string[]): CitationQualityResult {
  if (citations.length === 0) {
    return {
      totalCitations: 0,
      qualityScore: 0,
      breakdown: { tier1: 0, tier2: 0, tier3: 0, tier4: 0 },
      topSources: [],
    }
  }

  // Classify each citation
  const breakdown = {
    tier1: 0,
    tier2: 0,
    tier3: 0,
    tier4: 0,
  }

  const sourceDomains = new Set<string>()

  citations.forEach(citation => {
    const tier = classifyCitationTier(citation)

    // Extract domain for tracking
    try {
      const url = new URL(citation.startsWith('http') ? citation : `https://${citation}`)
      sourceDomains.add(url.hostname)
    } catch {
      // If not a valid URL, just track as-is
      sourceDomains.add(citation)
    }

    // Increment breakdown
    switch (tier) {
      case CitationTier.TIER_1_PEER_REVIEWED:
        breakdown.tier1++
        break
      case CitationTier.TIER_2_GOVERNMENT_EDU:
        breakdown.tier2++
        break
      case CitationTier.TIER_3_REPUTABLE_NEWS:
        breakdown.tier3++
        break
      case CitationTier.TIER_4_OTHER:
        breakdown.tier4++
        break
    }
  })

  // Calculate weighted score
  const weightedTotal =
    breakdown.tier1 * TIER_WEIGHTS[CitationTier.TIER_1_PEER_REVIEWED] +
    breakdown.tier2 * TIER_WEIGHTS[CitationTier.TIER_2_GOVERNMENT_EDU] +
    breakdown.tier3 * TIER_WEIGHTS[CitationTier.TIER_3_REPUTABLE_NEWS] +
    breakdown.tier4 * TIER_WEIGHTS[CitationTier.TIER_4_OTHER]

  // Normalize to 0-100 scale
  // Assumptions:
  // - 5 Tier 1 citations = 100 points (15 weighted points)
  // - 8 Tier 2 citations = 100 points (16 weighted points)
  // - 12 Tier 3 citations = 100 points (18 weighted points)
  // - 20 Tier 4 citations = 100 points (20 weighted points)
  const maxWeightedScore = 15 // 5 Tier 1 citations
  const qualityScore = Math.min(100, Math.round((weightedTotal / maxWeightedScore) * 100))

  return {
    totalCitations: citations.length,
    qualityScore,
    breakdown,
    topSources: Array.from(sourceDomains).slice(0, 5), // Top 5 unique sources
  }
}

/**
 * Gets a human-readable description of citation quality
 */
export function getCitationQualityDescription(result: CitationQualityResult): string {
  if (result.totalCitations === 0) {
    return 'No citations found'
  }

  if (result.qualityScore >= 80) {
    return 'Excellent citation quality with authoritative sources'
  } else if (result.qualityScore >= 60) {
    return 'Good citation quality with reputable sources'
  } else if (result.qualityScore >= 40) {
    return 'Moderate citation quality, could use more authoritative sources'
  } else {
    return 'Low citation quality, primarily general sources'
  }
}

/**
 * Gets tier name for display
 */
export function getTierName(tier: CitationTier): string {
  switch (tier) {
    case CitationTier.TIER_1_PEER_REVIEWED:
      return 'Peer-Reviewed/Research'
    case CitationTier.TIER_2_GOVERNMENT_EDU:
      return 'Government/Educational'
    case CitationTier.TIER_3_REPUTABLE_NEWS:
      return 'Reputable News'
    case CitationTier.TIER_4_OTHER:
      return 'General Sources'
  }
}
