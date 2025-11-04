# CertREV Design System & Style Guide

## Overview
This guide captures the aesthetic and design principles of CertREV, a warm, consumer-friendly trust verification platform. The design balances professionalism with approachability, using texture, depth, and organic elements to create a trustworthy yet modern experience.

---

## Color Palette

### Primary Colors
- **Navy**: `#0A1B3F` - Primary brand color, used for text, headings, and primary elements
  - Usage: Headings, body text, borders, card backgrounds
  - Opacity variants: `navy/10`, `navy/20`, `navy/30`, `navy/40`, `navy/70`, `navy/80`

- **Lime**: `#D4E157` - Verification/trust highlight color
  - Usage: Accents, verification badges, trust indicators, highlights
  - Dark variant: `#A8B43E` (lime-dark)
  - Light variant: `#E8F5A0` (lime-light)
  - Opacity variants: `lime/10`, `lime/20`, `lime/30`

- **Coral**: `#E8603C` - Action/CTA color
  - Usage: Primary buttons, CTAs, hover states, action elements
  - Hover variant: `#D14E2A` (coral-hover)
  - Opacity variants: `coral/10`, `coral/20`, `coral/40`

### Neutral Colors
- **Beige**: `#E8E4DB` - Primary background color
  - Usage: Page backgrounds, section backgrounds, card backgrounds (alternating)
  
- **White**: `#FFFFFF` - Card backgrounds, text on dark backgrounds
  
- **Black**: `#000000` - Text color
  - Opacity variants: `black/70`, `black/80` (for body text)

### Legacy/Alias Colors (for migration)
- `primary` → `navy`
- `verification` → `lime`
- `alert`/`accent` → `coral`
- `cream` → `beige`
- `charcoal` → `black`

---

## Typography

### Font Families
1. **Script Font**: `Allura` (Google Fonts)
   - Usage: Decorative headings, callout text, "handwritten" style elements
   - Example: Section subheadings like "The Numbers", "Built Different"

2. **Sans Serif**: `DM Sans` (Google Fonts)
   - Usage: Primary body text, UI elements, navigation
   - Weight range: 400-700 (regular to bold)
   - Font smoothing: Antialiased for crisp rendering

3. **Serif**: `Playfair Display` (Google Fonts)
   - Usage: Main headings, hero titles, card titles
   - Weight range: 400-900
   - Creates warmth and trustworthiness

### Type Scale
- **Hero Titles**: `text-6xl` to `text-8xl` (60px-96px), bold, serif
- **Section Headings**: `text-5xl` to `text-6xl` (48px-60px), bold, serif
- **Card Titles**: `text-2xl` to `text-3xl` (24px-30px), bold, serif
- **Body Text**: `text-base` to `text-lg` (16px-18px), sans-serif
- **Small Text**: `text-sm` to `text-xs` (12px-14px), sans-serif
- **Labels/Uppercase**: `text-xs` to `text-sm`, uppercase, tracking-wide, semibold

### Text Styling Patterns
- **Leading**: `leading-relaxed` for body text, `leading-tight` for headings
- **Tracking**: `tracking-wide` for uppercase labels
- **Text Balance**: Use `text-balance` utility for better text wrapping
- **Opacity**: Body text uses `text-black/70` or `text-black/80` for readability

---

## Spacing & Layout

### Container Widths
- Standard: `max-w-6xl` (1152px)
- Wide: `max-w-7xl` (1280px)
- Narrow: `max-w-4xl` (896px) or `max-w-5xl` (1024px)

### Section Spacing
- Large sections: `py-24` to `py-28` (96px-112px vertical padding)
- Standard padding: `px-4` (16px) on mobile, `px-6` to `px-8` on desktop

### Component Padding
- Cards: `p-8` (32px) standard, `p-10` (40px) or `p-12` (48px) for emphasis
- Buttons: `px-7 py-3.5` (md), `px-9 py-4` (lg), `px-5 py-2.5` (sm)
- Internal spacing: `gap-4` to `gap-8` (16px-32px) between elements

### Grid Layouts
- Cards: `grid md:grid-cols-2 lg:grid-cols-3` or `md:grid-cols-4`
- Gap: `gap-8` (32px) standard

---

## Border Radius & Shadows

