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
import { DeveloperCodePreview } from "@/components/landing/developer-code-preview"

export function LandingBelowFold() {
  return (
    <>
      {/* <TrustedBySection /> */}
      <FeaturesSection />
      <DeveloperSection />
      {/* <TestimonialsSection /> */}
      <PricingSection />
      <CTASection />
      <Footer />
    </>
  )
}

function TrustedBySection() {
  const companies = [
    "NovaStack",
    "RelayHQ",
    "Shipwright",
    "Threadline",
    "Pulsekit",
    "Cloudforge",
  ]

  return (
    <section className="py-16 border-y border-border bg-surface/50">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm font-medium uppercase tracking-widest text-muted-foreground mb-10">
          Trusted by teams building realtime products
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
          {companies.map((company) => (
            <div
              key={company}
              className="flex h-12 items-center justify-center rounded-lg border border-border/60 bg-card/40 px-4 text-sm font-semibold tracking-wide text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
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
                <feature.icon className="w-6 h-6 text-muted-foreground" />
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

          <DeveloperCodePreview />
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "We replaced three months of in-house WebSocket work with Brenox in a weekend. Messaging, presence, and calls just worked.",
      name: "Sarah Chen",
      role: "CTO",
      company: "RelayHQ",
    },
    {
      quote:
        "The React UI Kit got us to production fast, but the headless SDK let us customize the experience without fighting the platform.",
      name: "Marcus Okonkwo",
      role: "Lead Engineer",
      company: "Shipwright",
    },
    {
      quote:
        "Pricing is straightforward, support is responsive, and our team finally ships chat features instead of maintaining infrastructure.",
      name: "Elena Vasquez",
      role: "Product Manager",
      company: "Threadline",
    },
  ]

  return (
    <section id="testimonials" className="py-24 bg-surface scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by builders shipping fast</h2>
          <p className="text-muted-foreground text-lg">
            Teams use Brenox to launch chat, calls, and presence without rebuilding realtime infrastructure from scratch.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="flex flex-col rounded-xl border border-border bg-card p-6"
            >
              <blockquote className="flex-1 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 pt-6 border-t border-border">
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">
                  {testimonial.role}, {testimonial.company}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "$10",
      period: "/month",
      description: "For early-stage apps getting realtime chat live",
      features: [
        "50,000 messages/month",
        "500 concurrent connections",
        "Email support",
        "Basic analytics",
        "30-day message history",
      ],
      cta: "Get Starter",
      href: "/register?plan=starter",
      highlighted: false,
    },
    {
      name: "Growth",
      price: "$25",
      period: "/month",
      description: "For production apps with growing user bases",
      features: [
        "250,000 messages/month",
        "2,500 concurrent connections",
        "Priority support",
        "Advanced analytics",
        "90-day message history",
        "Custom webhooks",
        "Video calls",
      ],
      cta: "Get Growth",
      href: "/register?plan=growth",
      highlighted: true,
    },
    {
      name: "Scale",
      price: "$50",
      period: "/month",
      description: "For teams that need higher limits and reliability",
      features: [
        "1,000,000 messages/month",
        "10,000 concurrent connections",
        "Priority support",
        "Advanced analytics",
        "1-year message history",
        "Custom webhooks",
        "Video calls",
        "Moderation tools",
      ],
      cta: "Get Scale",
      href: "/register?plan=scale",
      highlighted: false,
    },
  ]

  return (
    <section id="pricing" className="py-24 scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-muted-foreground text-lg">
            Pick the plan that fits your stage. All plans include SDK access, UI Kit, and realtime infrastructure.
          </p>
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
              Join teams building realtime experiences with Brenox. Plans start at $10/month.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8">
                <Link href="/#pricing">
                  View Plans
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
