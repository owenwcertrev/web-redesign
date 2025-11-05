# Site Cleanup Audit

## Issues Found

### 1. Script Font Usage (font-script) - 4 instances
**Location and Fix:**
- `app/for-experts/page.tsx:214` - "Ready to Start?" → Remove script font
- `app/how-it-works/page.tsx:349` - "Get Started" → Remove script font
- `app/eeat-meter/page.tsx:81` - "Your Free Report" → Remove script font
- `app/eeat-meter/page.tsx:184` - "Understanding E-E-A-T" → Remove script font

**Fix:** Remove all `font-script` classes, these decorative script text lines are unnecessary

### 2. Legacy Color Names - 20 files
**Found in:**
Files still using `primary`, `verification`, `alert` instead of `navy`, `lime`, `coral`

Files with legacy colors:
- app/human-layer/page.tsx
- components/trust/ConfidenceMeter.tsx
- app/trust-showcase/page.tsx
- components/trust/CitationMarker.tsx
- components/cards3d/StackedCards.tsx
- app/cards-3d-demo/page.tsx
- components/cards3d/Carousel3D.tsx
- app/radical-demo/page.tsx
- components/radical/NeonText.tsx
- components/trust/TrustIndicator.tsx
- components/trust/GlassMorphCard.tsx
- components/trust/VerificationProgress.tsx
- components/EEATMeterTool.tsx
- components/StatCard.tsx
- app/contact/page.tsx
- app/expert-dashboard/page.tsx
- app/brand-dashboard/page.tsx
- components/ScoreGauge.tsx
- components/NewsletterSignup.tsx
- components/StatusIndicator.tsx

**Fix:** Update color names to match brand colors:
- `primary` → `navy`
- `verification` → `lime`
- `alert` → `coral`

### 3. Inconsistent Component Styling
**To Audit:**
- Border radius consistency (should be rounded-2xl = 16px)
- Spacing consistency
- Shadow usage
- Texture overlay opacity (should be 0.2-0.3)

## Cleanup Priority

1. **HIGH**: Remove all font-script instances (4 files)
2. **MEDIUM**: Update legacy color names (20 files)
3. **LOW**: Style consistency audit (if needed after colors)

## Expected Outcome

- Consistent typography (no script fonts)
- Consistent color palette (navy/lime/coral only)
- Cleaner, more professional appearance
- Easier maintenance
