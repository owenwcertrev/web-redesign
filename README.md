# CertREV Website

The marketing website for CertREV - Expert Content Verification for Health, Wellness & Professional Services.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Deployment**: Vercel
- **Email**: Resend

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Crisp Chat Widget (Optional)
# Get your Website ID from https://app.crisp.chat/settings/websites/
NEXT_PUBLIC_CRISP_WEBSITE_ID=your_crisp_website_id_here

# Resend Email Service (Required for forms)
# Get your API key from https://resend.com/api-keys
RESEND_API_KEY=your_resend_api_key_here
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Building for Production

```bash
npm run build
```

### Running Production Build Locally

```bash
npm start
```

## Project Structure

```
├── app/                      # Next.js App Router pages
│   ├── api/                 # API routes (contact, newsletter, E-E-A-T meter)
│   ├── page.tsx             # Homepage
│   ├── pricing/             # Pricing page
│   ├── eeat-meter/          # E-E-A-T analysis tool
│   └── ...                  # Other pages
├── components/              # React components
│   ├── animations/          # Animation components
│   ├── cards3d/             # 3D card effects
│   ├── trust/               # Trust indicator components
│   └── ...                  # Other reusable components
├── config/                  # Configuration files
│   └── features.ts          # Feature flags
├── data/                    # Static data and content
├── public/                  # Static assets
└── styles/                  # Global styles
```

## Key Features

- **Responsive Design** - Mobile-first, works on all devices
- **Organic Aesthetic** - Custom textures, shapes, and animations
- **E-E-A-T Meter** - Interactive tool to analyze website trust signals
- **Contact Forms** - Integrated with Resend for email delivery
- **Newsletter** - Subscription management
- **3D Effects** - Interactive card components with depth and tilt

## Deployment

The site automatically deploys to Vercel on every push to the `main` branch.

**Production URL**: https://www.certrev.com

### Manual Deployment

```bash
vercel --prod
```

## Environment Configuration

### Production Environment Variables (Vercel)

Configure these in your Vercel project settings:

1. Go to Project Settings > Environment Variables
2. Add:
   - `RESEND_API_KEY` (Production, Preview, Development)
   - `NEXT_PUBLIC_CRISP_WEBSITE_ID` (Optional - for chat widget)

## Contributing

This is a private repository for CertREV's marketing website.

## License

Proprietary - All rights reserved by CertREV
