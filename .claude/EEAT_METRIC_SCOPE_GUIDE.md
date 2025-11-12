# E-E-A-T Metric Scope Guide

**Purpose:** Defines the role, scope, and boundaries of each E-E-A-T metric to prevent signal overlap and double-counting.

**Last Updated:** 2025-01-12

---

## Principles

### Independence
Each metric should detect **distinct, non-overlapping signals**. The same content feature should only contribute to ONE metric's score.

### Clarity
Each metric has a clear "DETECTS" (in scope) and "DOES NOT DETECT" (out of scope) definition.

### Separation of Concerns
- **Experience (E1-E7)**: Content-based signals showing hands-on practice
- **Expertise (X1-X6)**: Credential-based signals showing qualifications
- **Authoritativeness (A1-A7)**: External validation and reputation
- **Trustworthiness (T1-T7)**: Transparency and editorial standards

---

## EXPERIENCE (E1-E7)
**Category Focus:** First-hand participation, direct practice, content recency

### E1: First-Person Narratives
**Max Score:** 4 points
**Purpose:** Detect experience through content language

**DETECTS:**
- ✅ First-person experience phrases in content ("In my experience", "I've observed", "We've treated")
- ✅ Professional voice in content ("Our research team", "10+ years practicing")
- ✅ Institutional experience statements ("Our data shows", "Our analysis found")
- ✅ Narrative experience language (blog-style personal stories)

**DOES NOT DETECT:**
- ❌ Author credentials (MD, PhD, CFA) → This is X1's domain
- ❌ Expert reviewers in schema → This is X2's domain
- ❌ Author bios or professional titles → This is X1's domain
- ❌ "Reviewed by" attribution → This is E2's domain

**Scope Boundary:** Content language ONLY. No author metadata detection.

**Example:**
- ✅ CORRECT: "In my 15 years of clinical practice, I've found..." → +1.5 pts
- ❌ WRONG: Author has "MD" credentials → DO NOT score in E1 (this is X1)

---

### E2: Author Perspective Blocks
**Max Score:** 3 points
**Purpose:** Detect dedicated perspective/review sections (not score the credentials)

**DETECTS:**
- ✅ Explicit perspective section headings ("Reviewer's Note", "Expert Opinion", "Clinical Perspective")
- ✅ Review attribution phrases in text ("Medically reviewed by", "Expert reviewed by")
- ✅ Presence of reviewer/author attribution (that perspective exists)
- ✅ Collaborative authorship (multiple authors with different roles)

**DOES NOT DETECT:**
- ❌ Quality of credentials (MD vs RN) → This is X1/X2's domain
- ❌ Author professional backgrounds → This is X1's domain
- ❌ Credential verification → This is X3's domain

**Scope Boundary:** Perspective STRUCTURE only. Award points for having perspective sections, not for credential quality.

**Scoring Logic:**
- Explicit "Reviewer's Note" heading → +1.5 pts (for having the section)
- "Medically reviewed by Dr. Smith" text → +1.0 pt (for having attribution)
- Multiple authors (collaborative) → Bonus (for diverse perspective)
- **DO NOT** check if Dr. Smith has "MD" → X1/X2 handles credential validation

**Example:**
- ✅ CORRECT: Page has "Expert Opinion" section → +1.5 pts
- ❌ WRONG: Check if expert has MD degree → DO NOT do this (X1 handles credentials)

---

### E3: Original Assets
**Max Score:** 3 points
**Purpose:** Detect original visual/data content (not stock photos)

**DETECTS:**
- ✅ Visual asset references ("Figure 1", "See diagram below", "Chart shows")
- ✅ Original research/data ("Our study", "Sample menu", "Example workout")
- ✅ Case studies ("Patient story", "Client example", "Real-world case")
- ✅ Before/after comparisons (progress photos, demonstrations)
- ✅ Tutorial assets (screenshots, step-by-step images)
- ✅ Team/facility photography ("Our team", "Our clinic")
- ✅ Schema ImageObject with creator fields
- ✅ Visual content richness (image count as proxy for investment)

**DOES NOT DETECT:**
- ❌ External research citations → This is X4's domain
- ❌ Author credentials on research → This is X1's domain
- ❌ Site reputation from research → This is A1/A4's domain

**Scope Boundary:** Original content creation ONLY. Focus on assets authored/created by the site.

**Example:**
- ✅ CORRECT: "Figure 1 shows our proprietary data" → +0.8 pts (original asset)
- ❌ WRONG: "According to CDC data" → DO NOT score (this is X4 citation quality)

---

### E4: Freshness
**Max Score:** 5 points
**Purpose:** Detect content recency

**DETECTS:**
- ✅ DateModified in schema (within 12 months = excellent)
- ✅ DatePublished in schema
- ✅ Visible update notes ("Updated March 2024")
- ✅ Fact-check dates

