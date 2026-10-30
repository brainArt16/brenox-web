"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Key, Webhook, FlaskConical, ExternalLink, Boxes } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/layout/page-header"
import { Panel } from "@/components/shared/panel"
import { StatCard } from "@/components/shared/stat-card"
import { QuickLinkTile } from "@/components/shared/quick-link-tile"
import { FlowSteps } from "@/components/shared/flow-steps"
import { CodeSnippet } from "@/components/shared/code-snippet"
import { CopyButton } from "@/components/shared/copy-button"
import { AllowedOriginsEditor } from "@/components/apps/allowed-origins-editor"
import { AppWorkspacesCard } from "@/components/apps/app-workspaces-card"
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
        <Skeleton className="h-16 w-72" />
        <div className="grid gap-4 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
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
      <PageHeader
        eyebrow="App"
        title={app.name}
        description={
          <span className="inline-flex items-center gap-2 font-mono text-sm">
            {app.slug}
            <CopyButton value={app.slug} />
          </span>
        }
        meta={
          <div className="flex flex-wrap gap-2">
            <Badge className="border-primary/40 bg-primary/15 text-foreground">Live</Badge>
            <Badge className="border-warning/30 bg-warning/15 text-warning">Sandbox</Badge>
          </div>
        }
        action={
          <Button variant="outline" asChild>
            <Link href={`/apps/${app.id}/keys`}>
              <Key className="mr-2 h-4 w-4" />
              API keys
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active keys" value={keyCount} icon={Key} />
        <StatCard label="Sandbox keys" value={sandboxCount} icon={FlaskConical} />
        <StatCard label="Webhooks" value={webhookCount} icon={Webhook} />
        <StatCard label="Live workspace" value={`#${app.workspace_id}`} icon={Boxes} />
      </div>

      <section className="space-y-4">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          Integration flow
        </h2>
        <FlowSteps
          steps={[
            {
              number: 1,
              title: "Create key",
              description: "Generate a sandbox bx_test_ key",
              href: `/apps/${app.id}/keys`,
              active: keyCount === 0,
            },
            {
              number: 2,
              title: "Test SDK",
              description: "Try BrenoxServer in sandbox",
              href: `/apps/${app.id}/sandbox`,
              active: keyCount > 0,
            },
            {
              number: 3,
              title: "Add webhook",
              description: "Receive realtime events",
              href: `/apps/${app.id}/webhooks`,
              active: false,
            },
            {
              number: 4,
              title: "Live workspace",
              description: "Production messages & channels",
              href: `/workspaces/${app.workspace_id}`,
              active: false,
            },
          ]}
        />
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickLinkTile
          href={`/apps/${app.id}/keys`}
          icon={Key}
          label="API Keys"
          description="Sandbox and live credentials"
        />
        <QuickLinkTile
          href={`/apps/${app.id}/webhooks`}
          icon={Webhook}
          label="Webhooks"
          description="Push events to your backend"
        />
        <QuickLinkTile
          href={`/apps/${app.id}/sandbox`}
          icon={FlaskConical}
          label="Sandbox"
          description="Safe playground for testing"
        />
        <QuickLinkTile
          href={`/workspaces/${app.workspace_id}`}
          icon={ExternalLink}
          label="Live workspace"
          description="Channels and realtime chat"
        />
      </div>

      <AllowedOriginsEditor app={app} onSaved={setApp} />

      <AppWorkspacesCard
        liveWorkspaceId={app.workspace_id}
        sandboxWorkspaceId={app.sandbox_workspace_id}
      />

      <Panel title="App details">
        <dl className="space-y-0 text-sm">
          <div className="flex items-center justify-between gap-4 border-b border-border py-3 first:pt-0">
            <dt className="text-muted-foreground">Slug</dt>
            <dd className="flex items-center gap-1 font-mono">
              {app.slug}
              <CopyButton value={app.slug} />
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 border-b border-border py-3">
            <dt className="text-muted-foreground">Live workspace</dt>
            <dd className="flex items-center gap-1 font-mono">
              {app.workspace_id}
              <CopyButton value={String(app.workspace_id)} />
            </dd>
          </div>
          {app.sandbox_workspace_id ? (
            <div className="flex items-center justify-between gap-4 border-b border-border py-3">
              <dt className="text-muted-foreground">Sandbox workspace</dt>
              <dd className="flex items-center gap-1 font-mono">
                {app.sandbox_workspace_id}
                <CopyButton value={String(app.sandbox_workspace_id)} />
              </dd>
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-4 pt-3">
            <dt className="text-muted-foreground">Created</dt>
            <dd>{new Date(app.created_at).toLocaleString()}</dd>
          </div>
        </dl>
      </Panel>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Getting started</h2>
        <CodeSnippet code={snippet} title="Server-side integration" />
      </section>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface-elevated/80 px-5 py-4">
        <Badge className="border-warning/30 bg-warning/15 text-warning">Sandbox</Badge>
        <Badge className="border-primary/40 bg-primary/15 text-foreground">Live</Badge>
        <span className="text-sm text-muted-foreground">
          Use sandbox keys for dev/CI — they only touch the sandbox workspace. Ship live keys in
          production.
        </span>
      </div>
    </div>
  )
}
