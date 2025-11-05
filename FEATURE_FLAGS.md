# Feature Flags Guide

This project uses feature flags to dynamically show/hide sections of the site. This is useful for hiding content that's not ready yet, or for A/B testing different layouts.

## How to Use

All feature flags are defined in `/config/features.ts`.

### Showing/Hiding Sections

To toggle a section on the homepage, simply change the boolean value in the config file:

```typescript
// config/features.ts
export const featureFlags = {
  homepage: {
    expertNetwork: false, // Set to true to show the expert carousel
    // ... other sections
  }
}
```

**That's it!** The change will take effect immediately after redeploying.

## Available Homepage Sections

```typescript
homepage: {
  heroSection: true,           // Main hero with CTA
  statsSection: true,          // Flip stat cards
  processSection: true,        // How it works stacked cards
  whyExpertValidation: true,   // Benefits grid
  trustInfrastructure: true,   // Trust infrastructure with citations
  pricingTiers: true,          // Credential tier pricing
  expertNetwork: false,        // Expert carousel (currently hidden)
  humanLayer: true,            // Blog articles preview
  testimonials: true,          // Customer testimonials
  ctaSection: true,            // Final CTA
}
```

## Example: Showing the Expert Network

When you're ready to showcase your expert network:

1. Open `/config/features.ts`
2. Change `expertNetwork: false` to `expertNetwork: true`
3. Commit and push to Vercel
4. The "Meet Our Expert Network" carousel will appear on the homepage

## Adding New Feature Flags

To add a feature flag for a new section:

1. Add the flag to `/config/features.ts`:
   ```typescript
   homepage: {
     myNewSection: true,
     // ...
   }
   ```

2. Wrap the section in a conditional in your component:
   ```tsx
   import { featureFlags } from '@/config/features'

   {featureFlags.homepage.myNewSection && (
     <section>
       {/* Your content here */}
     </section>
   )}
   ```

## Tips

- Keep feature flags simple - just booleans for show/hide
- Use descriptive names that match the section's purpose
- Document what each flag controls in comments
- Remove flags once a feature is permanently enabled