**DOES NOT DETECT:**
- ❌ Publishing consistency → This is E6's domain
- ❌ Content freshness rate → This is E7's domain

**Scope Boundary:** Single-page recency ONLY. Blog-level freshness is E6/E7.

---

### E5: Experience Markup
**Max Score:** 2 points
**Purpose:** Detect appropriate experience schema

**DETECTS:**
- ✅ MedicalWebPage schema on health content
- ✅ Appropriate vertical schema (Recipe, HowTo, etc.)
- ✅ "What we do" sections explaining experience area

**DOES NOT DETECT:**
- ❌ Schema completeness → This is T5's domain
- ❌ Author schema → This is X1's domain

**Scope Boundary:** Experience-specific schema ONLY.

---

### E6: Publishing Consistency [BLOG-LEVEL]
**Max Score:** 4 points
**Purpose:** Detect regular content updates (blog-level)

**DETECTS:**
- ✅ Posting frequency (weekly, monthly, quarterly)
- ✅ Consistency over time (ongoing vs abandoned)

**DOES NOT DETECT:**
- ❌ Single-page freshness → This is E4's domain
- ❌ Content quality consistency → This is T7's domain

**Scope Boundary:** Blog-level publishing cadence ONLY.

---

### E7: Content Freshness Rate [BLOG-LEVEL]
**Max Score:** 4 points
**Purpose:** Percentage of blog posts updated within 12 months

**DETECTS:**
- ✅ Ratio of updated posts to total posts
- ✅ Maintenance commitment

**DOES NOT DETECT:**
- ❌ Single-page freshness → This is E4's domain
- ❌ Quality of updates → This is T7's domain

**Scope Boundary:** Blog-level update rate ONLY.

---

## EXPERTISE (X1-X6)
**Category Focus:** Qualifications, credentials, depth of knowledge

### X1: Named Authors with Credentials
**Max Score:** 6 points
**Purpose:** Detect and validate author qualifications

**DETECTS:**
- ✅ Author names (from schema, bylines, meta tags)
- ✅ Professional credentials (MD, PhD, CFA, JD, RN, etc.)
- ✅ Professional roles (titles without credentials)
- ✅ Author headshots (visual identification)
- ✅ Comprehensive author bio pages (depth of background)

**DOES NOT DETECT:**
- ❌ First-person narratives in content → This is E1's domain
- ❌ "Reviewed by" sections → This is E2/X2's domain
- ❌ External author reputation → This is A2's domain
- ❌ Credential verification links → This is X3's domain

**Scope Boundary:** Author IDENTITY and CREDENTIALS only. Not content language or external validation.

**Scoring Logic:**
- Named author → Base points
- Credentials present (MD, PhD) → +Credential bonus
- Headshot → +Visual identity bonus
- Bio page → +Depth bonus
- **DO NOT** score based on experience language in content (E1 handles that)

**Example:**
- ✅ CORRECT: "Dr. Jane Smith, MD" in byline → +3 pts (name + credential)
- ❌ WRONG: Content says "In my medical practice" → DO NOT score in X1 (this is E1)

---

### X2: YMYL Reviewer Presence
**Max Score:** 5 points
**Purpose:** Detect expert review on health/financial content (YMYL-specific)

**DETECTS:**
- ✅ Medical reviewers (schema: medicalReviewer, reviewedBy)
- ✅ Financial reviewers on finance content
- ✅ Legal reviewers on legal content
- ✅ YMYL-appropriate expert validation

**DOES NOT DETECT:**
- ❌ Perspective sections in content → This is E2's domain
- ❌ Author credentials (if same person writes AND reviews) → This is X1's domain
- ❌ Generic "reviewed by" attribution → This is E2's domain unless YMYL

**Scope Boundary:** YMYL expert review ONLY. Must be health/finance/legal content.

**Context Requirement:** Only active on YMYL content. Returns 0 on non-YMYL pages.

**Example:**
- ✅ CORRECT: Health article + medicalReviewer schema → +2.5 pts
- ❌ WRONG: Tech article + "reviewed by engineer" → DO NOT score (not YMYL)

---

### X3: Credential Verification Links
**Max Score:** 4 points
**Purpose:** Detect verification pathways for claimed credentials

**DETECTS:**
- ✅ LinkedIn profile links from author bios
- ✅ Hospital/university affiliation links
- ✅ License board links (medical boards, bar associations)
- ✅ Professional association links

**DOES NOT DETECT:**
- ❌ Credentials themselves → This is X1's domain
- ❌ External reputation → This is A2's domain
- ❌ Site-wide about links → This is T4's domain

**Scope Boundary:** Author credential VERIFICATION only.

---

### X4: Citation Quality
**Max Score:** 4 points
**Purpose:** Detect quality of external sources cited

