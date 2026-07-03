"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BookOpen, Code2, Terminal, Webhook, Zap, ExternalLink } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { DocLinkCard } from "@/components/shared/doc-link-card"
import { CodeSnippet } from "@/components/shared/code-snippet"
import { getApps } from "@/lib/api"

const baseUrl = process.env.NEXT_PUBLIC_BRENOX_URL ?? "http://localhost:8080"

export default function DocsPage() {
  const [appSlug, setAppSlug] = useState("my-chat-app")

  useEffect(() => {
    void getApps().then((apps) => {
      if (apps[0]) setAppSlug(apps[0].slug)
    })
  }, [])

  const quickStart = `import { BrenoxClient } from "@brenox/sdk";

const client = new BrenoxClient({
  baseUrl: "${baseUrl}",
});

await client.auth.login({ email: "you@example.com", password: "secret" });
const apps = await client.apps.list();`

  const serverSnippet = `import { BrenoxServer } from "@brenox/sdk/server";

const server = new BrenoxServer({
  baseUrl: "${baseUrl}",
  apiKey: process.env.BRENOX_API_KEY!,
});

await server.users.provision({ external_id: "user-1" });
await server.messages.send({
  channel_id: 1,
  external_id: "user-1",
  content: "Hello",
});`

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Resources"
        title="Documentation"
        description="Integrate Brenox into your product with the SDK, REST API, and WebSocket events."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DocLinkCard
          title="Quick start"
          description="Register, authenticate, and create your first app in minutes."
          href="#quickstart"
          icon={Zap}
        />
        <DocLinkCard
          title="JavaScript SDK"
          description="@brenox/sdk — client, server, and React hooks."
          href="https://github.com/brainArt16/brenox-sdk"
          icon={Code2}
          external
        />
        <DocLinkCard
          title="Public API"
          description="OpenAPI spec for /v1 server-side integrations."
          href={`${baseUrl}/docs/openapi.yaml`}
          icon={Terminal}
          external
        />
        <DocLinkCard
          title="WebSocket events"
          description="message.new, presence, typing, calls — full event catalog."
          href="#websocket"
          icon={Webhook}
        />
        <DocLinkCard
          title="Your app"
          description={`Manage keys and webhooks for ${appSlug}.`}
          href="/apps"
          icon={BookOpen}
        />
        <DocLinkCard
          title="Sandbox playground"
          description="Test provision, channels, and messages without Postman."
          href="/apps/1/sandbox"
          icon={ExternalLink}
        />
      </div>

      <section id="quickstart" className="scroll-mt-6 space-y-4">
        <h2 className="text-lg font-semibold">Quick start</h2>
        <CodeSnippet code={quickStart} title="Browser / Node client" />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Server-side integration</h2>
        <CodeSnippet code={serverSnippet} title="BrenoxServer + /v1 API" />
      </section>

      <section id="websocket" className="scroll-mt-6 rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">WebSocket events</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Connect with <code className="font-mono text-xs">client.channel(workspaceId, channelId)</code> and
          listen for typed events. Every envelope includes <code className="font-mono text-xs">sequence</code> for
          gap detection and automatic REST backfill on reconnect.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {["message.new", "message.updated", "typing.start", "typing.stop", "presence.online", "presence.offline", "notification.new", "call.offer"].map((e) => (
            <li key={e} className="rounded-lg border border-border bg-surface px-3 py-2 font-mono text-xs text-foreground">
              {e}
            </li>
          ))}
        </ul>
        <ButtonLink />
      </section>
    </div>
  )
}

function ButtonLink() {
  return (
    <Link
      href="/apps"
      className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
    >
      Open developer console
      <ExternalLink className="h-3.5 w-3.5" />
    </Link>
  )
}
