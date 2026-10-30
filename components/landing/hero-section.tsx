"use client"

import Link from "next/link"
import { m } from "framer-motion"
import { ArrowRight, MessageSquare, Users, Video } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden pt-16">
      {/* Atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,255,255,0.08),transparent_55%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,255,255,0.09),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.45]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--border) 70%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--border) 70%, transparent) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 70% 55% at 50% 20%, black, transparent)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] max-w-6xl flex-col px-4 pb-0 pt-16 sm:px-6 lg:px-8 lg:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <m.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl"
          >
            Brenox
          </m.p>

          <m.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl"
          >
            Realtime chat infrastructure for your product
          </m.h1>

          <m.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Messaging, presence, and video calls via SDKs and a UI kit — or go headless on the same API.
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button asChild size="lg" className="h-11 min-w-[160px] px-6">
              <Link href="/register">
                Start free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-11 min-w-[160px] px-6">
              <Link href="/docs">Read the docs</Link>
            </Button>
          </m.div>
        </div>

        {/* Full-bleed product plane */}
        <m.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-14 flex-1 sm:mt-16"
        >
          <div className="pointer-events-none absolute inset-x-0 -top-10 h-24 bg-gradient-to-b from-background to-transparent" />
          <HeroProductVisual />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </m.div>
      </div>
    </section>
  )
}

function HeroProductVisual() {
  return (
    <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-t-2xl border border-b-0 border-border bg-card shadow-[0_-20px_80px_-20px_rgba(0,0,0,0.45)]">
      <div className="flex items-center gap-2 border-b border-border bg-surface/80 px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-[11px] text-muted-foreground">app.yoursite.com</span>
      </div>

      <div className="flex h-[min(52vh,420px)] min-h-[280px]">
        {/* Rail */}
        <aside className="hidden w-14 shrink-0 flex-col items-center gap-3 border-r border-border bg-sidebar py-4 sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-sm font-semibold text-background">
            B
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
            <Users className="h-4 w-4" />
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
          </div>
        </aside>

        {/* Channels */}
        <aside className="hidden w-48 shrink-0 flex-col border-r border-border bg-surface p-3 md:flex lg:w-56">
          <p className="mb-3 px-2 text-xs font-semibold text-foreground">Product team</p>
          <div className="space-y-0.5 text-sm">
            <ChannelRow active name="general" />
            <ChannelRow name="engineering" />
            <ChannelRow name="design" />
            <ChannelRow name="voice" icon />
          </div>
          <p className="mb-2 mt-6 px-2 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Direct
          </p>
          <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm">
            <span className="relative h-6 w-6 rounded-full bg-foreground/15">
              <span className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-online ring-2 ring-surface" />
            </span>
            Sarah Chen
          </div>
        </aside>

        {/* Messages */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <span className="text-muted-foreground">#</span>
            <span className="text-sm font-medium">general</span>
          </div>
          <div className="flex-1 space-y-5 overflow-hidden p-4">
            <Message
              name="Alex Kim"
              time="2:34 PM"
              body="Shipped the WebSocket path — p95 latency is 12ms."
              delay={0}
            />
            <Message
              name="Sarah Chen"
              time="2:36 PM"
              body="Typing indicators feel instant now. Nice."
              delay={0.15}
            />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-typing-dot" />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-typing-dot" />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-typing-dot" />
              </span>
              Marcus is typing…
            </div>
          </div>
          <div className="border-t border-border px-4 py-3">
            <div className="rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-muted-foreground">
              Message #general
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ChannelRow({
  name,
  active,
  icon,
}: {
  name: string
  active?: boolean
  icon?: boolean
}) {
  return (
    <div
      className={
        active
          ? "flex items-center gap-2 rounded-md bg-sidebar-accent px-2 py-1.5 text-sidebar-accent-foreground"
          : "flex items-center gap-2 rounded-md px-2 py-1.5 text-muted-foreground"
      }
    >
      {icon ? <Video className="h-3.5 w-3.5" /> : <span className="text-muted-foreground">#</span>}
      {name}
    </div>
  )
}

function Message({
  name,
  time,
  body,
  delay,
}: {
  name: string
  time: string
  body: string
  delay: number
}) {
  return (
    <m.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.55 + delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex gap-3"
    >
      <div className="h-8 w-8 shrink-0 rounded-full bg-foreground/10" />
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-sm font-medium">{name}</span>
          <span className="text-[11px] text-muted-foreground">Today at {time}</span>
        </div>
        <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
      </div>
    </m.div>
  )
}