**DETECTS:**
- ✅ .gov/.edu citations (authoritative sources)
- ✅ Peer-reviewed journal citations
- ✅ Proportion of high-quality sources
- ✅ Citation formatting and inline references

**DOES NOT DETECT:**
- ❌ Original research by the site → This is E3's domain
- ❌ Site reputation from being cited → This is A4's domain
- ❌ Internal link quality → This is A6's domain

**Scope Boundary:** External source quality ONLY.

---

### X5: Content Depth & Clarity
**Max Score:** 3 points
**Purpose:** Detect informational completeness

**DETECTS:**
- ✅ Heading structure (H2, H3 hierarchy)
- ✅ Definitions and explanations
- ✅ Internal links to related topics
- ✅ Content comprehensiveness

**DOES NOT DETECT:**
- ❌ Content length alone → Quality over quantity
- ❌ Experience narratives → This is E1's domain
- ❌ Original research → This is E3's domain

**Scope Boundary:** Structural depth ONLY.

---

### X6: Author Consistency [BLOG-LEVEL]
**Max Score:** 3 points
**Purpose:** Detect consistent author attribution across blog

**DETECTS:**
- ✅ Percentage of posts with named authors
- ✅ Consistent author presence

**DOES NOT DETECT:**
- ❌ Author credentials → This is X1's domain
- ❌ Content quality → This is T7's domain

**Scope Boundary:** Blog-level author presence ONLY.

---

## AUTHORITATIVENESS (A1-A7)
**Category Focus:** External validation, reputation, third-party recognition

### A1: Editorial Mentions
**Max Score:** 5 points
**Purpose:** Detect third-party recognition

**DETECTS:**
- ✅ High-quality backlinks (trade press, .gov, .edu)
- ✅ Mentions in reputable publications
- ✅ Featured in industry roundups

**DOES NOT DETECT:**
- ❌ Author credentials → This is X1's domain
- ❌ Site's own claims → This is E1's domain
- ❌ Internal links → This is A6's domain

**Scope Boundary:** External mentions ONLY.

---

### A2: Authors Cited Elsewhere
**Max Score:** 4 points
**Purpose:** Detect external author reputation

**DETECTS:**
- ✅ Author presence on faculty pages
- ✅ Author committee memberships
- ✅ Author society profiles
- ✅ External recognition of authors

**DOES NOT DETECT:**
- ❌ Author credentials on THIS site → This is X1's domain
- ❌ Credential verification links → This is X3's domain

**Scope Boundary:** External author reputation ONLY (not credentials).

---

### A3: Entity Clarity
**Max Score:** 4 points
**Purpose:** Detect clear organizational identity

**DETECTS:**
- ✅ Organization/Person schema with sameAs links
- ✅ Clear About page
- ✅ Brand identity clarity

**DOES NOT DETECT:**
- ❌ Contact info → This is T4's domain
- ❌ Author bios → This is X1's domain

**Scope Boundary:** Entity identity ONLY.

---

### A4: Independent References
**Max Score:** 4 points
**Purpose:** Detect other sites citing this site's content

**DETECTS:**
- ✅ External sites citing/quoting this site
- ✅ Non-commercial citations (not ads/affiliates)
- ✅ Editorial references to this site's work

**DOES NOT DETECT:**
- ❌ This site citing others → This is X4's domain
- ❌ Paid mentions → Must be editorial

**Scope Boundary:** Inbound citations ONLY.

---

### A5: Quality Patterns
**Max Score:** 3 points
**Purpose:** Detect absence of spam signals

**DETECTS:**
- ✅ No site-reputation abuse
- ✅ No scaled thin pages
- ✅ Quality content patterns

**DOES NOT DETECT:**
- ❌ Specific quality signals → Other metrics handle positive signals

**Scope Boundary:** Negative signal detection ONLY (spam/abuse).

---

### A6: Internal Linking Network [BLOG-LEVEL]
**Max Score:** 3 points
**Purpose:** Detect topical authority through linking

**DETECTS:**
- ✅ Strong internal link graph
- ✅ Topic clustering
- ✅ Hub and spoke patterns

**DOES NOT DETECT:**
- ❌ External citations → This is X4's domain
- ❌ External backlinks → This is A1/A4's domain

**Scope Boundary:** Internal link structure ONLY.

---

### A7: Topic Focus [BLOG-LEVEL]
**Max Score:** 2 points
**Purpose:** Detect concentrated expertise vs scattered topics

**DETECTS:**
- ✅ Vertical focus (health, finance, tech, etc.)
- ✅ Topic consistency
- ✅ Depth in specific areas

**DOES NOT DETECT:**
- ❌ Content quality → Other metrics handle quality

**Scope Boundary:** Topic concentration ONLY.

---

## TRUSTWORTHINESS (T1-T7)
**Category Focus:** Transparency, editorial standards, accuracy

