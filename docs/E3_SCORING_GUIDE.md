# E3 (Original Assets) Scoring Guide

## Overview

E3 measures **original content creation** through explicit textual signals. Sites must have clear references to original assets in their content text.

**Max Score:** 3.0 points
**Approach:** Strict mode - requires explicit textual signals

---

## Scoring Philosophy

### ✅ E3 DETECTS (Explicit Signals)

**Sites WILL score if they have:**
- Explicit figure references: "Figure 1 shows...", "See diagram below"
- Original research statements: "Our study found...", "We analyzed..."
- Case study presentations: "Patient story:", "Client example:"
- Tutorial structure: "Step 1:", "Screenshot shows...", "How-to guide"
- Team/facility mentions: "Our team", "Our clinic", "Meet our staff"
- Before/after descriptions: "Before and after photos", "Progress images"

### ❌ E3 DOES NOT DETECT (Implicit/Embedded Content)

**Sites will score 0 if they have:**
- Embedded diagrams without text labels (e.g., CSS-Tricks inline SVGs)
- Stock photos without original asset signals
- Casual references in discussions (e.g., "see fig. 1" on Stack Overflow)
- Generic "examples" without structured tutorial signals
- External citations (handled by X4, not E3)

---

## Expected Scores by Content Type

### Content Types That SHOULD Score 0

| Content Type | Why E3 = 0 | Example Sites |
|---|---|---|
| **Documentation Aggregators** | Synthesize existing info, no original assets | MDN, Wikipedia |
| **News Aggregators** | Curate external content | Hacker News, Reddit |
| **Q&A Forums** | User discussions, not brand assets | Stack Overflow |
| **Search Results** | Index of external content | Google SERP |
| **Simple Blogs** | Opinion/commentary only, no research | Personal blogs |
| **Stock Photo Sites** | Generic images, no explicit signals | Healthline (some articles), WebMD (some) |
| **Embedded Diagram Sites (No Text Labels)** | Has visual assets but NO explicit textual references | CSS-Tricks, some tutorial sites |

### Content Types That SHOULD Score > 0

| Content Type | Expected Range | Pathway Signals | Example Sites |
|---|---|---|---|
| **Medical Research Institutions** | 1.5-3.0 | Original research, case studies, figures | NIH, university hospitals |
| **Financial Analysis** | 1.0-2.5 | Custom charts, proprietary data, infographics | NerdWallet (with explicit refs) |
| **Academic Content** | 1.5-3.0 | Figures, research, data visualizations | Research journals (with "Figure 1") |
| **Tutorial Sites (Explicit)** | 1.0-2.5 | "Step 1:", screenshots, how-to structure | Tutorials with step-by-step text |
| **Case Study Sites** | 1.5-2.5 | Client stories, before/after, results | Agencies, consultancies |
| **Business Sites (Team Focus)** | 0.3-1.5 | Team photos, facility tours, "our team" | Local businesses, practices |

---

## Detection Pathways (7 Total)

### Pathway 1: Visual Asset References (0.8pts)
**Requires:** Contextual phrases indicating original asset presentation

**✅ DETECTS:**
- "Figure 1 shows our results"
- "See the diagram below"
- "Chart 2 illustrates the data"
- "Infographic demonstrates..."
- "In Figure 3, we observe..."

**❌ DOES NOT DETECT:**
- "see fig. 1" (casual reference, no context)
- Embedded SVGs without text labels
- "figure it out" (false positive prevention)

### Pathway 2: Original Research/Data (0.8pts)
**Detects:** First-party research, proprietary data, curated examples

**✅ DETECTS:**
- "Our study analyzed 10,000 patients"
- "We surveyed 500 experts"
- "Based on our research"
- "Sample meal plan" (curated original content)
- "Example workout routine"

**❌ DOES NOT DETECT:**
- "According to CDC data" (external citation - X4 domain)
- "Studies show..." (external research)

### Pathway 3: Case Studies (0.7pts)
**Detects:** Patient/client stories, real-world examples

**✅ DETECTS:**
- "Case study: Maria, a 45-year-old patient..."
- "Client example from our practice"
- "Real-world success story"
- "Patient testimonial"

**❌ DOES NOT DETECT:**
- Generic "examples" without story structure
- External case studies ("Harvard Business Review case")

### Pathway 4: Before/After (0.5pts)
**Detects:** Progress photos, transformation demonstrations

**✅ DETECTS:**
- "Before and after photos"
- "Progress images show results"
- "Comparison chart illustrates changes"

### Pathway 5: Tutorial Assets (0.4pts)
**Detects:** Screenshots, structured step-by-step guides

**✅ DETECTS:**
- "Screenshot shows the interface"
- "Step 1: Open the application"
- "How-to guide for beginners"
- "Follow these steps"

