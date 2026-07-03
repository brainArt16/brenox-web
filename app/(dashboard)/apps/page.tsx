"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, LayoutGrid, Key, Webhook, FlaskConical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { OnboardingChecklist } from "@/components/shared/onboarding-checklist"
import { StatCard } from "@/components/shared/stat-card"
import { AppCard } from "@/components/apps/app-card"
import { getApps, getApiKeys, getWebhooks } from "@/lib/api"
import type { App } from "@/lib/types"

export default function AppsPage() {
  const [apps, setApps] = useState<App[]>([])
  const [meta, setMeta] = useState<Record<number, { keys: number; webhooks: number }>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const list = await getApps()
      setApps(list)
      const m: Record<number, { keys: number; webhooks: number }> = {}
      await Promise.all(
        list.map(async (app) => {
          const [keys, wh] = await Promise.all([getApiKeys(app.id), getWebhooks(app.id)])
          m[app.id] = {
            keys: keys.filter((k) => !k.revoked_at).length,
            webhooks: wh.length,
          }
        })
      )
      setMeta(m)
      setIsLoading(false)
    }
    void load()
  }, [])

  const firstApp = apps[0]
  const hasKeys = firstApp ? (meta[firstApp.id]?.keys ?? 0) > 0 : false
  const hasWebhooks = firstApp ? (meta[firstApp.id]?.webhooks ?? 0) > 0 : false

  const onboardingSteps = [
    { id: "app", label: "Create your first app", href: "/apps/new", done: apps.length > 0 },
    {
      id: "key",
      label: "Generate a sandbox API key",
      href: firstApp ? `/apps/${firstApp.id}/keys` : undefined,
      done: hasKeys,
    },
    {
      id: "sandbox",
      label: "Send a test message in sandbox",
      href: firstApp ? `/apps/${firstApp.id}/sandbox` : undefined,
      done: false,
    },
    {
      id: "webhook",
      label: "Configure a webhook",
      href: firstApp ? `/apps/${firstApp.id}/webhooks` : undefined,
      done: hasWebhooks,
    },
  ]

  const totalKeys = Object.values(meta).reduce((s, m) => s + m.keys, 0)
  const totalHooks = Object.values(meta).reduce((s, m) => s + m.webhooks, 0)

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Developer Console"
        title="Apps"
        description="Each app is an isolated tenant with its own workspace, API keys, and webhooks."
        action={
          <Button asChild>
            <Link href="/apps/new">
              <Plus className="mr-2 h-4 w-4" />
              New app
            </Link>
          </Button>
        }
      />

      {!isLoading && apps.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Apps" value={apps.length} icon={LayoutGrid} />
            <StatCard label="Active keys" value={totalKeys} icon={Key} />
            <StatCard label="Webhooks" value={totalHooks} icon={Webhook} />
            <StatCard label="Sandboxes" value={apps.length} hint="One per app" icon={FlaskConical} />
          </div>
          <OnboardingChecklist steps={onboardingSteps} />
        </>
      )}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : apps.length === 0 ? (
        <EmptyState
          icon={LayoutGrid}
          title="Create your first app"
          description="Apps provision a dedicated workspace and unlock API keys, webhooks, and the sandbox playground."
          action={
            <Button asChild size="lg">
              <Link href="/apps/new">
                <Plus className="mr-2 h-4 w-4" />
                Create app
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {apps.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              keyCount={meta[app.id]?.keys}
              webhookCount={meta[app.id]?.webhooks}
            />
          ))}
        </div>
      )}
    </div>
  )
}