### T1: Editorial Principles
**Max Score:** 4 points
**Purpose:** Detect published editorial standards

**DETECTS:**
- ✅ Editorial policy page (linked in footer)
- ✅ Corrections policy
- ✅ Fact-checking process documented

**DOES NOT DETECT:**
- ❌ About page → This is T4's domain
- ❌ Privacy/Terms → This is T4's domain

**Scope Boundary:** Editorial standards documentation ONLY.

---

### T2: YMYL Disclaimers
**Max Score:** 4 points
**Purpose:** Detect appropriate disclaimers on health/financial content

**DETECTS:**
- ✅ Medical disclaimers on health content
- ✅ Financial disclaimers on investment content
- ✅ "Not medical advice" statements

**DOES NOT DETECT:**
- ❌ Generic disclaimers → Must be YMYL-specific

**Scope Boundary:** YMYL disclaimers ONLY.

---

### T3: Provenance Signals
**Max Score:** 5 points
**Purpose:** Detect visible content attribution

**DETECTS:**
- ✅ Bylines (author names visible)
- ✅ Published dates
- ✅ Modified dates
- ✅ Reviewer labels

**DOES NOT DETECT:**
- ❌ Author credentials → This is X1's domain
- ❌ Freshness scoring → This is E4's domain

**Scope Boundary:** Visible attribution ONLY (not credential quality or recency scoring).

---

### T4: Contact Transparency
**Max Score:** 4 points
**Purpose:** Detect transparency and accountability

**DETECTS:**
- ✅ About/Team page
- ✅ Real contact information
- ✅ Privacy policy
- ✅ Terms of service

**DOES NOT DETECT:**
- ❌ Author bios → This is X1's domain
- ❌ Entity schema → This is A3's domain

**Scope Boundary:** Site-wide transparency ONLY.

---

### T5: Schema Hygiene
**Max Score:** 4 points
**Purpose:** Detect valid and complete schema markup

**DETECTS:**
- ✅ Valid Article/WebPage schema
- ✅ Person schema completeness
- ✅ Key required fields present

**DOES NOT DETECT:**
- ❌ Experience-specific schema → This is E5's domain
- ❌ Author credentials in schema → This is X1's domain

**Scope Boundary:** Schema technical quality ONLY.

---

### T6: Schema Adoption Rate [BLOG-LEVEL]
**Max Score:** 2 points
**Purpose:** Detect consistent schema usage across blog

**DETECTS:**
- ✅ Percentage of posts with schema
- ✅ Schema consistency

**DOES NOT DETECT:**
- ❌ Schema quality → This is T5's domain

**Scope Boundary:** Blog-level schema presence ONLY.

---

### T7: Quality Consistency [BLOG-LEVEL]
**Max Score:** 2 points
**Purpose:** Detect low variance in content quality

**DETECTS:**
- ✅ Consistent quality across posts
- ✅ No thin content mixed with quality content

**DOES NOT DETECT:**
- ❌ Absolute quality → Other metrics handle positive signals

**Scope Boundary:** Consistency variance ONLY.

---

## Cross-Metric Validation Checklist

When implementing or reviewing a metric, verify:

- [ ] **No credential scoring outside X1/X2**
  - E1 should NOT check author credentials
  - E2 should NOT score credential quality
  - A2 should NOT score credentials (only external reputation)

- [ ] **No author metadata in content metrics**
  - E1 should only analyze content text
  - X1 is the sole owner of author metadata

- [ ] **No overlap between E2 and X2**
  - E2 detects perspective structure (sections, attribution)
  - X2 validates YMYL reviewer quality

- [ ] **No freshness overlap**
  - E4 = single page recency
  - E6 = blog posting frequency
  - E7 = blog update rate

- [ ] **No citation confusion**
  - X4 = external sources this site cites
  - A4 = external sites citing this site
  - E3 = original content this site creates

- [ ] **No schema duplication**
  - E5 = experience-specific schema
  - T5 = general schema quality
  - T6 = blog-level schema adoption

---

## Enforcement

### During Implementation
1. Read this scope guide before coding
2. Only detect signals explicitly listed in "DETECTS"
3. Reject signals explicitly listed in "DOES NOT DETECT"
4. If unsure, default to narrower scope

### During Workshop
1. Compare current implementation against scope guide
2. Identify any out-of-scope signals
3. Remove violations before calibration
4. Document any scope clarifications

### During Code Review
1. Verify no cross-metric signal overlap
2. Ensure single source of truth for each signal
3. Check that removed pathways stay removed

---

## Revision History

**2025-01-12 (Initial Version)**
- Defined scope for all 27 metrics
- Identified E1/E2 credential overlap with X1/X2
- Clarified E2 should detect structure, not score credentials
- Separated single-page (E4) from blog-level (E6/E7) freshness
- Distinguished citation direction (X4 vs A4)
