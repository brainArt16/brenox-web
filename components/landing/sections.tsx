"use client"

import Link from "next/link"
import { m } from "framer-motion"
import { 
  MessageSquare, 
  Video, 
  Users, 
  Code2, 
  Shield, 
  Zap,
  ArrowRight,
  Check,
  Terminal,
  Globe,
  Bell,
  Lock
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/15 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-20">
          <m.div 
            className="flex flex-col items-center text-center max-w-4xl mx-auto gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <m.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Zap className="w-4 h-4" />
              <span>Low-Code Chat Infrastructure for Developers</span>
            </m.div>
            
            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">
              Add Chat to Your App
              <span className="text-primary"> in Minutes, Not Months</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl text-muted-foreground max-w-2xl text-pretty">
              Integrate fully-working messaging, calls, and presence into your web, mobile, or desktop apps with our SDKs and pre-built UI Kit — or go headless and power your own custom UI.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button asChild size="lg" className="px-8 h-12 text-base">
                <Link href="/register">
                  Start Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 h-12 text-base">
                <Link href="/docs">
                  View Documentation
                </Link>
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                <span>Web, iOS, Android & Desktop SDKs</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                <span>Pre-built UI components</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                <span>Headless API for custom UIs</span>
              </div>
            </div>
          </m.div>
          
          {/* Dashboard Preview */}
          <m.div 
            className="mt-16 relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
          <div className="relative mx-auto max-w-5xl rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden shadow-2xl">
            {/* Window controls */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface/50">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-warning/60" />
              <div className="w-3 h-3 rounded-full bg-success/60" />
              <span className="ml-4 text-xs text-muted-foreground font-mono">your-app.com — powered by @brenox/react UI Kit</span>
            </div>
            
            {/* Mock Dashboard Content */}
            <div className="flex h-[400px]">
              {/* Workspace sidebar mock */}
              <div className="w-16 border-r border-border bg-sidebar flex flex-col items-center py-4 gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">P</div>
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground">
                  <Users className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground">
                  <MessageSquare className="w-5 h-5" />
                </div>
              </div>
              
              {/* Channel sidebar mock */}
              <div className="w-56 border-r border-border bg-surface p-4">
                <div className="text-sm font-semibold mb-4">Brenox Team</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-sidebar-accent text-sidebar-accent-foreground text-sm">
                    <span className="text-muted-foreground">#</span>
                    general
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground text-sm hover:bg-secondary/50 rounded-md">
                    <span>#</span>
                    engineering
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground text-sm hover:bg-secondary/50 rounded-md">
                    <span>#</span>
                    design
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground text-sm hover:bg-secondary/50 rounded-md">
                    <Video className="w-4 h-4" />
                    voice-chat
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-6 mb-2">DIRECT MESSAGES</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 px-2 py-1.5 text-sm">
                    <div className="w-6 h-6 rounded-full bg-primary/30" />
                    <span>Sarah Chen</span>
                    <div className="w-2 h-2 rounded-full bg-online ml-auto" />
                  </div>
                </div>
              </div>
              
              {/* Chat area mock */}
              <div className="flex-1 flex flex-col">
                <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                  <span className="text-muted-foreground">#</span>
                  <span className="font-medium">general</span>
                </div>
                <div className="flex-1 p-4 space-y-4 overflow-hidden">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/30 flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">Alex Kim</span>
                        <span className="text-xs text-muted-foreground">Today at 2:34 PM</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Just shipped the new WebSocket integration. Latency is down to 12ms average!</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/30 flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">Sarah Chen</span>
                        <span className="text-xs text-muted-foreground">Today at 2:36 PM</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Amazing work! The typing indicators are so smooth now.</p>
                    </div>
                  </div>
                  {/* Typing indicator */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-typing-dot" />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-typing-dot" />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-typing-dot" />
                    </div>
                    <span>Marcus is typing...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating stats cards */}
          <m.div 
            className="absolute -left-4 top-1/3 bg-card border border-border rounded-lg p-3 shadow-xl hidden lg:block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="text-xs text-muted-foreground">Active Users</div>
            <div className="text-2xl font-bold text-primary">2.4K</div>
            <div className="text-xs text-success">+12% today</div>
          </m.div>
          
          <m.div 
            className="absolute -right-4 top-1/2 bg-card border border-border rounded-lg p-3 shadow-xl hidden lg:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="text-xs text-muted-foreground">Messages/sec</div>
            <div className="text-2xl font-bold text-accent">847</div>
            <div className="flex gap-1 mt-1">
              {[4, 7, 3, 8, 5, 9, 6].map((h, i) => (
                <div key={i} className="w-1 bg-accent/60 rounded-full" style={{ height: h * 3 }} />
              ))}
            </div>
          </m.div>
        </m.div>
      </div>
    </section>
  )
}

