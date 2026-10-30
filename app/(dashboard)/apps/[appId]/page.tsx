"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  Boxes,
  ExternalLink,
  FlaskConical,
  Key,
  Webhook,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Panel } from "@/components/shared/panel"
import { FlowSteps } from "@/components/shared/flow-steps"
import { CodeSnippet } from "@/components/shared/code-snippet"
import { CopyButton } from "@/components/shared/copy-button"
import { AllowedOriginsEditor } from "@/components/apps/allowed-origins-editor"
import { AppWorkspacesCard } from "@/components/apps/app-workspaces-card"
import { AppMetricCard } from "@/components/apps/app-metric-card"
import { AppNavCard } from "@/components/apps/app-nav-card"
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
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-36 w-full rounded-2xl" />
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
  const hasKeys = keyCount > 0
  const hasWebhooks = webhookCount > 0
  const createdLabel = new Date(app.created_at).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--card-shadow)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.06),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.07),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/25 to-transparent" />

        <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                App
              </p>
              <Badge className="border-foreground/20 bg-foreground/10 text-foreground">Live</Badge>
              <Badge className="border-warning/30 bg-warning/15 text-warning">Sandbox</Badge>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {app.name}
              </h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 font-mono">
                  {app.slug}
                  <CopyButton value={app.slug} />
                </span>
                <span className="text-border">·</span>
                <span>Created {createdLabel}</span>
                <span className="text-border">·</span>
                <span className="font-mono text-xs">#{app.id}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href={`/apps/${app.id}/keys`}>
                <Key className="mr-2 h-4 w-4" />
                {hasKeys ? "Manage keys" : "Create key"}
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/apps/${app.id}/sandbox`}>
                <FlaskConical className="mr-2 h-4 w-4" />
                Sandbox
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/workspaces/${app.workspace_id}`}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Live workspace
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <AppMetricCard
          label="Active keys"
          value={keyCount}
          hint={hasKeys ? "Ready to integrate" : "Create your first key"}
          icon={Key}
          href={`/apps/${app.id}/keys`}
        />
        <AppMetricCard
          label="Sandbox keys"
          value={sandboxCount}
          hint="bx_test_* only"
          icon={FlaskConical}
          href={`/apps/${app.id}/keys`}
          tone="sandbox"
        />
        <AppMetricCard
          label="Webhooks"
          value={webhookCount}
          hint={hasWebhooks ? "Endpoints configured" : "Optional next step"}
          icon={Webhook}
          href={`/apps/${app.id}/webhooks`}
        />
        <AppMetricCard
          label="Live workspace"
          value={`#${app.workspace_id}`}
          hint="Production lane"
          icon={Boxes}
          href={`/workspaces/${app.workspace_id}`}
          tone="live"
        />
      </div>

      {/* Setup flow */}
      <Panel
        title="Setup checklist"
        description="Work through these once — then ship with live keys."
      >
        <FlowSteps
          steps={[
            {
              number: 1,
              title: "Create key",
              description: "Generate a sandbox bx_test_ key",
              href: `/apps/${app.id}/keys`,
              done: hasKeys,
              active: !hasKeys,
            },
            {
              number: 2,
              title: "Test SDK",
              description: "Try BrenoxServer in sandbox",
              href: `/apps/${app.id}/sandbox`,
              done: false,
              active: hasKeys && !hasWebhooks,
            },
            {
              number: 3,
              title: "Add webhook",
              description: "Receive realtime events",
              href: `/apps/${app.id}/webhooks`,
              done: hasWebhooks,
              active: hasKeys && !hasWebhooks,
            },
            {
              number: 4,
              title: "Live workspace",
              description: "Production messages & channels",
              href: `/workspaces/${app.workspace_id}`,
              done: false,
              active: hasKeys && hasWebhooks,
            },
          ]}
        />
      </Panel>

      {/* Navigation cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <AppNavCard
          href={`/apps/${app.id}/keys`}
          icon={Key}
          label="API Keys"
          description="Sandbox and live credentials for SDK and /v1"
          meta={`${keyCount} active`}
        />
        <AppNavCard
          href={`/apps/${app.id}/webhooks`}
          icon={Webhook}
          label="Webhooks"
          description="Push message and presence events to your backend"
          meta={`${webhookCount} configured`}
        />
        <AppNavCard
          href={`/apps/${app.id}/sandbox`}
          icon={FlaskConical}
          label="Sandbox"
          description="Safe playground for keys, CI, and demos"
          meta="Test lane"
          tone="sandbox"
        />
        <AppNavCard
          href={`/workspaces/${app.workspace_id}`}
          icon={ExternalLink}
          label="Live workspace"
          description="Channels, members, and realtime chat"
          meta={`#${app.workspace_id}`}
          tone="live"
        />
      </div>

      <AllowedOriginsEditor app={app} onSaved={setApp} />

      <AppWorkspacesCard
        liveWorkspaceId={app.workspace_id}
        sandboxWorkspaceId={app.sandbox_workspace_id}
      />

      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Getting started</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Drop this into your server to provision users and open sessions.
          </p>
        </div>
        <CodeSnippet code={snippet} title="Server-side integration" />
      </section>
    </div>
  )
}
