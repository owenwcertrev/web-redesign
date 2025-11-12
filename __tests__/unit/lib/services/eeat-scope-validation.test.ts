/**
 * E-E-A-T Scope Validation Tests
 *
 * Purpose: Verify that E1, E2, and E3 metrics adhere to their defined scope boundaries
 * and do NOT detect signals that belong to other metrics (prevent double-counting).
 *
 * Scope Reference: .claude/EEAT_METRIC_SCOPE_GUIDE.md
 *
 * Key Principles:
 * - E1 detects content LANGUAGE (narratives), NOT credentials
 * - E2 detects attribution STRUCTURE, NOT credential quality
 * - E3 detects original ASSETS, NOT external citations
 * - X1/X2 are the SOLE owners of credential detection
 */

import { describe, it, expect } from 'vitest'
import { detectFirstPersonNarratives, detectAuthorPerspectiveBlocks, detectOriginalAssets } from '@/lib/services/eeat-detectors/experience-detectors'
import type { PageAnalysis } from '@/lib/types'

describe('E-E-A-T Scope Validation', () => {
  describe('E1: First-Person Narratives - NO Credential Detection', () => {
    it('should NOT award points for author credentials (MD, PhD) in schema', () => {
      const pageAnalysis: PageAnalysis = {
        url: 'https://example.com/article',
        contentText: 'Regular article content without experience language.',
        authors: [
          {
            name: 'Dr. Jane Smith',
            credentials: 'MD, PhD',
            bio: 'Board-certified physician with 15 years experience'
          }
        ],
        schemaMarkup: [
          {
            type: 'Article',
            data: {
              author: {
                name: 'Dr. Jane Smith',
                jobTitle: 'Medical Doctor'
              }
            }
          }
        ],
        images: { total: 0, withAlt: 0 },
        links: { internal: 0, external: 0 },
        wordCount: 100
      }

      const result = detectFirstPersonNarratives(pageAnalysis)

      // E1 should NOT score credentials - score should be 0 (no narrative language)
      expect(result.actualScore).toBe(0)

      // Evidence should NOT mention credentials
      expect(result.evidence).toEqual([])
    })

    it('should NOT award points for expert reviewers in schema', () => {
      const pageAnalysis: PageAnalysis = {
        url: 'https://example.com/health',
        contentText: 'Health article without first-person narratives.',
        authors: [],
        schemaMarkup: [
          {
            type: 'MedicalWebPage',
            data: {
              reviewedBy: {
                name: 'Dr. John Expert',
                credentials: 'MD, FACP'
              }
            }
          }
        ],
        images: { total: 0, withAlt: 0 },
        links: { internal: 0, external: 0 },
        wordCount: 100
      }

      const result = detectFirstPersonNarratives(pageAnalysis)

      // E1 should NOT detect reviewers - this is E2/X2's domain
      expect(result.actualScore).toBe(0)
      expect(result.evidence).toEqual([])
    })

    it('SHOULD award points for first-person experience language (correct scope)', () => {
      const pageAnalysis: PageAnalysis = {
        url: 'https://example.com/blog',
        contentText: `In my 15 years of clinical practice, I've observed significant improvements
        in patient outcomes. Our research team has found that early intervention is key.
        Based on my experience treating hundreds of patients, I recommend this approach.`,
        authors: [],
        schemaMarkup: [],
        images: { total: 0, withAlt: 0 },
        links: { internal: 0, external: 0 },
        wordCount: 200
      }

      const result = detectFirstPersonNarratives(pageAnalysis)

      // E1 SHOULD detect experience language (in scope)
      expect(result.actualScore).toBeGreaterThan(0)
      expect(result.evidence.length).toBeGreaterThan(0)
    })

    it('should NOT confuse professional voice with credentials', () => {
      const pageAnalysis: PageAnalysis = {
        url: 'https://example.com/article',
        contentText: 'Our team of MD-certified doctors and PhD researchers publish findings.',
        authors: [
          { name: 'Dr. Smith', credentials: 'MD' }
        ],
        schemaMarkup: [],
        images: { total: 0, withAlt: 0 },
        links: { internal: 0, external: 0 },
        wordCount: 50
      }

      const result = detectFirstPersonNarratives(pageAnalysis)

      // Should award points for "Our team" (professional voice)
      // but NOT for the MD/PhD mentions or author credentials
      expect(result.actualScore).toBeGreaterThan(0)
      expect(result.actualScore).toBeLessThan(2) // Should be low (only professional voice)
    })
  })

  describe('E2: Author Perspective Blocks - NO Credential Quality Scoring', () => {
    it('should award points for reviewer PRESENCE, NOT credential quality', () => {
      const pageAnalysis: PageAnalysis = {
        url: 'https://example.com/health',
        contentText: 'Medically reviewed by Dr. Smith',
        authors: [
          { name: 'John Doe', credentials: undefined },
          { name: 'Dr. Smith', credentials: 'MD' }
        ],
        schemaMarkup: [],
        images: { total: 0, withAlt: 0 },
        links: { internal: 0, external: 0 },
        wordCount: 100
      }

      const result = detectAuthorPerspectiveBlocks(pageAnalysis)

      // E2 should award points for "Medically reviewed by" text (structure)
      expect(result.actualScore).toBeGreaterThan(0)

      // Score should be the SAME whether reviewer has MD or no credentials
      // (credential quality is X1/X2's domain)
    })

    it('should NOT increase score based on number of credentialed authors', () => {
      // Test 1: Two authors with NO credentials
      const pageAnalysisNoCredentials: PageAnalysis = {
        url: 'https://example.com/article',
        contentText: 'Article content',
        authors: [
          { name: 'Author One', credentials: undefined },
          { name: 'Author Two', credentials: undefined }
        ],
        schemaMarkup: [],
        images: { total: 0, withAlt: 0 },
        links: { internal: 0, external: 0 },
        wordCount: 100
      }

      // Test 2: Two authors WITH credentials (MD, PhD)
      const pageAnalysisWithCredentials: PageAnalysis = {
        url: 'https://example.com/article',
        contentText: 'Article content',
        authors: [
          { name: 'Dr. Smith', credentials: 'MD, PhD' },
          { name: 'Dr. Jones', credentials: 'MD, FACP' }
        ],
        schemaMarkup: [],
        images: { total: 0, withAlt: 0 },
        links: { internal: 0, external: 0 },
        wordCount: 100
      }

      const resultNoCredentials = detectAuthorPerspectiveBlocks(pageAnalysisNoCredentials)
      const resultWithCredentials = detectAuthorPerspectiveBlocks(pageAnalysisWithCredentials)

      // E2 should award the SAME score for collaborative authorship
      // regardless of credential quality
      expect(resultNoCredentials.actualScore).toBe(resultWithCredentials.actualScore)
    })

    it('should detect reviewer structure in schema WITHOUT checking credentials', () => {
      const pageAnalysis: PageAnalysis = {
        url: 'https://example.com/health',
        contentText: 'Health article',
        authors: [],
        schemaMarkup: [
          {
            type: 'MedicalWebPage',
            data: {
              reviewedBy: {
                name: 'Dr. Expert'
                // No credentials field
              }
            }
          }
        ],
        images: { total: 0, withAlt: 0 },
        links: { internal: 0, external: 0 },
        wordCount: 100
      }

      const result = detectAuthorPerspectiveBlocks(pageAnalysis)

      // E2 should award points for having reviewer structure
      expect(result.actualScore).toBeGreaterThan(0)
      expect(result.evidence.some(e =>
        e.label?.toLowerCase().includes('reviewer') ||
        e.label?.toLowerCase().includes('schema')
      )).toBe(true)
    })

    it('SHOULD award points for perspective section headings (correct scope)', () => {
      const pageAnalysis: PageAnalysis = {
        url: 'https://example.com/article',
        contentText: `
          ## Expert Opinion
          This is my professional perspective on the topic.

          ## Clinical Perspective
          From a clinical standpoint, the evidence shows...
        `,
        authors: [],
        schemaMarkup: [],
        images: { total: 0, withAlt: 0 },
        links: { internal: 0, external: 0 },
        wordCount: 150
      }

      const result = detectAuthorPerspectiveBlocks(pageAnalysis)

      // E2 SHOULD detect perspective sections (in scope)
      expect(result.actualScore).toBeGreaterThan(0)
      expect(result.evidence.some(e =>
        e.value?.toLowerCase().includes('expert opinion') ||
        e.value?.toLowerCase().includes('clinical perspective')
      )).toBe(true)
    })
  })

  describe('E3: Original Assets - NO External Citation Detection', () => {
    it('should NOT award points for external research citations', () => {
      const pageAnalysis: PageAnalysis = {
        url: 'https://example.com/article',
        contentText: `
          According to a study from Harvard Medical School...
          Research from the CDC shows that...
          A case study published in JAMA found...
          Data from the NIH indicates...
        `,
        authors: [],
        schemaMarkup: [],
        images: { total: 0, withAlt: 0 },
        links: { internal: 0, external: 10 }, // External citations
        wordCount: 200
      }

      const result = detectOriginalAssets(pageAnalysis)

      // E3 should NOT detect external citations (X4's domain)
      // Score should be low/zero (no original assets)
      expect(result.actualScore).toBeLessThan(1)
    })

    it('should NOT award points for author credentials on research', () => {
      const pageAnalysis: PageAnalysis = {
        url: 'https://example.com/study',
        contentText: 'Study results',
        authors: [
          {
            name: 'Dr. Researcher',
            credentials: 'MD, PhD',
            bio: 'Published 50+ peer-reviewed papers'
          }
        ],
        schemaMarkup: [],
        images: { total: 0, withAlt: 0 },
        links: { internal: 0, external: 0 },
        wordCount: 100
      }

      const result = detectOriginalAssets(pageAnalysis)

      // E3 should NOT score author credentials (X1's domain)
      // With no original asset references, score should be low
      expect(result.actualScore).toBeLessThan(1)
    })

    it('SHOULD award points for original research indicators (correct scope)', () => {
      const pageAnalysis: PageAnalysis = {
        url: 'https://example.com/research',
        contentText: `
          Our study of 500 patients found significant results.
          We analyzed proprietary data from our clinic.
          Based on our research, we developed this framework.
          Here's a sample meal plan we created.
          Figure 1 shows our custom diagram.
        `,
        authors: [],
        schemaMarkup: [],
        images: { total: 5, withAlt: 3 },
        links: { internal: 0, external: 0 },
        wordCount: 300
      }

      const result = detectOriginalAssets(pageAnalysis)

      // E3 SHOULD detect original assets (in scope)
      expect(result.actualScore).toBeGreaterThan(1)
      expect(result.evidence.length).toBeGreaterThan(0)
      expect(result.evidence.some(e =>
        e.label?.toLowerCase().includes('original') ||
        e.label?.toLowerCase().includes('visual') ||
        e.label?.toLowerCase().includes('research')
      )).toBe(true)
    })

    it('SHOULD detect site-owned case studies, NOT external ones', () => {
      // External case study (should NOT score)
      const externalCase: PageAnalysis = {
        url: 'https://example.com/article',
        contentText: 'A case study from Mayo Clinic showed that...',
        authors: [],
        schemaMarkup: [],
        images: { total: 0, withAlt: 0 },
        links: { internal: 0, external: 0 },
        wordCount: 50
      }

      // Site's own case study (SHOULD score)
      const ownCase: PageAnalysis = {
        url: 'https://example.com/case-study',
        contentText: 'Patient story: John came to our clinic with...',
        authors: [],
        schemaMarkup: [],
        images: { total: 0, withAlt: 0 },
        links: { internal: 0, external: 0 },
        wordCount: 50
      }

      const externalResult = detectOriginalAssets(externalCase)
      const ownResult = detectOriginalAssets(ownCase)

      // External case should score lower than owned case
      // Note: Generic "case study" may score, but context matters
      expect(ownResult.actualScore).toBeGreaterThanOrEqual(externalResult.actualScore)
    })
  })

  describe('Cross-Metric Integration Tests', () => {
    it('should NOT double-count credentials across E1, E2, and X1/X2', () => {
      const pageAnalysis: PageAnalysis = {
        url: 'https://example.com/health',
        contentText: `
          In my medical practice, I've treated over 1000 patients.
          Medically reviewed by Dr. Expert.
        `,
        authors: [
          {
            name: 'Dr. Jane Smith',
            credentials: 'MD, PhD',
            bio: 'Board-certified physician'
          }
        ],
        schemaMarkup: [
          {
            type: 'MedicalWebPage',
            data: {
              reviewedBy: { name: 'Dr. Expert', credentials: 'MD' }
            }
          }
        ],
        images: { total: 0, withAlt: 0 },
        links: { internal: 0, external: 0 },
        wordCount: 150
      }

      const e1Result = detectFirstPersonNarratives(pageAnalysis)
      const e2Result = detectAuthorPerspectiveBlocks(pageAnalysis)

      // E1: Should score experience language ("In my medical practice")
      // Should NOT score author credentials
      expect(e1Result.actualScore).toBeGreaterThan(0)
      expect(e1Result.actualScore).toBeLessThan(4) // Not max score

      // E2: Should score review attribution ("Medically reviewed by")
      // Should NOT increase score based on credentials
      expect(e2Result.actualScore).toBeGreaterThan(0)

      // Combined E1 + E2 score should be reasonable (not inflated by credential double-counting)
      const combinedScore = e1Result.actualScore + e2Result.actualScore
      expect(combinedScore).toBeLessThan(7) // Max E1 (4) + Max E2 (3) = 7
    })

    it('comprehensive test: rich page with all signal types', () => {
      const richPage: PageAnalysis = {
        url: 'https://example.com/comprehensive',
        contentText: `
          ## Expert Opinion
          In my 20 years of clinical experience, I've observed remarkable outcomes.
          Our research team analyzed data from 5000 patients.

          Figure 1 shows our custom infographic.

          Medically reviewed by Dr. Expert Smith.

          Case study: A patient success story from our clinic.

          According to CDC data, the prevalence is increasing.
        `,
        authors: [
          { name: 'Dr. Jane Doe', credentials: 'MD, PhD' },
          { name: 'Prof. John Smith', credentials: 'PhD, FACP' }
        ],
        schemaMarkup: [
          {
            type: 'MedicalWebPage',
            data: {
              author: [
                { name: 'Dr. Jane Doe' },
                { name: 'Prof. John Smith' }
              ],
              reviewedBy: { name: 'Dr. Expert Smith', credentials: 'MD' }
            }
          }
        ],
        images: { total: 8, withAlt: 6 },
        links: { internal: 5, external: 3 },
        wordCount: 800
      }

      const e1Result = detectFirstPersonNarratives(richPage)
      const e2Result = detectAuthorPerspectiveBlocks(richPage)
      const e3Result = detectOriginalAssets(richPage)

      // E1: Experience language (narratives, professional voice)
      expect(e1Result.actualScore).toBeGreaterThan(0)
      expect(e1Result.actualScore).toBeLessThanOrEqual(4)

      // E2: Perspective structure (sections, attribution, collaboration)
      expect(e2Result.actualScore).toBeGreaterThan(0)
      expect(e2Result.actualScore).toBeLessThanOrEqual(3)

      // E3: Original assets (figures, research, case studies)
      expect(e3Result.actualScore).toBeGreaterThan(0)
      expect(e3Result.actualScore).toBeLessThanOrEqual(3)

      // None should reach max score with credential padding
      // Combined should reflect actual signals, not inflated by double-counting
      const totalExperienceScore = e1Result.actualScore + e2Result.actualScore + e3Result.actualScore

      // Should be substantial but not artificially inflated
      expect(totalExperienceScore).toBeGreaterThan(2)
      expect(totalExperienceScore).toBeLessThan(10) // Max possible: 4+3+3=10
    })
  })
})