### Border Radius
- Cards: `rounded-2xl` (16px) - standard for all cards
- Buttons: `rounded-lg` (8px)
- Badges/Pills: `rounded-full`
- Small elements: `rounded-xl` (12px)

### Borders
- Width: `border-2` (2px) standard
- Colors: `border-navy/10`, `border-lime/20`, `border-coral` (context-dependent)
- Style: Solid, never dashed or dotted

### Shadows
- Cards: `shadow-md` (standard), `shadow-lg` (hover/elevated)
- Buttons: `shadow-md` with `hover:shadow-lg`
- Hover states: Increase shadow on interactive elements

---

## Components & Patterns

### Cards
**Base Structure:**
```tsx
<div className="bg-white rounded-2xl p-8 border-2 border-navy/10 shadow-md relative overflow-hidden">
  <TextureOverlay type="paper" opacity={0.3} />
  {/* Content */}
</div>
```

**Key Characteristics:**
- Always use `rounded-2xl`
- Include `border-2` with appropriate color/opacity
- Include `shadow-md` (hover: `shadow-lg`)
- Use `relative overflow-hidden` for texture overlays
- Include `TextureOverlay` component for paper texture
- Background alternates between `bg-white` and `bg-beige` for visual rhythm

### Buttons
**Primary Button:**
- Background: `bg-coral`
- Text: `text-white`
- Hover: `hover:bg-coral-hover`
- Shadow: `shadow-md hover:shadow-lg`
- Border radius: `rounded-lg`
- Padding: Size-dependent (see Spacing)

**Secondary Button:**
- Background: Transparent
- Border: `border-2 border-coral`
- Text: `text-coral`
- Hover: `hover:bg-coral hover:text-white`

**Ghost Button:**
- Background: Transparent
- Text: `text-navy`
- Hover: `hover:bg-navy/10 hover:text-coral`

### Flip Cards (3D Interaction)
**Front Side:**
- Background: `bg-white`
- Border: `border-2 border-navy/10`
- Include icon, stat, label, description
- Small indicator dot (top-right): `w-2 h-2 rounded-full bg-coral/40`

**Back Side:**
- Background: `bg-navy`
- Border: `border-2 border-navy`
- Text: `text-white`
- Icon: `text-lime`
- Bullet points with lime dots
- Footer with "VERIFIED" badge

**Animation:**
- 3D flip using `perspective: 1500px`
- `rotateY: 180deg` on flip
- Spring animation: `stiffness: 260, damping: 25`
- Duration: `0.4s`

### Trust Indicators
**Confidence Meters:**
- Height: `h-2` (8px)
- Background: `bg-charcoal/5`
- Border: `border border-charcoal/5`
- Gradient progress bar (color varies by score)
- Shimmer animation overlay
- Pulse effect at end of progress bar
- Monospace font for precision indicators

**Badges/Pills:**
- Background: `bg-white` or `bg-lime/10`
- Border: `border-2 border-lime` or `border-navy/20`
- Text: `text-sm font-semibold text-navy tracking-wide`
- Padding: `px-6 py-3`
- Border radius: `rounded-full`

---

## Visual Effects & Textures

### Texture Overlay
Two types of texture overlays:

1. **Paper Texture** (`type="paper"`):
   - Subtle repeating linear gradient pattern
   - Creates paper-like surface
   - Opacity: `0.2` to `0.4` typically

2. **Grain Texture** (`type="grain"`):
   - SVG-based fractal noise
   - More pronounced grain effect
   - Opacity: `0.15` to `0.2` typically

**Usage:**
- Always applied to cards with `absolute inset-0`
- Use `pointer-events-none` to avoid interaction issues
- Layer with `relative z-10` on content

### Organic Shapes (Blobs)
**Purpose:** Decorative background elements

**Variants:**
- `blob1`, `blob2`, `blob3`, `blob4` - Different SVG path shapes

**Colors:**
- `navy`, `lime`, `coral`, `beige`

**Styling:**
- Position: `absolute` with positioning classes
- Opacity: `0.06` to `0.12` (very subtle)
- Size: Typically `w-80 h-80` to `w-96 h-96` (320px-384px)
- Transform: Use `translate()` for positioning