export function FeaturesSection() {
  const features = [
    {
      icon: Code2,
      title: "Pre-built UI Kit",
      description: "Drop-in chat components and full templates — message lists, channel lists, threads, call screens. Themeable to match your brand."
    },
    {
      icon: MessageSquare,
      title: "Realtime Messaging",
      description: "Fully-working messaging out of the box: rich media, reactions, threads, typing indicators, and read receipts."
    },
    {
      icon: Globe,
      title: "Cross-Platform SDKs",
      description: "One platform, every surface. SDKs for React, JavaScript, iOS, Android, Flutter, and Electron desktop apps."
    },
    {
      icon: Terminal,
      title: "Headless Mode",
      description: "Bring your own UI. Use our realtime APIs and state hooks to power completely custom chat interfaces."
    },
    {
      icon: Video,
      title: "Video & Voice Calls",
      description: "Embed crystal-clear audio and HD video calling with screen sharing using a single component."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "End-to-end encryption, SOC 2 compliance, SSO, moderation tools, and role-based access control."
    }
  ]

  return (
    <section id="features" className="py-24 bg-surface scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to ship chat, fast</h2>
          <p className="text-muted-foreground text-lg">
            Use pre-built components for instant integration, or build fully custom experiences on our APIs. Your app, your UI, our infrastructure.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <m.div
              key={feature.title}
              className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SyntaxHighlight({ text }: { text: string }) {
  const keywords = ['import', 'from', 'export', 'function', 'const', 'await', 'return', 'process', 'env']
  const stringRegex = /('.*?'|".*?")/g
  const commentRegex = /(\/\/.+)/g
  
  const parts: Array<{ type: string; value: string }> = []
  let lastIndex = 0

  // Find comments first
  let commentMatch
  const commentRegex2 = /\/\/.+/g
  while ((commentMatch = commentRegex2.exec(text)) !== null) {
    if (commentMatch.index > lastIndex) {
      parts.push({ type: 'text', value: text.substring(lastIndex, commentMatch.index) })
    }
    parts.push({ type: 'comment', value: commentMatch[0] })
    lastIndex = commentMatch.index + commentMatch[0].length
  }
  if (lastIndex < text.length) {
    parts.push({ type: 'text', value: text.substring(lastIndex) })
  }

  return (
    <>
      {parts.map((part, idx) => {
        if (part.type === 'comment') {
          return (
            <span key={idx} className="text-muted-foreground/70">
              {part.value}
            </span>
          )
        }
        return (
          <span key={idx}>
            {part.value.split(/\b/).map((word, i) => {
              if (keywords.includes(word)) {
                return (
                  <span key={i} className="text-primary">
                    {word}
                  </span>
                )
              }
              if (word.match(/^['"].*['"]$/)) {
                return (
                  <span key={i} className="text-success">
                    {word}
                  </span>
                )
              }
              return <span key={i}>{word}</span>
            })}
          </span>
        )
      })}
    </>
  )
}

export function DeveloperSection() {
  const codeLines = [
    "import { BrenoxProvider, ChatWindow } from '@brenox/react'",
    "",
    "// Full chat in your app with one component",
    "export function App() {",
    "  return (",
    "    <BrenoxProvider apiKey={process.env.BRENOX_API_KEY}>",
    "      <ChatWindow",
    "        channelId=\"support\"",
    "        theme=\"brand\"",
    "        features={{ threads: true, reactions: true }}",
    "      />",
    "    </BrenoxProvider>",
    "  )",
    "}",
    "",
    "// Or go headless with hooks for custom UIs",
    "import { useChannel, useMessages } from '@brenox/react'",
    "",
    "function CustomChat() {",
    "  const channel = useChannel('support')",
    "  const { messages, send } = useMessages(channel)",
    "  // Render your own UI...",
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              One component or full control — your choice
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              Drop in a complete chat experience with a single component, compose your layout from our UI Kit primitives, or go fully headless with hooks and APIs.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-success" />
                </div>
                <div>
                  <div className="font-medium">Drop-in Components</div>
                  <div className="text-sm text-muted-foreground">ChatWindow, ChannelList, Thread, CallScreen — themeable and production-ready</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-success" />
                </div>
                <div>
                  <div className="font-medium">Headless Hooks & APIs</div>
                  <div className="text-sm text-muted-foreground">useChannel, useMessages, usePresence — realtime state for your own custom UI</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-success" />
                </div>
                <div>
                  <div className="font-medium">Every Platform</div>
                  <div className="text-sm text-muted-foreground">Type-safe SDKs for web, iOS, Android, Flutter, and desktop with automatic reconnection</div>
                </div>
              </div>
            </div>
            
            <Button asChild>
              <Link href="/docs">
                Explore Documentation
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
          
          <div className="relative">
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
                      <SyntaxHighlight text={line} />
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for side projects and prototypes",
      features: [
        "10,000 messages/month",
        "100 concurrent connections",
        "Community support",
        "Basic analytics",
        "7-day message history"
      ],
      cta: "Start Free",
      href: "/register",
      highlighted: false
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
        "Video calls"
      ],
      cta: "Start Pro Trial",
      href: "/register?plan=pro",
      highlighted: true
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
        "Dedicated infrastructure"
      ],
      cta: "Contact Sales",
      href: "/register",
      highlighted: false
    }
  ]

  return (
    <section id="pricing" className="py-24 bg-surface scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-muted-foreground text-lg">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border p-6 ${
                plan.highlighted 
                  ? 'border-primary bg-card shadow-lg shadow-primary/10' 
                  : 'border-border bg-card'
              }`}
            >
              {plan.highlighted && (
                <div className="text-xs font-medium text-primary mb-4">MOST POPULAR</div>
              )}
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="mt-2 mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
              </div>
              <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
              
              <Button 
                asChild 
                className="w-full mb-6"
                variant={plan.highlighted ? "default" : "outline"}
              >
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

export function CTASection() {
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

export function Footer() {
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
                    <Link 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            2026 Brenox. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="https://github.com" className="text-muted-foreground hover:text-foreground transition-colors">
              <span className="sr-only">GitHub</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link href="https://twitter.com" className="text-muted-foreground hover:text-foreground transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
