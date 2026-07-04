"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  ExternalLink,
  Info,
  Layers,
  Lightbulb,
  Package,
} from "lucide-react"
import { DocSection } from "@/components/docs/doc-section"
import { DocsCallout } from "@/components/docs/docs-callout"
import { DocsCapabilityGrid } from "@/components/docs/docs-capability-grid"
import { DocsCodeTabs } from "@/components/docs/docs-code-tabs"
import { DocsHero } from "@/components/docs/docs-hero"
import { DocsQuickNav } from "@/components/docs/docs-quick-nav"
import { DocsToc } from "@/components/docs/docs-toc"
import { CodeSnippet } from "@/components/shared/code-snippet"
import { FlowSteps } from "@/components/shared/flow-steps"
import {
  BEST_PRACTICES,
  CONSOLE_STEPS,
  getDocSnippets,
  REACT_HOOKS,
  SDK_PACKAGES,
  WEBHOOK_EVENTS,
  WEBSOCKET_EVENTS,
} from "@/lib/docs/content"
import { getApps } from "@/lib/api"

export default function DocsPage() {
  const [firstAppId, setFirstAppId] = useState<string | null>(null)
  const snippets = useMemo(() => getDocSnippets(), [])

  useEffect(() => {
    void getApps().then((apps) => {
      if (apps[0]) setFirstAppId(String(apps[0].id))
    })
  }, [])

  const sandboxHref = firstAppId ? `/apps/${firstAppId}/sandbox` : "/apps"
  const keysHref = firstAppId ? `/apps/${firstAppId}/keys` : "/apps"
  const webhooksHref = firstAppId ? `/apps/${firstAppId}/webhooks` : "/apps"

  const consoleSteps = CONSOLE_STEPS.map((step) => ({
    ...step,
    href:
      step.number === 2
        ? keysHref
        : step.number === 3
          ? sandboxHref
          : step.href,
    active: step.number === 1,
  }))

  return (
    <div className="min-h-full">
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <DocsHero sandboxHref={sandboxHref} />
        <DocsQuickNav />

        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-10">
          <div className="min-w-0 flex-1 space-y-16">
            {/* Overview */}
            <DocSection
              id="overview"
              title="What you can build"
              description="Brenox SDKs cover messaging through voice and video. Integrate through @brenox/sdk — the platform handles infrastructure behind the scenes."
            >
              <DocsCapabilityGrid />
              <DocsCallout icon={Layers} title="SDK-first integration" variant="tip">
                Use <code className="font-mono text-xs">BrenoxClient</code> in your frontend,{" "}
                <code className="font-mono text-xs">BrenoxServer</code> on your backend, and this
                console to manage apps, keys, and webhooks. No raw HTTP integration required.
              </DocsCallout>
            </DocSection>

            {/* Quick start */}
            <DocSection
              id="quickstart"
              title="Quick start"
              badge="~5 min"
              description="Install the SDK, configure credentials from this console, and send your first message."
            >
              <DocsCodeTabs
                tabs={[
                  { id: "install", label: "Install", code: snippets.install },
                  { id: "env", label: "Environment", code: snippets.env },
                  { id: "code", label: "First message", code: snippets.quickStart },
                ]}
              />
              <DocsCallout icon={Lightbulb} title="Where to get credentials" variant="info">
                Create an app under{" "}
                <Link href="/apps/new" className="font-medium text-primary hover:underline">
                  Apps → New app
                </Link>
                , then generate a sandbox key at{" "}
                <Link href={keysHref} className="font-medium text-primary hover:underline">
                  API Keys
                </Link>
                . Copy the secret once — it powers BrenoxServer on your backend.
              </DocsCallout>
            </DocSection>

            {/* Console */}
            <DocSection
              id="console"
              title="Console setup"
              description="Four steps from zero to a working integration."
            >
              <FlowSteps steps={consoleSteps} />
            </DocSection>

            {/* Auth */}
            <DocSection
              id="auth"
              title="Authentication"
              description="Two credential types — pick the right one for each layer of your app."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="font-mono text-xs text-primary">BrenoxClient</p>
                  <p className="mt-2 text-sm font-medium text-foreground">User sessions</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    End users sign in via the SDK. Tokens persist with{" "}
                    <code className="font-mono text-xs">localStorageTokenStore()</code> and refresh
                    automatically.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="font-mono text-xs text-primary">BrenoxServer</p>
                  <p className="mt-2 text-sm font-medium text-foreground">Server API keys</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Keys from App → API Keys. Pass via{" "}
                    <code className="font-mono text-xs">BRENOX_API_KEY</code>. Sandbox keys start
                    with <code className="font-mono text-xs">bx_test_</code>.
                  </p>
                </div>
              </div>
            </DocSection>

            {/* Messaging */}
            <DocSection
              id="messaging"
              title="Messaging"
              badge="BrenoxClient"
              description="REST for history, WebSocket for live delivery. Includes typing, presence, notifications, and file attachments."
            >
              <DocsCodeTabs
                tabs={[
                  { id: "messages", label: "Send & list", code: snippets.messaging },
                  { id: "files", label: "Attachments", code: snippets.attachments },
                ]}
              />
            </DocSection>

            {/* Realtime */}
            <DocSection
              id="realtime"
              title="Realtime events"
              badge="WebSocket"
              description="Subscribe via client.channel() or useMessages. Events include sequence numbers for gap detection and automatic backfill on reconnect."
            >
              <CodeSnippet code={snippets.realtime} title="Channel connection" />
              <div className="grid gap-4 sm:grid-cols-2">
                {Object.entries(WEBSOCKET_EVENTS).map(([group, events]) => (
                  <div key={group} className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {group}
                    </p>
                    <ul className="mt-3 space-y-1.5">
                      {events.map((event) => (
                        <li
                          key={event}
                          className="rounded-md bg-surface px-2.5 py-1 font-mono text-[11px] text-foreground"
                        >
                          {event}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </DocSection>

            {/* Calls */}
            <DocSection
              id="calls"
              title="Voice & video calls"
              badge="CallSignaling"
              description="Full call lifecycle and WebRTC signaling. You wire RTCPeerConnection, media tracks, and STUN/TURN."
            >
              <CodeSnippet code={snippets.calls} title="Initiate a video call" />
              <CodeSnippet code={snippets.callsNote} title="SDK vs your code" language="guide" />
              <DocsCallout icon={Info} title="Signaling, not media" variant="warning">
                The SDK exchanges SDP offers/answers and ICE candidates. Audio and video flow
                peer-to-peer via WebRTC — configure your own STUN/TURN servers for production.
              </DocsCallout>
            </DocSection>

            {/* Server */}
            <DocSection
              id="server"
              title="BrenoxServer"
              badge="@brenox/sdk/server"
              description="Backend automation — map your auth users, provision accounts, and send messages from trusted servers."
            >
              <CodeSnippet code={snippets.server} title="Provision & send" />
              <Link
                href={sandboxHref}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                Try in sandbox
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </DocSection>

            {/* React */}
            <DocSection
              id="react"
              title="React hooks"
              badge="@brenox/react"
              description="Drop-in hooks for messages, notifications, and call signaling — wraps BrenoxClient with auto-connect and cleanup."
            >
              <CodeSnippet code={snippets.react} title="BrenoxProvider + useMessages" />
              <div className="grid gap-3 sm:grid-cols-2">
                {REACT_HOOKS.map((hook) => (
                  <div
                    key={hook.name}
                    className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/20"
                  >
                    <p className="font-mono text-sm font-medium text-primary">{hook.name}</p>
                    <p className="mt-1.5 text-sm text-muted-foreground">{hook.description}</p>
                    <code className="mt-3 block overflow-x-auto rounded-md bg-surface px-2 py-1.5 font-mono text-[10px] text-muted-foreground">
                      {hook.snippet}
                    </code>
                  </div>
                ))}
              </div>
            </DocSection>

            {/* Webhooks */}
            <DocSection
              id="webhooks"
              title="Webhooks"
              description="Receive HTTPS callbacks on your server when key events occur."
            >
              <div className="grid gap-3 sm:grid-cols-3">
                {WEBHOOK_EVENTS.map((event) => (
                  <div key={event.name} className="rounded-xl border border-border bg-card p-4">
                    <p className="font-mono text-xs text-foreground">{event.name}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Register under{" "}
                <Link href={webhooksHref} className="font-medium text-primary hover:underline">
                  App → Webhooks
                </Link>
                . Each endpoint gets a signing secret once at creation.
              </p>
              <CodeSnippet code={snippets.webhookVerify} title="Verify signatures (Node.js)" />
            </DocSection>

            {/* Best practices */}
            <DocSection
              id="best-practices"
              title="Best practices"
              description="Follow these patterns for a secure, smooth integration."
            >
              <div className="grid gap-4 sm:grid-cols-3">
                {BEST_PRACTICES.map((item) => (
                  <div key={item.title} className="rounded-xl border border-border bg-card p-4">
                    <item.icon className="h-5 w-5 text-primary" />
                    <p className="mt-3 text-sm font-medium text-foreground">{item.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">SDK packages</p>
                {SDK_PACKAGES.map((pkg) => (
                  <div
                    key={pkg.name}
                    className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 shrink-0 text-primary" />
                        <p className="font-mono text-sm font-medium text-foreground">{pkg.name}</p>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{pkg.use}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {pkg.features.map((f) => (
                          <span
                            key={f}
                            className="rounded bg-surface px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                    <code className="shrink-0 rounded-lg bg-surface px-3 py-2 font-mono text-[11px] text-muted-foreground">
                      {pkg.install}
                    </code>
                  </div>
                ))}
              </div>
            </DocSection>
          </div>

          <aside className="hidden w-56 shrink-0 lg:block">
            <div className="sticky top-8">
              <DocsToc />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
