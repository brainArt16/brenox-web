"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Globe, Radio, RefreshCw, Wifi, WifiOff } from "lucide-react"
import { DocSection } from "@/components/docs/doc-section"
import { DocsCallout } from "@/components/docs/docs-callout"
import { DocsCodeTabs } from "@/components/docs/docs-code-tabs"
import { CopyButton } from "@/components/shared/copy-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import {
  REALTIME_CONNECTION_STATES,
  REALTIME_EVENT_GROUPS,
  REALTIME_FLOW_STEPS,
  REALTIME_HANDLER_EXAMPLE,
  type RealtimeEventDef,
} from "@/lib/docs/content"

interface DocsRealtimeSectionProps {
  connectCode: string
  codeLanguage?: string
  usesHooks?: boolean
}

function FlowStrip() {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex min-w-max items-stretch gap-2 sm:min-w-0 sm:gap-0">
        {REALTIME_FLOW_STEPS.map((step, index) => (
          <div key={step.step} className="flex items-center">
            <div className="flex w-[140px] flex-col gap-2 sm:w-auto sm:min-w-[148px] sm:max-w-[180px]">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted-foreground text-xs font-bold text-background">
                  {step.step}
                </span>
                <p className="text-sm font-medium text-foreground">{step.title}</p>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground sm:pl-9">{step.description}</p>
            </div>
            {index < REALTIME_FLOW_STEPS.length - 1 && (
              <ArrowRight className="mx-2 hidden h-4 w-4 shrink-0 text-muted-foreground/50 sm:mx-3 sm:block" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ConnectionStates() {
  return (
    <div className="rounded-xl border border-border bg-surface-elevated p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-foreground">Connection lifecycle</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Exposed via <code className="font-mono">connectionState</code> in hooks or channel status
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-1">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-40" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="text-[11px] font-medium text-success">connected</span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {REALTIME_CONNECTION_STATES.map((state, index) => {
          const isActive = state.id === "connected"
          return (
            <div
              key={state.id}
              className={cn(
                "relative rounded-lg border px-3 py-2.5 transition-colors",
                isActive
                  ? "border-primary/40 bg-primary/5"
                  : "border-border bg-card",
              )}
            >
              {index < REALTIME_CONNECTION_STATES.length - 1 && (
                <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-3 w-3 -translate-y-1/2 text-muted-foreground/40 sm:block" />
              )}
              <p className="text-xs font-medium text-foreground">{state.label}</p>
              <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground">{state.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function EventRow({ event, active }: { event: RealtimeEventDef; active?: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const hasPayload = Boolean(event.payload)

  return (
    <button
      type="button"
      onClick={() => hasPayload && setExpanded((v) => !v)}
      className={cn(
        "group w-full rounded-lg border px-3 py-2.5 text-left transition-colors",
        active
          ? "border-primary/30 bg-primary/5"
          : "border-border bg-card hover:border-primary/20 hover:bg-surface-elevated",
        hasPayload && "cursor-pointer",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <code className="font-mono text-xs font-medium text-primary">{event.name}</code>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{event.description}</p>
        </div>
        {hasPayload && (
          <span className="shrink-0 rounded bg-surface px-1.5 py-0.5 text-[10px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
            {expanded ? "hide" : "payload"}
          </span>
        )}
      </div>
      {expanded && event.payload && (
        <pre className="mt-2 overflow-x-auto rounded-md bg-surface px-2 py-1.5 font-mono text-[10px] text-muted-foreground">
          {event.payload}
        </pre>
      )}
    </button>
  )
}

function EventCatalog() {
  const [activeEvent, setActiveEvent] = useState<string | null>(null)
  const defaultGroup = REALTIME_EVENT_GROUPS[0]?.id ?? "messaging"

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card overflow-hidden">
      <div className="border-b border-border px-4 py-3">
        <p className="text-sm font-medium text-foreground">Event catalog</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {REALTIME_EVENT_GROUPS.reduce((n, g) => n + g.events.length, 0)} events across{" "}
          {REALTIME_EVENT_GROUPS.length} domains
        </p>
      </div>

      <Tabs defaultValue={defaultGroup} className="flex min-h-0 flex-1 flex-col">
        <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-none border-b border-border bg-surface px-3 py-2">
          {REALTIME_EVENT_GROUPS.map((group) => {
            const Icon = group.icon
            return (
              <TabsTrigger
                key={group.id}
                value={group.id}
                className="shrink-0 gap-1.5 text-xs data-[state=active]:bg-card"
              >
                <Icon className="h-3.5 w-3.5" />
                {group.label}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {REALTIME_EVENT_GROUPS.map((group) => (
          <TabsContent
            key={group.id}
            value={group.id}
            className="mt-0 flex-1 overflow-y-auto p-4 data-[state=inactive]:hidden"
          >
            <p className="mb-3 text-xs leading-relaxed text-muted-foreground">{group.description}</p>
            <div className="space-y-2">
              {group.events.map((event) => (
                <div
                  key={event.name}
                  onMouseEnter={() => setActiveEvent(event.name)}
                  onMouseLeave={() => setActiveEvent(null)}
                >
                  <EventRow event={event} active={activeEvent === event.name} />
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function ArchitectureDiagram() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <Wifi className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="mt-3 text-sm font-medium">One socket per channel</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Join a workspace channel once; messaging, presence, and calls share the connection.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
          <Radio className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="mt-3 text-sm font-medium">Event-driven handlers</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Subscribe with <code className="font-mono">conn.on(event, handler)</code> — typed payloads per event.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10">
          <RefreshCw className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="mt-3 text-sm font-medium">Resilient by default</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Automatic reconnect with exponential backoff; handlers reattach after reconnect.
        </p>
      </div>
    </div>
  )
}

export function DocsRealtimeSection({
  connectCode,
  codeLanguage = "typescript",
  usesHooks = false,
}: DocsRealtimeSectionProps) {
  const codeTabs = [
    { id: "connect", label: usesHooks ? "Hooks" : "Connect", code: connectCode },
    { id: "handlers", label: "Handlers", code: REALTIME_HANDLER_EXAMPLE },
  ]

  return (
    <DocSection
      id="realtime"
      title="Realtime events"
      badge="WebSocket"
      description="Open a persistent channel connection, subscribe to typed events, and keep your UI in sync — without polling."
    >
      <FlowStrip />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Implementation</p>
            <DocsCodeTabs tabs={codeTabs} language={codeLanguage} />
          </div>
          <ConnectionStates />
        </div>

        <EventCatalog />
      </div>

      <ArchitectureDiagram />

      <DocsCallout icon={WifiOff} title="REST vs WebSocket" variant="tip">
        Use REST for history, search, and sends when offline. WebSocket delivers live updates —
        {usesHooks ? (
          <> <code className="font-mono text-xs">useMessages</code> combines both automatically.</>
        ) : (
          <> call <code className="font-mono text-xs">conn.connect()</code> after handlers are registered.</>
        )}
      </DocsCallout>

      <DocsCallout icon={Globe} title="Browser origins required" variant="info">
        WebSocket upgrades and browser REST calls are allowed only from origins on your app&apos;s
        allowlist. Add each frontend URL under{" "}
        <Link href="#browser-origins" className="font-medium text-primary hover:underline">
          Browser origins
        </Link>{" "}
        before testing from the browser.
      </DocsCallout>

      <div className="rounded-xl border border-dashed border-border bg-surface/50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-foreground">Quick reference</p>
            <p className="mt-0.5 text-xs text-muted-foreground">All event names in one block — copy for your handler map.</p>
          </div>
          <CopyButton
            value={REALTIME_EVENT_GROUPS.flatMap((g) => g.events.map((e) => e.name)).join("\n")}
            label="Events copied"
          />
        </div>
        <pre className="mt-3 max-h-32 overflow-y-auto rounded-lg bg-card p-3 font-mono text-[10px] leading-relaxed text-muted-foreground">
          {REALTIME_EVENT_GROUPS.map((group) => (
            <div key={group.id} className="mb-2 last:mb-0">
              <span className="text-foreground/70"># {group.label}</span>
              {"\n"}
              {group.events.map((e) => e.name).join("\n")}
            </div>
          ))}
        </pre>
      </div>
    </DocSection>
  )
}