**❌ DOES NOT DETECT:**
- "demonstration" (standalone, casual reference)
- "first, second, third" without step structure
- Generic "examples" sections

### Pathway 6: Team/Facility Photos (0.3pts)
**Detects:** Original team/facility photography mentions

**✅ DETECTS:**
- "Meet our team of experts"
- "Our clinic features..."
- "About our practice"
- "Our research team"

**❌ DOES NOT DETECT:**
- "Our website" (generic, not team-specific)
- "Our mission" (not photo-related)

### Pathway 7: Schema ImageObject (0.5pts)
**Detects:** ImageObject schema with creator/copyrightHolder fields

**Checks:** Structured data indicating image ownership

---

## Design Decisions (2025-01)

### Decision 1: Removed Pathway 8 (Visual Richness)
**Problem:** Awarded points for ALL images, including stock photos
**Impact:** Healthline scored 1.0/3 with 17 stock images, no original assets
**Fix:** Removed entirely - E3 now requires explicit signals

### Decision 2: Strict Mode (Option B)
**Problem:** CSS-Tricks has original diagrams but no text labels
**Decision:** Keep strict - only detect explicit textual signals
**Rationale:** Maintains consistency, avoids ambiguity
**Impact:** Sites with embedded diagrams but no text refs score 0 (intentional)

### Decision 3: Contextual Patterns
**Problem:** Stack Overflow scored 1.2/3 for casual "fig. 1" references
**Fix:** Require contextual phrases ("Figure 1 shows", not just "fig. 1")
**Impact:** Q&A discussions no longer trigger false positives

---

## Testing Results

### Comprehensive Site Testing (14 sites)

**Overall Pass Rate:** 57.1% (8/14)

**By Category:**
- Negative detection: 100% (4/4) ✅ Perfect - no false positives
- Edge cases: 66.7% (2/3) ✅ Stack Overflow false positive eliminated
- Positive detection: 28.6% (2/7) - Low due to 404 errors and strict mode

**False Positives:** 0 (was 1 before strict mode)

**Key Validations:**
- ✅ Healthline: 0.00/3 (stock photos only)
- ✅ Mayo Clinic: 0.00/3 (conservative medical, no explicit signals)
- ✅ Stack Overflow: 0.00/3 (was 1.20/3 - FIXED)
- ✅ CSS-Tricks: 0.00/3 (embedded diagrams, no text refs - CORRECT per Option B)
- ✅ Wikipedia: 0.00/3 (encyclopedia, synthesized content)
- ✅ MDN: 0.00/3 (documentation aggregator)
- ✅ Reddit: 0.00/3 (user forum)
- ✅ Google SERP: 0.00/3 (search results)

---

## Common Questions

### Q: Why does my tutorial site score 0?
**A:** E3 requires explicit textual signals. If your diagrams are embedded without text references like "Figure 1 shows..." or "See diagram below", E3 will score 0. This is intentional (strict mode).

**Solution:** Add explicit references to your visual assets in the content text.

### Q: Why does a medical site with lots of images score 0?
**A:** E3 detects ORIGINAL assets with explicit signals, not generic stock photos. If the page doesn't reference "Figure 1", "Our study", "Case study", or other explicit signals, it scores 0.

**Not a bug:** Stock photos ≠ original assets.

### Q: Should every site score > 0 on E3?
**A:** No. E3 measures a specific E-E-A-T signal (original content creation). Sites can be high-quality without original assets:
- Aggregators (MDN, Wikipedia) = 0 (correct)
- News sites = 0 (correct)
- Simple blogs without research = 0 (correct)

E3 = 0 doesn't mean "bad site". It means "no original asset signals detected".

### Q: Can sites improve their E3 score?
**A:** Yes. Add explicit textual signals:
- Reference figures: "Figure 1 shows..."
- Share original research: "Our study found..."
- Present case studies: "Patient story: John..."
- Create step-by-step tutorials: "Step 1: ..."
- Highlight team: "Meet our team..."

---

## Version History

**v2.0 (2025-01):**
- Removed Pathway 8 (visual richness) - scope violation fix
- Implemented strict mode (Option B)
- Tightened Pathway 1 & 5 patterns - eliminated false positives
- Updated international patterns with contextual requirements

**v1.0 (2024):**
- Initial implementation with 8 pathways
- Included visual richness (later removed)

---

## Related Metrics

**E3 does NOT overlap with:**
- **X1:** Author credentials (MD, PhD) - X1's domain
- **X2:** Expert reviewers - X2's domain
- **X4:** External citations - X4's domain
- **A1:** Site reputation - A1's domain

**E3 measures:** Brand-owned original content creation ONLY.
