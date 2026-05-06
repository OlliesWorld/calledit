import { Lock, CreditCard, Database, Palette, Code2, FileText, Rocket, Zap, Hammer, Sparkles, UserCheck } from 'lucide-react'
import type { FeatureConfig, AITool, BenefitCardProps, TechStackCardProps } from '@/components/marketing/landing/types'
import { createElement } from 'react'

// Helper to create icon elements
const icon = (Icon: typeof Lock, className = 'w-6 h-6') => createElement(Icon, { className })
const iconSm = (Icon: typeof Lock, className = 'w-5 h-5 text-white') => createElement(Icon, { className })

export const defaultFeatures: FeatureConfig = {
  auth: {
    icon: icon(Lock),
    label: 'Authentication',
    details: {
      title: 'Authentication',
      items: [
        'Complete auth system with Clerk',
        'Email/password with verification',
        'OAuth ready (Google, GitHub, more)',
        'Protected routes with middleware',
        'Session management built-in',
      ],
      timeSaved: '12+ hours',
      headaches: '0',
    },
  },
  payments: {
    icon: icon(CreditCard),
    label: 'Payments',
    details: {
      title: 'Payments',
      items: [
        'Stripe integration pre-configured',
        'Subscription management ready',
        'Webhook handlers included',
        'Pricing tiers setup',
        'Secure checkout flow',
      ],
      timeSaved: '8+ hours',
      headaches: '0',
      providers: ['Stripe'],
    },
  },
  database: {
    icon: icon(Database),
    label: 'Database',
    details: {
      title: 'Database',
      items: [
        'Supabase PostgreSQL setup',
        'TypeScript types auto-generated',
        'Row Level Security (RLS) configured',
        'File storage for uploads',
        'Real-time capabilities ready',
      ],
      timeSaved: '6+ hours',
      headaches: '0',
      providers: ['Supabase'],
    },
  },
  components: {
    icon: icon(Palette),
    label: 'UI & Styling',
    details: {
      title: 'UI & Styling',
      items: [
        'shadcn/ui components pre-installed',
        'Tailwind CSS 4 configured',
        'Responsive design system',
        'Accessible components (Radix UI)',
        'Custom color scheme ready',
      ],
      timeSaved: '10+ hours',
      headaches: '0',
    },
  },
  typescript: {
    icon: icon(Code2),
    label: 'TypeScript',
    details: {
      title: 'TypeScript',
      items: [
        'Full type safety throughout',
        'Path aliases configured (@/ imports)',
        'Strict mode enabled',
        'Auto-generated database types',
        'Form validation with Zod',
      ],
      timeSaved: '4+ hours',
      headaches: '0',
    },
  },
  seo: {
    icon: icon(FileText),
    label: 'SEO',
    details: {
      title: 'SEO Ready',
      items: [
        'Metadata API setup',
        'OpenGraph tags configured',
        'Sitemap generation ready',
        'Semantic HTML structure',
        'Performance optimized',
      ],
      timeSaved: '3+ hours',
      headaches: '0',
    },
  },
  deploy: {
    icon: icon(Rocket),
    label: 'Deploy Ready',
    details: {
      title: 'Deployment',
      items: [
        'Vercel-optimized configuration',
        'Environment variables documented',
        'Production build tested',
        'Edge runtime ready',
        'One-command deployment',
      ],
      timeSaved: '5+ hours',
      headaches: '0',
      providers: ['Vercel', 'Netlify'],
    },
  },
}

export const defaultTechStack: Omit<TechStackCardProps, 'className'>[] = [
  {
    icon: iconSm(Zap),
    title: 'Next.js 16',
    subtitle: 'App Router',
    color: 'bg-black',
    position: 'top',
    delay: 'delay-500',
  },
  {
    icon: iconSm(Code2),
    title: 'TypeScript',
    subtitle: 'Type safe',
    color: 'bg-blue-600',
    position: 'top-right',
    delay: 'delay-600',
  },
  {
    icon: iconSm(UserCheck),
    title: 'Clerk',
    subtitle: 'Auth ready',
    color: 'bg-violet-600',
    position: 'right',
    delay: 'delay-700',
  },
  {
    icon: iconSm(Database),
    title: 'Supabase',
    subtitle: 'Database',
    color: 'bg-emerald-500',
    position: 'bottom-right',
    delay: 'delay-800',
  },
  {
    icon: iconSm(CreditCard),
    title: 'Stripe',
    subtitle: 'Payments ready',
    color: 'bg-purple-600',
    position: 'bottom',
    delay: 'delay-900',
  },
  {
    icon: iconSm(Palette),
    title: 'Tailwind CSS',
    subtitle: 'Styling',
    color: 'bg-sky-400',
    position: 'bottom-left',
    delay: 'delay-1000',
  },
  {
    icon: iconSm(Hammer),
    title: 'shadcn/ui',
    subtitle: 'UI components',
    color: 'bg-stone-800',
    position: 'left',
    delay: 'delay-1100',
  },
  {
    icon: iconSm(Rocket),
    title: 'Deploy Ready',
    subtitle: 'Vercel optimized',
    color: 'bg-indigo-600',
    position: 'top-left',
    delay: 'delay-1200',
  },
]

export const defaultAITools: AITool[] = [
  { name: 'GitHub Copilot', description: 'AI pair programmer' },
  { name: 'Claude Code', description: 'Terminal agent' },
  { name: 'Windsurf', description: 'AI-powered IDE' },
  { name: 'Antigravity', description: 'Coding Agent' },
  { name: 'Codex', description: 'Coding Agent' },
  { name: 'Any AI Tool', description: 'Works with all', isSpecial: true },
]

export const defaultAIBenefits: Omit<BenefitCardProps, 'className'>[] = [
  {
    icon: icon(FileText, 'w-6 h-6 text-[#E07A5F]'),
    title: 'Clear Context',
    description: "Organized file structure helps AI understand your project's architecture instantly.",
  },
  {
    icon: icon(Code2, 'w-6 h-6 text-[#E07A5F]'),
    title: 'Type Safety',
    description: 'Full TypeScript implementation guides AI to write bug-free, accurate code.',
  },
  {
    icon: icon(Sparkles, 'w-6 h-6 text-[#E07A5F]'),
    title: 'Modern Patterns',
    description: 'Built with the latest standards that AI models are trained to recognize and replicate.',
  },
]

export const defaultPricingFeatures = [
  'Unlimited Commercial Projects',
  'Complete Next.js 16 + Clerk Auth Starter',
  'Stripe Payments & Webhooks',
  'Unified AI API Integration',
  'Lifetime Updates & Support',
]

export const defaultProblemSolutionBenefits = [
  'Ship client projects 2x faster',
  'Save 40+ hours of dev time per project',
  'Professional, scalable architecture',
]

export const defaultTestimonialQuotes = [
  "I used to spend the first week of every project just setting up Auth, Payments, and Database. That's hours of dev time lost to boilerplate.",
  "Now I skip straight to the custom features. I can take on twice as many projects because the foundation is already done.",
]

export const defaultAIApiBenefits = [
  'Type-safe responses across all providers',
  'Built-in rate limiting and error handling',
  'Stream responses with zero config',
  'Easy model switching via config',
]

export const defaultAIProviders = ['OpenAI', 'Anthropic', 'Google']
