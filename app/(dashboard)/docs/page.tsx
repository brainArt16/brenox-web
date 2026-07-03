"use client"

import { useEffect, useMemo, useState, type ComponentType } from "react"
import Link from "next/link"
import {
  BookOpen,
  Code2,
  ExternalLink,
  Key,
  Layers,
  Package,
  Shield,
  Webhook,
  Zap,
} from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { DocLinkCard } from "@/components/shared/doc-link-card"
import { CodeSnippet } from "@/components/shared/code-snippet"
import { DocSection } from "@/components/docs/doc-section"
import { DocsToc } from "@/components/docs/docs-toc"
import {
  getDocSnippets,
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

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Resources"
        title="SDK documentation"
        description="Build chat and realtime features into your product using @brenox/sdk — no direct platform API integration required."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DocLinkCard
          title="Quick start"
          description="Install the SDK and send your first message."
          href="#setup"
          icon={Zap}
        />
        <DocLinkCard
          title="Developer guide"
          description="Full SDK guide (Markdown)."
          href="https://github.com/brainArt16/brenox-sdk/blob/main/docs/DEVELOPER_GUIDE.md"
          icon={BookOpen}
          external
        />
        <DocLinkCard
          title="JavaScript SDK"
          description="@brenox/sdk on GitHub."
          href="https://github.com/brainArt16/brenox-sdk"
          icon={Code2}
          external
        />
        <DocLinkCard
          title="React hooks"
          description="@brenox/react — useMessages, useNotifications, and more."
          href="#sdk-react"
          icon={Code2}
        />
        <DocLinkCard
          title="Webhooks"
          description="Receive events in your backend."
          href="#webhooks"
          icon={Webhook}
        />
        <DocLinkCard
          title="Sandbox"
          description="Try BrenoxServer operations before going live."
          href={sandboxHref}
          icon={ExternalLink}
        />
      </div>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 space-y-12">
          <DocSection
            id="overview"
            title="How Brenox works for developers"
            description="You register an app in this console, install our SDKs in your product, and Brenox handles chat infrastructure behind the scenes."
          >
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface text-left">
                    <th className="px-4 py-3 font-medium text-foreground">You build</th>
                    <th className="px-4 py-3 font-medium text-foreground">With</th>
                    <th className="px-4 py-3 font-medium text-foreground">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-3 font-medium">Your frontend</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">BrenoxClient</td>
                    <td className="px-4 py-3 text-muted-foreground">User login, chat UI, realtime messages</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Your backend</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">BrenoxServer</td>
                    <td className="px-4 py-3 text-muted-foreground">Provision users, send messages, server workflows</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">This console</td>
                    <td className="px-4 py-3 text-muted-foreground">Dashboard</td>
                    <td className="px-4 py-3 text-muted-foreground">Create apps, API keys, webhooks, test sandbox</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <TipCard
              icon={Layers}
              title="Use the SDKs, not raw HTTP"
              body="Integrate exclusively through @brenox/sdk and @brenox/react. Create API keys here and pass them to BrenoxServer on your server — never in client code."
            />
          </DocSection>

          <DocSection
            id="setup"
            title="Setup"
            description="Install packages in your app and configure credentials from this console."
          >
            <CodeSnippet code={snippets.sdkInstall} title="Install" />
            <CodeSnippet code={snippets.envExample} title="Environment variables (your app)" />
          </DocSection>

          <DocSection
            id="console"
            title="Console workflow"
            description="From app creation to your first SDK call."
          >
            <ol className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <li className="flex gap-3">
                <Step n={1} />
                <span><strong className="text-foreground">Register / login</strong> — access this developer console.</span>
              </li>
              <li className="flex gap-3">
                <Step n={2} />
                <span><strong className="text-foreground">Apps → New app</strong> — provisions an isolated workspace for your integration.</span>
              </li>
              <li className="flex gap-3">
                <Step n={3} />
                <span><strong className="text-foreground">API Keys</strong> — create a sandbox key for BrenoxServer; copy the secret once.</span>
              </li>
              <li className="flex gap-3">
                <Step n={4} />
                <span><strong className="text-foreground">Sandbox</strong> — dry-run server SDK operations before wiring your backend.</span>
              </li>
              <li className="flex gap-3">
                <Step n={5} />
                <span><strong className="text-foreground">Webhooks</strong> — register your HTTPS endpoint for platform events.</span>
              </li>
              <li className="flex gap-3">
                <Step n={6} />
                <span><strong className="text-foreground">Integrate</strong> — add <code className="font-mono text-xs">@brenox/sdk</code> to your frontend and backend.</span>
              </li>
            </ol>
            <Link
              href="/apps"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              Open apps
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </DocSection>

          <DocSection
            id="auth"
            title="Authentication"
            description="Two credential types — one for your users, one for your server."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <AuthCard
                icon={Shield}
                title="User sessions (BrenoxClient)"
                detail="Your end users sign in through the SDK. Tokens are stored and refreshed automatically — use localStorageTokenStore() in browsers."
              />
              <AuthCard
                icon={Key}
                title="Server keys (BrenoxServer)"
                detail="API keys from App → API Keys. Pass to BrenoxServer via BRENOX_API_KEY. Sandbox keys start with bx_test_. Never expose keys in frontend code."
              />
            </div>
            <CodeSnippet code={snippets.clientQuickStart} title="User login + first message" />
          </DocSection>

          <DocSection
            id="sdk-client"
            title="BrenoxClient"
            description="User-facing chat — workspaces, channels, messages, presence, and realtime."
          >
            <CodeSnippet code={snippets.clientQuickStart} title="Workspaces, channels, messages" />
            <CodeSnippet code={snippets.clientRealtime} title="Realtime channel (WebSocket)" />
          </DocSection>

          <DocSection
            id="sdk-server"
            title="BrenoxServer"
            description="Server-side integration — map your users, send messages, and manage channels from your backend."
          >
            <CodeSnippet code={snippets.serverIntegration} title="Provision users and send messages" />
          </DocSection>

          <DocSection
            id="sdk-react"
            title="React hooks (@brenox/react)"
            description="Wrap BrenoxClient with hooks for live messages, notifications, and call signaling."
          >
            <CodeSnippet code={snippets.reactSetup} title="BrenoxProvider + useMessages" />
            <p className="text-sm text-muted-foreground">
              See{" "}
              <a
                href="https://github.com/brainArt16/brenox-sdk/blob/main/react/README.md"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                react/README.md
              </a>{" "}
              for <code className="font-mono text-xs">useChannel</code>,{" "}
              <code className="font-mono text-xs">useNotifications</code>, and{" "}
              <code className="font-mono text-xs">useCallSignaling</code>.
            </p>
          </DocSection>

          <DocSection
            id="webhooks"
            title="Webhooks"
            description="Your backend receives HTTPS callbacks when key events occur in your app."
          >
            <ul className="grid gap-2 sm:grid-cols-3">
              {WEBHOOK_EVENTS.map((event) => (
                <li
                  key={event}
                  className="rounded-lg border border-border bg-surface px-3 py-2 font-mono text-xs text-foreground"
                >
                  {event}
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground">
              Register endpoints under{" "}
              <Link href="/apps" className="font-medium text-primary hover:underline">
                App → Webhooks
              </Link>
              . Each endpoint receives a signing secret once at creation.
            </p>
            <CodeSnippet code={snippets.webhookVerify} title="Verify signatures" />
          </DocSection>

          <DocSection
            id="realtime"
            title="Realtime events"
            description="Subscribe via client.channel() or useMessages. Every event includes a sequence number for gap detection and automatic backfill on reconnect."
          >
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {WEBSOCKET_EVENTS.map((event) => (
                <li
                  key={event}
                  className="rounded-lg border border-border bg-surface px-3 py-2 font-mono text-xs text-foreground"
                >
                  {event}
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground">
              Listen with <code className="font-mono text-xs">conn.on(&quot;message.new&quot;, handler)</code> or the{" "}
              <code className="font-mono text-xs">useMessages</code> hook.
            </p>
          </DocSection>

          <DocSection
            id="packages"
            title="SDK packages"
            description="Everything you need is published on npm — pick the package that matches your stack."
          >
            <div className="space-y-4">
              {SDK_PACKAGES.map((pkg) => (
                <div key={pkg.name} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <p className="font-mono text-sm font-medium text-foreground">{pkg.name}</p>
                    <span className="text-xs text-muted-foreground">→ {pkg.export}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{pkg.use}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {pkg.features.map((f) => (
                      <span
                        key={f}
                        className="rounded-md bg-surface px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </DocSection>
        </div>

        <aside className="hidden shrink-0 lg:block lg:w-52">
          <div className="sticky top-6">
            <DocsToc />
          </div>
        </aside>
      </div>
    </div>
  )
}

function Step({ n }: { n: number }) {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
      {n}
    </span>
  )
}

function TipCard({
  icon: Icon,
  title,
  body,
}: {
  icon: ComponentType<{ className?: string }>
  title: string
  body: string
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-border bg-surface p-4">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
      </div>
    </div>
  )
}

function AuthCard({
  icon: Icon,
  title,
  detail,
}: {
  icon: ComponentType<{ className?: string }>
  title: string
  detail: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <p className="text-sm font-medium text-foreground">{title}</p>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
    </div>
  )
}
