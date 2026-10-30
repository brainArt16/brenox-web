"use client"

import Link from "next/link"
import { m } from "framer-motion"
import {
  MessageSquare,
  Video,
  Code2,
  Shield,
  ArrowRight,
  Check,
  Terminal,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/brand/logo"
import { DeveloperCodePreview } from "@/components/landing/developer-code-preview"
import { PricingSection } from "@/components/landing/pricing-section"

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
}

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
        "Message lists, channels, threads, and call screens — themeable to match your product.",
    },
    {
      icon: MessageSquare,
      title: "Realtime messaging",
      description:
        "Media, reactions, threads, typing, and read receipts over a production WebSocket layer.",
    },
    {
      icon: Globe,
      title: "Cross-platform SDKs",
      description:
        "React, TypeScript, and more — one account, live + sandbox workspaces per app.",
    },
    {
      icon: Terminal,
      title: "Headless API",
      description:
        "Hooks and REST for fully custom UIs without giving up realtime infrastructure.",
    },
    {
      icon: Video,
      title: "Voice & video",
      description:
        "Signaling for calls with plan-based minutes and participant limits built in.",
    },
    {
      icon: Shield,
      title: "Secure by default",
      description:
        "JWT auth, role-based access, origin allowlists, and isolated sandbox data lanes.",
    },
  ]

  return (
    <section id="features" className="scroll-mt-20 border-t border-border bg-surface/40 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <m.div {...fadeUp} className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Ship chat without building the stack
          </h2>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            Use drop-in components for speed, or headless APIs when you need full control.
          </p>
        </m.div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <m.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.45,
                delay: index * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-[var(--card-shadow)] transition-colors hover:border-foreground/20"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-surface-elevated text-muted-foreground transition-colors group-hover:text-foreground">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function DeveloperSection() {
  return (
    <section className="py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <m.div {...fadeUp}>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Developer first
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              One component — or full control
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Drop in a complete chat surface, compose UI kit primitives, or drive a custom
              interface with the same realtime backend.
            </p>

            <ul className="mt-8 space-y-4">
              {[
                ["Drop-in components", "ChatWindow, ChannelList, Thread — themeable and ready"],
                ["Headless hooks", "useChannel, useMessages, usePresence for your own UI"],
                ["Live + sandbox", "bx_live_* and bx_test_* keys on the same API host"],
              ].map(([title, description]) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{title}</p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Button asChild className="mt-8">
              <Link href="/docs">
                Explore documentation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <DeveloperCodePreview />
          </m.div>
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="pb-24 sm:pb-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <m.div
          {...fadeUp}
          className="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-14 text-center shadow-[var(--card-shadow)] sm:px-12"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent_65%)]"
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/25 to-transparent" />
          <div className="relative">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Start building today
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-base text-muted-foreground">
              Free Starter includes apps, messages, and video minutes. Upgrade when you grow.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="min-w-[160px]">
                <Link href="/register">
                  Create account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="min-w-[160px]">
                <Link href="/#pricing">Compare plans</Link>
              </Button>
            </div>
          </div>
        </m.div>
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
      { name: "Get started", href: "/register" },
    ],
    Account: [
      { name: "Sign in", href: "/login" },
      { name: "Register", href: "/register" },
      { name: "Billing", href: "/settings/billing" },
    ],
  }

  return (
    <footer className="border-t border-border py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2 md:col-span-2">
            <Logo size="sm" className="mb-4" />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Realtime chat infrastructure — SDKs and UI kit for web and beyond.
            </p>
          </div>

          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold">{category}</h4>
              <ul className="mt-4 space-y-2.5">
                {items.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-8 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">© 2026 Brenox</p>
          <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground">
            Documentation
          </Link>
        </div>
      </div>
    </footer>
  )
}
