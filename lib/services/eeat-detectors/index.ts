/**
 * E-E-A-T Detectors Index
 * Centralized exports for all detector modules
 */

// Experience detectors (E1-E7)
export {
  detectFirstPersonNarratives,
  detectAuthorPerspectiveBlocks,
  detectOriginalAssets,
  detectFreshness,
  detectExperienceMarkup,
  detectPublishingConsistency,
  detectContentFreshnessRate
} from './experience-detectors'

// Expertise detectors (X1-X6)
export {
  detectNamedAuthorsWithCredentials,
  detectYMYLReviewerPresence,
  detectCredentialVerificationLinks,
  detectCitationQuality,
  detectContentDepthClarity,
  detectAuthorConsistency
} from './expertise-detectors'

// Authoritativeness detectors (A1-A7)
export {
  detectEditorialMentions,
  detectAuthorsCitedElsewhere,
  detectEntityClarity,
  detectIndependentReferences,
  detectQualityPatterns,
  detectInternalLinkingNetwork,
  detectTopicFocus
} from './authoritativeness-detectors'

// Trustworthiness detectors (T1-T7)
export {
  detectEditorialPrinciples,
  detectYMYLDisclaimers,
  detectProvenanceSignals,
  detectContactTransparency,
  detectSchemaHygiene,
  detectSchemaAdoptionRate,
  detectQualityConsistency
} from './trustworthiness-detectors'
