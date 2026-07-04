import Link from "next/link"
import {
  MessageSquare,
  Video,
  Code2,
  Shield,
  Zap,
  ArrowRight,
  Check,
  Terminal,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function LandingBelowFold() {
  return (
    <>
      <FeaturesSection />
      <DeveloperSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </>
  )
}

function FeaturesSection() {
  const features = [
    {
      icon: Code2,
      title: "Pre-built UI Kit",
      description:
        "Drop-in chat components and full templates — message lists, channel lists, threads, call screens. Themeable to match your brand.",
    },
    {
      icon: MessageSquare,
      title: "Realtime Messaging",
      description:
        "Fully-working messaging out of the box: rich media, reactions, threads, typing indicators, and read receipts.",
    },
    {
      icon: Globe,
      title: "Cross-Platform SDKs",
      description:
        "One platform, every surface. SDKs for React, JavaScript, iOS, Android, Flutter, and Electron desktop apps.",
    },
    {
      icon: Terminal,
      title: "Headless Mode",
      description:
        "Bring your own UI. Use our realtime APIs and state hooks to power completely custom chat interfaces.",
    },
    {
      icon: Video,
      title: "Video & Voice Calls",
      description:
        "Embed crystal-clear audio and HD video calling with screen sharing using a single component.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description:
        "End-to-end encryption, SOC 2 compliance, SSO, moderation tools, and role-based access control.",
    },
  ]

  return (
    <section id="features" className="py-24 bg-surface scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to ship chat, fast</h2>
          <p className="text-muted-foreground text-lg">
            Use pre-built components for instant integration, or build fully custom experiences on our SDKs. Your app, your UI, our infrastructure.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function DeveloperSection() {
  const codeLines = [
    "import { BrenoxProvider, ChatWindow } from '@brenox/react'",
    "",
    "// Full chat in your app with one component",
    "export function App() {",
    "  return (",
    "    <BrenoxProvider apiKey={process.env.BRENOX_API_KEY}>",
    "      <ChatWindow channelId=\"support\" />",
    "    </BrenoxProvider>",
    "  )",
    "}",
  ]

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
              <Terminal className="w-4 h-4" />
              Developer First
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">One component or full control — your choice</h2>
            <p className="text-muted-foreground text-lg mb-6">
              Drop in a complete chat experience with a single component, compose your layout from our UI Kit primitives, or go fully headless with hooks and SDKs.
            </p>

            <div className="space-y-4 mb-8">
              {[
                ["Drop-in Components", "ChatWindow, ChannelList, Thread, CallScreen — themeable and production-ready"],
                ["Headless Hooks", "useChannel, useMessages, usePresence — realtime state for your own custom UI"],
                ["Every Platform", "Type-safe SDKs for web, iOS, Android, Flutter, and desktop"],
              ].map(([title, description]) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <div className="font-medium">{title}</div>
                    <div className="text-sm text-muted-foreground">{description}</div>
                  </div>
                </div>
              ))}
            </div>

            <Button asChild>
              <Link href="/docs">
                Explore Documentation
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-warning/60" />
              <div className="w-3 h-3 rounded-full bg-success/60" />
              <span className="ml-4 text-xs text-muted-foreground font-mono">App.tsx</span>
            </div>
            <pre className="p-4 text-sm overflow-x-auto">
              <code className="text-muted-foreground font-mono">
                {codeLines.map((line, i) => (
                  <div key={i} className="leading-relaxed">
                    <span className="text-muted-foreground/50 select-none w-8 inline-block">{i + 1}</span>
                    {line}
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}

function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for side projects and prototypes",
      features: ["10,000 messages/month", "100 concurrent connections", "Community support", "Basic analytics", "7-day message history"],
      cta: "Start Free",
      href: "/register",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$49",
      period: "/month",
      description: "For growing teams and production apps",
      features: [
        "500,000 messages/month",
        "5,000 concurrent connections",
        "Priority support",
        "Advanced analytics",
        "90-day message history",
        "Custom webhooks",
        "Video calls",
      ],
      cta: "Start Pro Trial",
      href: "/register?plan=pro",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations with custom needs",
      features: [
        "Unlimited messages",
        "Unlimited connections",
        "Dedicated support",
        "Custom analytics",
        "Unlimited history",
        "SLA guarantee",
        "SSO & SAML",
        "Dedicated infrastructure",
      ],
      cta: "Contact Sales",
      href: "/register",
      highlighted: false,
    },
  ]

  return (
    <section id="pricing" className="py-24 bg-surface scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-muted-foreground text-lg">Start free, scale as you grow. No hidden fees, no surprises.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border p-6 ${
                plan.highlighted ? "border-primary bg-card shadow-lg shadow-primary/10" : "border-border bg-card"
              }`}
            >
              {plan.highlighted && <div className="text-xs font-medium text-primary mb-4">MOST POPULAR</div>}
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="mt-2 mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
              </div>
              <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

              <Button asChild className="w-full mb-6" variant={plan.highlighted ? "default" : "outline"}>
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-success" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="relative rounded-2xl bg-gradient-to-br from-primary/20 via-background to-accent/20 border border-border p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to build something amazing?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Join thousands of developers building realtime experiences with Brenox. Get started in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8">
                <Link href="/register">
                  Start Building Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8">
                <Link href="/register">Create an Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const links = {
    Product: [
      { name: "Features", href: "/#features" },
      { name: "Pricing", href: "/#pricing" },
      { name: "Developer Console", href: "/apps" },
    ],
    Developers: [
      { name: "Documentation", href: "/docs" },
      { name: "TypeScript SDK", href: "/docs?sdk=typescript" },
      { name: "React SDK", href: "/docs?sdk=react" },
      { name: "Get Started", href: "/register" },
    ],
    Account: [
      { name: "Sign in", href: "/login" },
      { name: "Register", href: "/register" },
      { name: "Workspaces", href: "/workspaces" },
    ],
  }

  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">Brenox</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Low-code chat infrastructure. SDKs and UI Kit for web, mobile, and desktop apps.
            </p>
          </div>

          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {items.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">2026 Brenox. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