**Usage:**
- Place in section backgrounds
- Use multiple blobs with different colors for depth
- Avoid overlapping with important content

### Animations

**Fade In:**
- Initial: `opacity: 0, y: 20`
- Animate: `opacity: 1, y: 0`
- Duration: `0.6s`
- Stagger children for lists

**Hover Effects:**
- Scale: `hover:scale-105` or `hover:scale-1.01`
- Shadow: `hover:shadow-lg`
- Border: `hover:border-navy/20`
- Smooth transitions: `transition-all duration-200`

**3D Effects:**
- Tilt: Use `TiltCard` component with mouse tracking
- Perspective: `1500px` for card flips
- Transform: `preserve-3d` for 3D transforms

**Shimmer:**
- Animation: `animate-shimmer` (2s infinite)
- Background: `from-transparent via-white/30 to-transparent`
- Used on progress bars and trust indicators

---

## Icon Usage

**Library:** Lucide React

**Sizing:**
- Small: `w-4 h-4` (16px)
- Medium: `w-5 h-5` (20px)
- Large: `w-7 h-7` (28px) or `w-8 h-8` (32px)
- Extra large: `w-12 h-12` (48px) or `w-16 h-16` (64px)

**Colors:**
- Primary: `text-coral`
- Accent: `text-lime`
- Dark: `text-navy`
- Light: `text-white` (on dark backgrounds)

**Usage:**
- Always paired with text labels
- Use in buttons: Icon + Text + ArrowRight
- In cards: Icon above or beside content
- In lists: Icon as bullet points (Check, ArrowRight, etc.)

---

## Color Application Rules

### Background Colors
- **Primary Background**: `bg-beige` for page/section backgrounds
- **Card Backgrounds**: Alternate `bg-white` and `bg-beige` for visual rhythm
- **Dark Sections**: Use `bg-navy` sparingly (flip card backs, special sections)
- **Accent Backgrounds**: Use color/opacity like `bg-lime/10`, `bg-coral/10`

### Text Colors
- **Primary Text**: `text-navy` for headings, `text-black/70` for body
- **Accent Text**: `text-coral` for CTAs, links, important text
- **Verification Text**: `text-lime` for trust indicators
- **Muted Text**: `text-black/40` or `text-navy/60` for secondary info

### Border Colors
- **Subtle Borders**: `border-navy/10` or `border-navy/20`
- **Accent Borders**: `border-lime` or `border-coral`
- **Strong Borders**: `border-navy` for emphasis

---

## Interactive States

### Hover States
- **Cards**: Scale up slightly (`scale-1.01`), increase shadow, brighten border
- **Buttons**: Darken background, increase shadow
- **Links**: Change color to coral (`hover:text-coral`)
- **Transitions**: `transition-all duration-200`

### Active/Focus States
- **Buttons**: Ring focus: `focus:ring-2 focus:ring-coral focus:ring-offset-2`
- **Accessibility**: Always include focus states

### Disabled States
- **Buttons**: `opacity-50 cursor-not-allowed`

---

## Responsive Design

### Breakpoints
- Mobile: Default (< 768px)
- Tablet: `md:` (≥ 768px)
- Desktop: `lg:` (≥ 1024px)

### Patterns
- **Grids**: `grid md:grid-cols-2 lg:grid-cols-3`
- **Text**: `text-4xl md:text-5xl lg:text-6xl`
- **Spacing**: `px-4 md:px-6 lg:px-8`
- **Visibility**: Hide decorative elements on mobile if needed

---

## Special Sections

### Hero Sections
- **Height**: `min-h-screen` with flex centering
- **Background**: Use `DepthHero` component with multiple layers
- **Layers**: Texture overlay + multiple organic shapes
- **Content**: Centered, large typography, CTA buttons
- **Animation**: Staggered fade-in for elements

### Trust Showcase Sections
- **Background**: `bg-beige` or `bg-white`
- **Cards**: Use flip cards or 3D cards
- **Metrics**: Include confidence meters
- **Visual**: Trust indicators, badges, verification marks

### Process/Steps Sections
- **Layout**: Stacked cards or carousel
- **Visual**: 3D depth, numbered steps
- **Colors**: Different accent color per step
- **Animation**: Reveal on scroll

