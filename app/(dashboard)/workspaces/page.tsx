"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Boxes } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { WorkspaceCard } from "@/components/workspaces/workspace-card"
import { getWorkspaces, getApps } from "@/lib/api"
import type { WorkspaceListItem, App } from "@/lib/types"

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<WorkspaceListItem[]>([])
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getWorkspaces(), getApps()])
      .then(([ws, appList]) => {
        setWorkspaces(ws)
        setApps(appList)
      })
      .finally(() => setLoading(false))
  }, [])

  const metaByWorkspace = useMemo(() => {
    const map = new Map<number, { appName: string; variant: "live" | "sandbox" }>()
    for (const app of apps) {
      map.set(app.workspace_id, { appName: app.name, variant: "live" })
      if (app.sandbox_workspace_id) {
        map.set(app.sandbox_workspace_id, { appName: app.name, variant: "sandbox" })
      }
    }
    return map
  }, [apps])

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Realtime"
        title="Workspaces"
        description="Tenant containers for channels, members, and live messaging. Each app gets a live and sandbox workspace automatically."
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : workspaces.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title="No workspaces yet"
          description="Create an app to provision live and sandbox workspaces automatically."
          action={
            <Link href="/apps/new" className="text-sm font-medium text-foreground underline-offset-4 hover:underline">
              Create an app →
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((ws) => {
            const meta = metaByWorkspace.get(ws.id)
            return (
              <WorkspaceCard
                key={ws.id}
                workspace={ws}
                appName={meta?.appName}
                variant={meta?.variant ?? "standalone"}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
