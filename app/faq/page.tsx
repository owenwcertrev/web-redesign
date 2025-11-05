'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Accordion from '@/components/Accordion'
import DepthHero from '@/components/cards3d/DepthHero'
import FadeIn from '@/components/animations/FadeIn'
import TextureOverlay from '@/components/TextureOverlay'
import OrganicShape from '@/components/OrganicShape'
import { HelpCircle, Building2, GraduationCap, BookOpen } from 'lucide-react'

type TabType = 'brand' | 'expert' | 'general'

export default function FAQPage() {
  const [activeTab, setActiveTab] = useState<TabType>('brand')

  const brandFAQs = [
    {
      category: 'Program Overview & Value',
      items: [
        {
          question: 'What makes CertREV different from traditional expert networks or freelance reviewers?',
          answer: 'CertREV combines a credential-verified reviewer marketplace with AI-native workflows, SOC-2–ready security, automated W-9 capture, a blockchain audit hash, and JSON-LD EEAT schema. The platform gives brand leaders an end-to-end credibility layer that slots on top of any content engine without adding head-count, forcing long contracts, or exposing you to compliance gaps.'
        },
        {
          question: 'Why does CertREV use a credit model instead of flat pricing?',
          answer: 'Credits let you blend reviewer tiers, campaign volumes, and rush add-ons without renegotiating price every time. Finance teams get a predictable monthly line item; marketers get the agility to scale reviews up or down with zero administrative friction.'
        },
        {
          question: 'How does CertREV improve our EEAT and SEO performance?',
          answer: 'Each review adds structured author metadata, an EEAT Meter™ badge, and an audit-hashed receipt. Google sees a real-world expert vouching for the page, which typically lifts crawl frequency, backlink attraction, and ranking stability across the entire topic cluster.'
        },
        {
          question: 'How does CertREV compare to hiring an MD directly or using a Key Opinion Leader?',
          answer: 'Marketplace MD rates run $600–$1,200 per article and require separate contracts, NDAs, and invoicing. A CertREV MD review is 6 credits (~$480 at the mid-tier bundle) and is delivered under a platform SLA with built-in compliance checks and perpetual attribution rights. You can also tap multiple experts for the cost of one KOL engagement.'
        }
      ]
    },
    {
      category: 'Pricing & Credits',
      items: [
        {
          question: 'How does pricing work at CertREV?',
          answer: 'You purchase a monthly credit bundle. Each review deducts a preset number of credits based on the reviewer tier you choose.'
        },
        {
          question: 'What\'s included in the cost of a credit?',
          answer: 'Reviewer time, light editorial and compliance edits, the signed signature block with name/title/credentials, JSON-LD schema, managed project delivery, and platform QA.'
        },
        {
          question: 'How much does one credit cost?',
          answer: 'The base rate is $80. Bundles of 100+ credits trigger tiered discounts down to the low-$70s.'
        },
        {
          question: 'Do I have to commit to a long-term contract?',
          answer: 'No. Bundles renew month-to-month and can be changed or cancelled any time.'
        },
        {
          question: 'What happens if I need more credits than my bundle includes?',
          answer: 'Add-on credits are billed at your current bundle\'s per-credit rate and appear on the next invoice.'
        },
        {
          question: 'What happens if I upgrade my bundle?',
          answer: 'Your new, lower per-credit rate applies immediately to all future usage.'
        },
        {
          question: 'Do unused credits expire or roll over?',
          answer: 'Credits roll over for 90 days to accommodate campaign spikes or seasonal slowdowns.'
        },
        {
          question: 'How many credits does each expert review cost?',
          answer: 'We have 6 tiers of experts. To give you an example: 2 credits for certified wellness professionals, 4 for advanced specialists (e.g., RDs, NPs), and 6 for MD/PhD-level authorities.'
        },
        {
          question: 'Can I mix and match expert levels in my bundle?',
          answer: 'Yes—allocate credits across any tier, specialty, or content type.'
        },
        {
          question: 'Will I always know how many credits a reviewer will cost?',
          answer: 'Yes. The credit cost is fixed by tier and displayed before you confirm a brief.'
        },
        {
          question: 'Can I share my credits across multiple brands or divisions?',
          answer: 'Enterprise plans allow pooled credit wallets with role-based access controls.'
        },
        {
          question: 'Can credits be applied to rush reviews or brand-exclusivity add-ons?',
          answer: 'Yes—rush (24-hour) turnaround and 6- or 12-month reviewer exclusivity are optional add-ons priced in credits.'
        },
        {
          question: 'Can I preview or select reviewers before assigning them?',
          answer: 'You choose the tier and specialty; the platform matches you with a vetted expert who aligns with your brand and is available and not currently engaged with a direct competitor.'
        },
        {
          question: 'How do you assign reviewers to content?',
          answer: 'Matching weighs specialty, compliance history, prior brand conflicts, and SLA capacity to protect category exclusivity and hit deadlines.'
        },
        {
          question: 'Can we request the same reviewer each time?',
          answer: 'You can, but rotating qualified experts typically delivers stronger EEAT signals and mitigates over-reliance on a single name.'
        },
        {
          question: 'What if our brand operates in a competitive space?',
          answer: 'Reviewers are not assigned to direct competitors within the same category for at least six months, and you can purchase formal exclusivity if required.'
        },
        {
          question: 'Do you support global languages and regional compliance?',
          answer: 'Not yet.'
        },
        {
          question: 'How does CertREV integrate with our CMS or content stack?',
          answer: 'For enterprise clients, API endpoints and a Zapier app can push the signed review, schema, and badge directly into most CMSs, DAMs, or workflow tools.'
        }
      ]
    },
    {
      category: 'Expert Network & Quality Assurance',
      items: [
        {
          question: 'Who are the experts reviewing our content?',
          answer: 'Licensed or credentialed professionals—RNs, NPs, MDs, PhDs, RDs, CPAs, JDs, and other specialists—actively practicing in North America and verified quarterly.'
        },
        {
          question: 'How do you vet your experts?',
          answer: 'Identity verification, license/degree authentication via ComplyCube, 50-state sanctions check, LinkedIn activity review, and a maintained ≥ 4.0/5 post-project rating.'
        },
        {
          question: 'Are reviewers trained in editorial integrity or AI oversight?',
          answer: 'Each reviewer completes a mandatory toolkit covering citation style, hallucination red-flags, bias markers, and the CertREV compliance checklist before they take their first assignment.'
        },
        {
          question: 'Do reviewers just sign off, or do they edit content?',
          answer: 'They fact-check, correct citations, flag compliance issues, and add a short professional insight. If any checkpoint fails, you receive structured edit notes instead of a signature.'
        },
        {
          question: 'How do you monitor reviewer performance over time?',
          answer: 'Every project is rated by the brand. Scores below 4.0 trigger quality review, remedial training, or removal from the network.'
        },
        {
          question: 'How do you manage conflicts of interest?',
          answer: 'Reviewers disclose financial or competitive conflicts in the brief; the platform blocks assignment if a conflict exists and logs the decision in the audit record.'
        }
      ]
    },
    {
      category: 'Compliance, Security & Liability',
      items: [
        {
          question: 'Who is legally responsible for the content once it\'s reviewed?',
          answer: 'Your brand retains full responsibility. CertREV provides a documented credibility layer but is not the publisher of record.'
        },
        {
          question: 'Can we claim our article is "expert-approved" or "endorsed by" a professional?',
          answer: 'No. Experts are verifying legitimacy, not endorsing the brand or product. Use "Reviewed by [Name], [Credentials] via CertREV." Language implying endorsement or continuing affiliation is prohibited unless separately contracted.'
        },
        {
          question: 'What happens if we update the content after it\'s reviewed?',
          answer: 'If substantive edits are made, the reviewer\'s name and badge must be removed or the piece resubmitted for re-validation (1 credit).'
        },
        {
          question: 'How does CertREV reduce compliance risk with the FTC, FDA, or other regulators?',
          answer: 'The checklist forces evidence alignment, required disclaimers, and restricted-term removal. A signed audit hash gives legal teams a timestamped trail of due diligence.'
        },
        {
          question: 'Is CertREV SOC-2 compliant and how is our data secured?',
          answer: 'Yes—SOC-2 Type II controls govern encryption in transit and at rest, access logging, and quarterly penetration testing.'
        },
        {
          question: 'Does CertREV provide an audit trail or blockchain receipt for each review?',
          answer: 'Every completed review is hashed to an immutable ledger; the receipt, reviewer licence ID, and timestamp are stored in your dashboard for download.'
        },
        {
          question: 'Can reviewers sign NDAs for unreleased or sensitive material?',
          answer: 'A platform NDA is baked into every assignment; custom NDAs can be added for an additional cost.'
        }
      ]
    },
    {
      category: 'ROI & Performance',
      items: [
        {
          question: 'How long before we see a positive return?',
          answer: 'Most brands observe ranking uplift and incremental traffic within 60–120 days, aligning with Google\'s recrawl cadence.'
        },
        {
          question: 'Do we need to certify every article to hit those numbers?',
          answer: 'No—start with the top 20-40% of pages driving 80% of traffic or revenue, then expand as budget allows.'
        },
        {
          question: 'What\'s a realistic revenue lift?',
          answer: 'A site at 100k organic sessions/month might gains 10–15% more traffic and convert 0.5–0.7% of that lift.'
        },
        {
          question: 'What if our conversion rate is lower?',
          answer: 'Even at 0.25% CVR the program covers cost and delivers ~1.5× ROI; higher-intent pages often achieve 5-10× ROI.'
        },
        {
          question: 'What KPI should we track first?',
          answer: 'Monitor Google Search Console for average position gains, click growth on expert-stamped URLs, and new external links.'
        },
        {
          question: 'Does expert review help paid campaigns?',
          answer: 'Yes—landing pages displaying a third-party credibility badge converted 42% higher in a 2025 multivariate study, lowering CAC on identical ad spend. In the world of AI, credibility is more critical than ever to ensure content ranks.'
        },
        {
          question: 'How do we quantify compliance risk reduction?',
          answer: 'An FDA or FTC warning can exceed $50k in legal costs and lost media. A CertREV review adds a documented checkpoint for ≤ $80.'
        },
        {
          question: 'How does expert validation influence AI content detectors and brand-safety tools?',
          answer: 'Credible bylines lower AI-spam scores and boost brand-safety ratings, protecting programmatic ad revenue.'
        },
        {
          question: 'What happens if an expert\'s opinion changes or new research emerges?',
          answer: 'Request a re-audit for 1 credit; the original—or a peer-matched—expert updates the piece and re-signs, preserving attribution without starting over.'
        }
      ]
    },
    {
      category: 'Credibility, AI & Consumer Trust',
      items: [
        {
          question: 'Why can\'t AI alone guarantee credible content?',
          answer: 'LLMs predict language patterns; they do not verify empirical data. A human expert validates evidence, spots nuanced risk, and represents accountability that an algorithm cannot assume.'
        },
        {
          question: 'How does an expert byline impact search performance?',
          answer: 'Articles with recognizable subject-matter reviewers are prioritized under LLM\'s and Google\'s E-E-A-T framework, often earning stronger backlink profiles and higher topical authority.'
        },
        {
          question: 'Will a reviewer\'s name really influence buyer behavior?',
          answer: 'Edelman\'s 2025 Trust Barometer ranks credentialed experts as the most trusted spokespeople; visible professional validation reduces bounce rates and purchase hesitation.'
        },
        {
          question: 'Does perpetual use of an expert\'s likeness create legal risk?',
          answer: 'The platform\'s agreement grants perpetual, non-exclusive display rights and indemnifies the expert against post-publication edits, provided you do not alter reviewed copy without re-validation.'
        },
        {
          question: 'Can\'t we just quote studies instead of paying experts?',
          answer: 'Anyone can paste a PubMed link; Google and consumers reward brands that contextualize evidence through a living, accountable authority.'
        }
      ]
    },
    {
      category: 'Content Strategy & Consistency',
      items: [
        {
          question: 'Do people still read blogs?',
          answer: 'Yes—77% of internet users consume blogs regularly as of 2025.'
        },
        {
          question: 'Why should our brand bother with a blog at all?',
          answer: 'Brands that blog generate 55% more visitors and 67% more leads than those that don\'t.'
        },
        {
          question: 'How important is the posting cadence?',
          answer: 'Publishing 2–4 times per week drives 3× the traffic of less active sites.'
        },
        {
          question: 'What does "consistent" really mean for SEO?',
          answer: 'Routine updates drive up to 434% more indexed pages and 97% more inbound links, both core ranking factors.'
        },
        {
          question: 'Does blog freshness matter if we already rank well?',
          answer: 'Yes—stale content can slip overnight in competitive niches.'
        },
        {
          question: 'Where in the buyer journey do blogs make the most impact?',
          answer: 'Sixty percent of consumers value blog content during the awareness stage, but strategic blogs influence consideration and decision as well.'
        },
        {
          question: 'We plan big campaigns; can blogs really fuel other channels?',
          answer: 'Blog assets feed newsletters, social posts, lead magnets, and retargeting ads, lowering creative costs across the funnel.'
        },
        {
          question: 'What happens if we stop blogging for a few months?',
          answer: 'Organic traffic and backlink velocity decline; rankings on time-sensitive keywords soften. A brief pause is fine, but schedule at least one refresh per month.'
        },
        {
          question: 'Isn\'t it enough to post when we have news?',
          answer: 'Algorithmic and audience expectations favor steady value over sporadic bursts.'
        },
        {
          question: 'How do we keep up a reliable publishing schedule?',
          answer: 'Pair in-house and AI enabled writers with CertREV for research, review, and publishing logistics so volume doesn\'t stall when internal bandwidth is tight.'
        }
      ]
    },
    {
      category: 'Expert Reviewers vs Influencers',
      items: [
        {
          question: 'How is an expert reviewer different from an influencer?',
          answer: 'Reviewers supply verified credibility; influencers supply reach. Together they multiply trust and distribution.'
        },
        {
          question: 'Can expert reviewers promote content like influencers?',
          answer: 'No—their role is validation, not amplification.'
        },
        {
          question: 'Why use expert reviewers if they don\'t post about us?',
          answer: 'Credibility is a conversion multiplier; validated content performs better when you do choose to promote it.'
        },
        {
          question: 'Should we still work with influencers?',
          answer: 'Yes—pair influencer reach with reviewer validation for the strongest performance.'
        },
        {
          question: 'Can we work with the same person as both a reviewer and an influencer?',
          answer: 'Not generally with CertREV; separating roles preserves objectivity and compliance.'
        },
        {
          question: 'Does working with reviewers help influencer performance?',
          answer: 'Influencer content that features expert signatures is less likely to be flagged as misleading and benefits from higher engagement.'
        },
        {
          question: 'Are expert reviewers ever "paid to say nice things"?',
          answer: 'They are paid for their time and expertise, not endorsement. They only sign off on content that meets their professional standards.'
        },
        {
          question: 'Isn\'t it better to just have a big name promote us?',
          answer: 'Attention without trust can backfire; CertREV lays the factual foundation that makes promotion safe and effective.'
        }
      ]
    },
    {
      category: 'E-E-A-T & Reviewer Strategy',
      items: [
        {
          question: 'Should we use the same expert reviewer across all our content?',
          answer: 'Diversifying qualified voices signals broader institutional authority and future-proofs against potential reviewer conflicts. Diversification also makes it possible to be more specific with the niche-specialist reviewer who validates your content.'
        },
        {
          question: 'Why is it better to work with multiple expert reviewers instead of just one?',
          answer: 'Different credentials deepen topical relevance, layer credibility, and hedge against algorithmic changes that match expertise to subject matter.'
        },
        {
          question: 'What if we don\'t have the budget for a wide expert pool?',
          answer: 'Start with a broad-experience generalist and scale your bench as your gains in traffic can fund deeper specialization.'
        },
        {
          question: 'Can we assign different reviewers based on the topic of each article?',
          answer: 'Yes—the platform routes content to the right reviewer based on your selected specialty tag.'
        }
      ]
    },
    {
      category: 'Billing & Account Management',
      items: [
        {
          question: 'How am I billed?',
          answer: 'Credit bundles auto-bill monthly via Stripe; overages are added to the same invoice.'
        },
        {
          question: 'Can I change my plan later?',
          answer: 'Upgrades take effect instantly; downgrades apply on the next cycle.'
        },
        {
          question: 'Can I get a refund for unused credits?',
          answer: 'No, but 90-day rollover prevents waste, and credits can be transferred within enterprise accounts.'
        },
        {
          question: 'Is there a way to pause the service without losing progress?',
          answer: 'You can pause publishing; your signed evergreen articles keep compounding authority. Just ensure you resume within the 90-day rollover window or refresh top performers before credits expire.'
        }
      ]
    }
  ]

  const expertFAQs = [
    {
      category: 'Program Overview',
      items: [
        {
          question: 'Why do brands need credentialed reviewers instead of just influencers?',
          answer: 'Social media influencers drive reach; true experts deliver verifiable credibility—an asset AI cannot manufacture. Your license or certification certifies that health, finance, legal, or scientific claims are accurate, safe, and ethically framed, lifting consumer trust, regulatory confidence, and search-engine authority.'
        },
        {
          question: 'How does my review improve a brand\'s SEO and EEAT?',
          answer: 'Google\'s E-E-A-T signals reward pages that show Experience, Expertise, Authoritativeness, and Trust. Your signature block (name, credential, personal perspective, jurisdiction, date) satisfies all four, typically increasing crawl frequency, backlink attraction, and ranking stability across the entire topic cluster.'
        },
        {
          question: 'Will reviewing for brands help my professional reputation?',
          answer: 'Yes. Each live article lists you as a contributor, creating a public, verifiable record of your expertise that can lead to keynote invitations, media quotes, and academic or clinical career advancement—without the time commitment of full authorship.'
        },
        {
          question: 'Am I expected to promote the article on social media?',
          answer: 'No. Your role is independent validation, not endorsement or amplification. You may share the content if you wish, but brands do not expect it and cannot require it.'
        }
      ]
    },
    {
      category: 'Eligibility & Onboarding',
      items: [
        {
          question: 'Who can become a CertREV reviewer?',
          answer: 'Licensed or formally certified professionals—MDs, PhDs, NPs, RNs, IBCLCs, RDs, doulas, therapists, PharmDs, CPAs, JDs, MBAs, and similar experts—with subject-matter depth and credentials to back up their expertise.'
        },
        {
          question: 'What does the vetting process involve?',
          answer: 'You don\'t have to do anything aside from provide your basic information and permission to check your record. Our platform does all the admin. We perform: Identity verification, background check, active-license or credential authentication via ComplyCube, a 50-state sanctions/disciplinary check, and LinkedIn profile review.'
        },
        {
          question: 'Is there a minimum time commitment or exclusivity requirement?',
          answer: 'No. Set your weekly capacity in the dashboard and accept only the briefs that fit your schedule. You may decline assignments without penalty.'
        },
        {
          question: 'Can I pause or change my availability?',
          answer: 'Yes. Adjust capacity at any time. Pending briefs you have not yet accepted will return to the pool automatically.'
        },
        {
          question: 'What happens if I accept an assignment and later need to withdraw?',
          answer: 'Withdrawals before the start date incur no penalty. After you begin work, notify CertREV support so the brief can be reassigned. Withdrawal after acceptance can hurt your rating and reduce the number of future opportunities sent your way.'
        }
      ]
    },
    {
      category: 'Assignments & Workflow',
      items: [
        {
          question: 'How are projects matched to me?',
          answer: 'You define your specialties, tier, and capacity. The platform surfaces briefs that meet those parameters while generally avoiding direct competitors you have reviewed within the past six months.'
        },
        {
          question: 'What does each review actually require?',
          answer: 'Open the pre-formatted Google Doc, work through the five-part Compliance Checklist (Accuracy & Integrity, Evidence & Citations, Regulatory Compliance, Ethics & Conflicts, Personal Perspective), accept or suggest edits, and add 1-5 lines of your personal perspective. Typical effort: 30–60 minutes for a 1,500–2,000-word draft.'
        },
        {
          question: 'What resources support my review?',
          answer: 'A one-page style guide, an AI hallucination red-flag list, Grammarly access, and an optional plagiarism-scan link are included with every brief.'
        },
        {
          question: 'Do reviewers just sign off, or do they edit content?',
          answer: 'You perform a light but structured edit: fact-check, citation repair, compliance language, and clarity notes. If major issues remain, leave structured comments and reject the draft until corrected.'
        },
        {
          question: 'How many revision rounds are included?',
          answer: 'One feedback round is built in but rarely used; a brief follow-up pass is covered if the brand seeks factual clarification. Additional rounds of review for material changes constitute new assignments.'
        },
        {
          question: 'Can I communicate directly with the brand?',
          answer: 'Yes—comments inside the Google Doc are the primary channel. Direct email is enabled when a live call or nuance is required, with CertREV support copied to maintain an audit trail.'
        }
      ]
    },
    {
      category: 'Compensation & Payments',
      items: [
        {
          question: 'How am I paid and in what currency?',
          answer: 'You earn a fixed USD rate per assignment, deposited via ACH, Zelle, Venmo, or PayPal. Your choice.'
        },
        {
          question: 'When will I receive payment?',
          answer: 'Funds are released automatically 14 days after you sign off and the brand approves the draft.'
        },
        {
          question: 'Can I negotiate my rate?',
          answer: 'Request a tier re-evaluation at any time. We reassess credentials, demand, and market benchmarks each quarter to keep tiers equitable.'
        },
        {
          question: 'What tax documentation do you provide?',
          answer: 'You will receive a 1099-NEC each January if CertREV has paid you more than $600 in the year.'
        },
        {
          question: 'Are non-U.S. reviewers supported?',
          answer: 'Not yet.'
        }
      ]
    },
    {
      category: 'Public Attribution & Reputation',
      items: [
        {
          question: 'How will my name, credentials, and likeness be used?',
          answer: 'Your name, credential initials, headshot, and 50-word bio appear in the "Reviewed by" block on the approved article and may be listed on the brand\'s contributors page. Use beyond that (ads, product packaging, white-papers) requires a separate written agreement.'
        },
        {
          question: 'Can I remain anonymous or use a pen name?',
          answer: 'No. Transparent, credentialed attribution is the value to brands and readers. If public naming is an issue, CertREV may not be the right fit.'
        },
        {
          question: 'Am I required to maintain a social-media presence?',
          answer: 'Only an up-to-date LinkedIn profile displaying your credentials is mandatory. Social reach or activity is optional.'
        }
      ]
    },
    {
      category: 'Legal Protection & Liability',
      items: [
        {
          question: 'Am I legally liable for the brand\'s content once I review it?',
          answer: 'Your contract limits liability to gross negligence. The brand, as publisher of record, remains responsible for final copy and its real-world use.'
        },
        {
          question: 'Do I need to carry malpractice or professional-liability insurance?',
          answer: 'No additional policy is required. You are supplying educational commentary, not patient-specific or client-specific advice.'
        },
        {
          question: 'How does CertREV protect me if the brand changes content after approval?',
          answer: 'The approved version is hashed to an immutable ledger. If the brand edits the piece, they must remove your attribution or request re-validation. You are not liable for unauthorized changes.'
        },
        {
          question: 'Is my data stored securely?',
          answer: 'Yes—CertREV is SOC-2 Type II compliant. All personal data and license documents are encrypted in transit and at rest, with quarterly penetration tests and role-based access controls.'
        },
        {
          question: 'Do I sign an NDA for proprietary content?',
          answer: 'A platform-wide NDA covers all assignments; custom NDAs can be added at no cost when brands share pre-launch or sensitive material.'
        }
      ]
    },
    {
      category: 'Exclusivity & Conflicts of Interest',
      items: [
        {
          question: 'Can I work with competing brands or publish my own content elsewhere?',
          answer: 'Yes. The only restriction is that you cannot review for direct competitors within the same product-category niche for six months if the brand purchases formal exclusivity. Personal blogs, academic papers, and employer content are unrestricted.'
        },
        {
          question: 'How are conflicts of interest managed?',
          answer: 'You disclose financial or competitive ties when a brief is offered. The platform blocks assignment if a conflict exists and records the decision in the audit trail.'
        }
      ]
    },
    {
      category: 'Growth, Community & Support',
      items: [
        {
          question: 'How is reviewer performance monitored?',
          answer: 'Brands rate each project 1–5. Scores below 4.0 trigger quality review, targeted feedback, and—if unresolved—removal from the network.'
        },
        {
          question: 'Are there opportunities for continuing education or community events?',
          answer: 'Yes. Quarterly webinars cover SEO trends, regulatory updates, and reviewing best practices. Participation is optional and unpaid.'
        },
        {
          question: 'Who do I contact for platform or payment support?',
          answer: 'Use the in-platform chat or email certreviewed@gmail.com for assignment, tech, or payment queries—responses within two business days.'
        }
      ]
    },
    {
      category: 'Re-Validation & Ongoing Engagement',
      items: [
        {
          question: 'What if new research emerges after I sign off?',
          answer: 'The brand can request a re-validation cycle. You receive first right of refusal; the update is treated as a new micro-assignment at one credit (paid to you at your standard rate).'
        },
        {
          question: 'Can I end my relationship with CertREV at any time?',
          answer: 'Yes. Provide written notice, complete any accepted briefs, and your profile will be deactivated. Existing attributions remain live unless you request removal for cause (e.g., misrepresentation by the brand).'
        }
      ]
    }
  ]

  const generalFAQs = [
    {
      category: 'SEO & E-E-A-T Foundations',
      items: [
        {
          question: 'What exactly is E-E-A-T?',
          answer: 'Google\'s quality framework looks for Experience, Expertise, Authoritativeness, and Trust in every piece of content. Pages that demonstrate all four signals are more likely to earn and keep strong rankings.'
        },
        {
          question: 'Why did Google add the extra "E" for Experience?',
          answer: 'First-hand perspective—stories, case data, or practitioner insight—proves the author has actually done what they\'re writing about, filtering out generic AI summaries and untested advice.'
        },
        {
          question: 'Is E-E-A-T a direct ranking factor like page speed?',
          answer: 'Not in the technical sense, but the machine-learning systems that power rankings and AI answers favor pages where these qualities are obvious, especially for topics that affect health, money, or safety.'
        },
        {
          question: 'How have recent updates punished weak E-E-A-T?',
          answer: 'Core updates across 2024–25 cut 50%+ of traffic from sites that leaned on anonymous or lightly edited AI copy. Pages with clear expertise and strong sourcing retained visibility.'
        },
        {
          question: 'What is "zero-click" search and why does it matter?',
          answer: 'A zero-click occurs when Google answers a query directly on the results page—through featured snippets, People-Also-Ask boxes, or AI Overviews—so users don\'t need to visit a site. Brands now compete to be cited in those answers rather than just listed below them.'
        },
        {
          question: 'How can I still win traffic if Google shows the answer?',
          answer: 'Own the citation. Pages with credible bylines, structured data, and concise, evidence-backed summaries are algorithmically preferred for featured snippets and AI Overviews. Even a single citation can drive outsized clicks and brand recognition.'
        },
        {
          question: 'What is an AI Overview and how is it different from a featured snippet?',
          answer: 'Featured snippets quote one page verbatim; AI Overviews synthesize information from several sources, then display a handful of links. The bar for trust and clarity is higher because the system must reconcile multiple viewpoints.'
        },
        {
          question: 'How do large language models decide which pages to cite?',
          answer: 'They draw from Google\'s index, prioritizing pages that pair reliable evidence with machine-readable signals—author bios, review schema, up-to-date sources, and minimal spam indicators.'
        },
        {
          question: 'Will AI-generated copy hurt us if it looks accurate?',
          answer: 'Accuracy is necessary but insufficient. Google now down-ranks "scaled content" that lacks original insight or clear accountability. Human fact-check plus expert attribution is the safest path.'
        },
        {
          question: 'Do consumers really notice who wrote an article?',
          answer: 'Yes—surveys show over 70% of readers distrust anonymous or AI-only content. Adding a recognizable professional lifts engagement metrics like time-on-site, shares, and backlinks.'
        },
        {
          question: 'How does expert validation boost backlinks and social shares?',
          answer: 'Long-form pieces that feature licensed reviewers earn significantly more links and shares than un-attributed articles because journalists and influencers prefer citing verifiable expertise.'
        },
        {
          question: 'What kind of author information should live on each post?',
          answer: 'A short bio with credentials, relevant experience, and a headshot. For reviewed pieces, include the reviewer\'s name, license type or degree, and the date of review.'
        },
        {
          question: 'Do I really need structured data or schema?',
          answer: 'Yes. Article, Person, and Review schema make the author and reviewer immediately machine-readable, increasing eligibility for featured snippets, FAQ rich results, and AI citations. CertREV supplies the JSON-LD for expert reviewers so you can paste it in.'
        },
        {
          question: 'I\'m a small team—what\'s the quickest E-E-A-T win?',
          answer: 'Start with author bios, add CertREV reviews to your ten highest-traffic or highest-conversion pages, and implement FAQ Page schema on each.'
        },
        {
          question: 'How many posts actually need expert review?',
          answer: 'Prioritize the 20–40% of URLs that drive 80% of traffic or revenue. Layer more reviews as resources grow.'
        },
        {
          question: 'What is content freshness and how often should I update posts?',
          answer: 'Google rewards pages that stay current. Refresh statistics and links on top posts at least twice a year, or sooner if guidelines in your field change.'
        },
        {
          question: 'Does pruning or merging old posts help?',
          answer: 'Yes—consolidating thin or duplicate articles into a single, stronger resource concentrates authority and prevents keyword cannibalization.'
        },
        {
          question: 'What are "linkless mentions," and do they matter?',
          answer: 'Google increasingly tracks brand reputation signals even without a hyperlink. Expert-reviewed content is more likely to be referenced by name in forums, podcasts, and social posts—feeding those signals.'
        },
        {
          question: 'How does having outside experts give us an edge over author-only content?',
          answer: 'External reviewers provide third-party validation, reducing perceived bias and meeting Google\'s emphasis on independent expertise. This differentiation is hard for competitors to replicate without similar relationships.'
        }
      ]
    }
  ]

  const tabs = [
    { id: 'brand' as TabType, label: 'For Brands', icon: Building2, data: brandFAQs, color: 'coral' },
    { id: 'expert' as TabType, label: 'For Experts', icon: GraduationCap, data: expertFAQs, color: 'navy' },
    { id: 'general' as TabType, label: 'General', icon: BookOpen, data: generalFAQs, color: 'lime' }
  ]

  const activeTabData = tabs.find(tab => tab.id === activeTab)

  return (
    <div>
      {/* Hero Section */}
      <DepthHero
        backgroundLayers={[
          <div key="bg" className="absolute inset-0 bg-beige" />,
          <TextureOverlay key="texture" type="paper" opacity={0.3} />,
          <OrganicShape key="shape1" variant="blob1" color="coral" className="absolute top-1/4 right-1/4 w-96 h-96" opacity={0.08} />,
          <OrganicShape key="shape2" variant="blob3" color="navy" className="absolute bottom-1/4 left-1/4 w-80 h-80" opacity={0.06} />
        ]}
      >
        <div className="min-h-[50vh] flex items-center justify-center px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6 px-6 py-3 bg-white rounded-full border-2 border-lime/20 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-lime" />
                <span className="text-sm font-semibold text-navy tracking-wide">FREQUENTLY ASKED QUESTIONS</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight font-serif"
            >
              <span className="text-navy">Questions?</span>
              <br />
              <span className="text-coral">We've Got Answers</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-black/70 max-w-2xl mx-auto"
            >
              Everything you need to know about expert verification, pricing, and getting started
            </motion.p>
          </div>
        </div>
      </DepthHero>

      {/* Tab Navigation */}
      <section className="bg-white py-8 px-4 border-b-2 border-navy/10 sticky top-16 z-40">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 justify-center flex-wrap">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all
                    ${isActive
                      ? tab.color === 'coral'
                        ? 'bg-coral text-white shadow-md'
                        : tab.color === 'navy'
                        ? 'bg-navy text-white shadow-md'
                        : 'bg-lime text-navy shadow-md'
                      : 'bg-beige text-navy hover:bg-beige/80'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="bg-beige py-20 px-4 relative overflow-hidden">
        <TextureOverlay type="paper" opacity={0.2} />
        <OrganicShape variant="blob2" color="lime" className="absolute -top-20 -right-20 w-96 h-96" opacity={0.05} />

        <div className="max-w-4xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-navy font-serif">
                {activeTabData?.label} FAQ
              </h2>
              <p className="text-lg text-black/70">
                {activeTab === 'brand' && 'Answers for companies looking to verify their content'}
                {activeTab === 'expert' && 'Information for professionals joining our expert network'}
                {activeTab === 'general' && 'Understanding E-E-A-T, SEO, and content verification'}
              </p>
            </div>
          </FadeIn>

          <div className="space-y-12">
            {activeTabData?.data.map((section, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <Accordion items={section.items} category={section.category} />
              </FadeIn>
            ))}
          </div>

          {/* Still Have Questions CTA */}
          <FadeIn delay={0.4}>
            <div className="mt-16 bg-white rounded-3xl p-8 md:p-12 text-center border-2 border-coral/20 shadow-lg relative overflow-hidden">
              <TextureOverlay type="paper" opacity={0.2} />
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-4 text-navy font-serif">Still Have Questions?</h3>
                <p className="text-black/70 mb-6 text-lg max-w-2xl mx-auto">
                  Can't find what you're looking for? Our team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-coral text-white font-semibold rounded-full hover:bg-coral/90 transition-all shadow-md hover:shadow-lg"
                  >
                    Contact Us
                  </a>
                  <a
                    href="/book-demo"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-navy font-semibold rounded-full border-2 border-navy/20 hover:border-navy/30 transition-all"
                  >
                    Schedule Demo
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