---

## Code Patterns to Follow

### Component Structure
```tsx
<div className="relative bg-white rounded-2xl p-8 border-2 border-navy/10 shadow-md overflow-hidden">
  <TextureOverlay type="paper" opacity={0.3} />
  <div className="relative z-10">
    {/* Content here */}
  </div>
</div>
```

### Animation Patterns
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  {/* Content */}
</motion.div>
```

### Color Opacity Patterns
- Use `/10`, `/20`, `/30` for subtle backgrounds
- Use `/70`, `/80` for muted text
- Use full opacity for primary elements

---

## Do's and Don'ts

### Do's
✅ Use texture overlays on cards for depth
✅ Alternate white/beige backgrounds for rhythm
✅ Use serif fonts for headings (warmth)
✅ Include organic shapes in section backgrounds
✅ Use 2px borders consistently
✅ Apply rounded-2xl to all cards
✅ Use framer-motion for smooth animations
✅ Include hover states on all interactive elements
✅ Use opacity variants for subtle effects
✅ Maintain generous padding and spacing

### Don'ts
❌ Don't use sharp corners (always round)
❌ Don't use pure black for text (use navy or black/70)
❌ Don't skip texture overlays on cards
❌ Don't use harsh shadows (keep them soft)
❌ Don't mix different border widths (stick to 2px)
❌ Don't use too many colors (stick to navy, lime, coral)
❌ Don't skip hover states
❌ Don't use thin borders (always 2px)
❌ Don't forget z-index layering for textures
❌ Don't use flat backgrounds (add texture or organic shapes)

---

## Advanced Patterns

### 3D Card Interactions
- **Flip Cards**: Use `perspective` and `rotateY` transforms
- **Tilt Cards**: Mouse tracking with `transform: rotateX/Y`
- **Stacked Cards**: Layered depth with z-index
- **Carousel 3D**: Perspective transforms for 3D carousel effect

### Trust Visualization
- **Confidence Meters**: Animated progress bars with gradients
- **Verification Badges**: Lime-colored badges with checkmarks
- **Citation Markers**: Inline citation indicators with hover tooltips
- **Trust Indicators**: Pulse animations, shimmer effects

### Depth & Layering
- **Background Layers**: Multiple organic shapes with different opacities
- **Texture Layers**: Paper/grain overlays
- **Content Layers**: Relative z-index for proper stacking
- **Depth Hero**: Parallax-like depth effect in hero sections

---

## Implementation Notes

### Tailwind Configuration
- Custom colors defined in `tailwind.config.ts`
- Font families imported from Google Fonts
- Custom utilities for textures and animations
- Extended spacing and border radius values

### Component Library
- Reusable components in `/components`
- Animation components in `/components/animations`
- 3D card components in `/components/cards3d`
- Trust components in `/components/trust`

### Performance
- Use `viewport={{ once: true }}` for scroll animations
- Disable transitions during resize (`body.resizing`)
- Optimize texture overlays (use CSS, not images)
- Use `will-change` sparingly for animations

---

## Summary

The CertREV design system is built on:
1. **Warm, approachable colors** (navy, lime, coral on beige)
2. **Textured, layered surfaces** (paper/grain textures, organic shapes)
3. **3D interactive elements** (flip cards, tilt effects, depth)
4. **Trust-focused visualizations** (confidence meters, verification badges)
5. **Smooth, purposeful animations** (framer-motion, spring physics)
6. **Generous spacing and typography** (serif headings, relaxed line-height)

The aesthetic balances **professional trust** with **consumer-friendly warmth**, using texture and depth to create a tactile, credible experience.

---

## Quick Reference

### Colors
- Navy: `#0A1B3F`
- Lime: `#D4E157`
- Coral: `#E8603C`
- Beige: `#E8E4DB`

### Typography
- Headings: Playfair Display (serif)
- Body: DM Sans (sans-serif)
- Decorative: Allura (script)

### Spacing
- Cards: `p-8` (32px)
- Sections: `py-24` (96px)
- Gaps: `gap-8` (32px)

### Borders & Radius
- Border: `border-2` (2px)
- Radius: `rounded-2xl` (16px)

### Shadows
- Default: `shadow-md`
- Hover: `shadow-lg`

