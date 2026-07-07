"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Key, Webhook, FlaskConical, ExternalLink, Boxes } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { StatCard } from "@/components/shared/stat-card"
import { FlowSteps } from "@/components/shared/flow-steps"
import { CodeSnippet } from "@/components/shared/code-snippet"
import { CopyButton } from "@/components/shared/copy-button"
import { AllowedOriginsEditor } from "@/components/apps/allowed-origins-editor"
import { getApp, getApiKeys, getWebhooks } from "@/lib/api"
import { getDocSnippets } from "@/lib/docs/content"
import type { App } from "@/lib/types"

export default function AppOverviewPage() {
  const params = useParams()
  const appId = Number(params.appId)
  const [app, setApp] = useState<App | null>(null)
  const [keyCount, setKeyCount] = useState(0)
  const [sandboxCount, setSandboxCount] = useState(0)
  const [webhookCount, setWebhookCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!appId) return
    Promise.all([getApp(appId), getApiKeys(appId), getWebhooks(appId)])
      .then(([appData, keys, webhooks]) => {
        setApp(appData)
        const active = keys.filter((k) => !k.revoked_at)
        setKeyCount(active.length)
        setSandboxCount(active.filter((k) => k.is_sandbox).length)
        setWebhookCount(webhooks.length)
      })
      .finally(() => setLoading(false))
  }, [appId])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-72" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!app) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">App not found.</p>
        <Button asChild className="mt-4">
          <Link href="/apps">Back to apps</Link>
        </Button>
      </div>
    )
  }

  const snippet = getDocSnippets().serverIntegration

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">App</p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{app.name}</h1>
        <p className="font-mono text-sm text-muted-foreground">{app.slug}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active keys" value={keyCount} icon={Key} />
        <StatCard label="Sandbox keys" value={sandboxCount} icon={FlaskConical} />
        <StatCard label="Webhooks" value={webhookCount} icon={Webhook} />
        <StatCard label="Workspace" value={`#${app.workspace_id}`} icon={Boxes} />
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Integration flow</h2>
        <FlowSteps
          steps={[
            { number: 1, title: "Create key", description: "Generate a sandbox bx_test_ key", href: `/apps/${app.id}/keys`, active: keyCount === 0 },
            { number: 2, title: "Test SDK", description: "Try BrenoxServer in sandbox", href: `/apps/${app.id}/sandbox`, active: keyCount > 0 },
            { number: 3, title: "Add webhook", description: "Receive realtime events", href: `/apps/${app.id}/webhooks`, active: false },
            { number: 4, title: "Open workspace", description: "See messages live", href: `/workspaces/${app.workspace_id}`, active: false },
          ]}
        />
      </section>

      <AllowedOriginsEditor app={app} onSaved={setApp} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Button variant="outline" className="h-auto flex-col gap-2 py-5" asChild>
          <Link href={`/apps/${app.id}/keys`}>
            <Key className="h-5 w-5" />
            <span>API Keys</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto flex-col gap-2 py-5" asChild>
          <Link href={`/apps/${app.id}/webhooks`}>
            <Webhook className="h-5 w-5" />
            <span>Webhooks</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto flex-col gap-2 py-5" asChild>
          <Link href={`/apps/${app.id}/sandbox`}>
            <FlaskConical className="h-5 w-5" />
            <span>Sandbox</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto flex-col gap-2 py-5" asChild>
          <Link href={`/workspaces/${app.workspace_id}`}>
            <ExternalLink className="h-5 w-5" />
            <span>Workspace</span>
          </Link>
        </Button>
      </div>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold">App details</h2>
        <dl className="mt-4 space-y-4 text-sm">
          <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
            <dt className="text-muted-foreground">Slug</dt>
            <dd className="flex items-center gap-1 font-mono">
              {app.slug}
              <CopyButton value={app.slug} />
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
            <dt className="text-muted-foreground">Workspace ID</dt>
            <dd className="flex items-center gap-1 font-mono">
              {app.workspace_id}
              <CopyButton value={String(app.workspace_id)} />
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">Created</dt>
            <dd>{new Date(app.created_at).toLocaleString()}</dd>
          </div>
        </dl>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">Getting started</h2>
        <CodeSnippet code={snippet} title="Server-side integration" />
      </section>

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-surface-elevated p-4">
        <Badge className="border-warning/30 bg-warning/20 text-warning">Sandbox</Badge>
        <Badge className="border-primary/50 bg-primary/30 text-foreground">Live</Badge>
        <span className="text-sm text-muted-foreground">
          Add allowed browser origins on the app overview before shipping a web client.
        </span>
      </div>
    </div>
  )
}
