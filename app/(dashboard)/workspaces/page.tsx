"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Boxes, Hash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
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

  function appForWorkspace(wsId: number) {
    return apps.find((a) => a.workspace_id === wsId)
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Realtime"
        title="Workspaces"
        description="Isolated environments for channels, members, and live messaging. App-linked workspaces are created automatically."
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      ) : workspaces.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title="No workspaces yet"
          description="Create an app to provision a dedicated workspace automatically."
          action={
            <Link href="/apps/new" className="text-sm font-medium text-primary hover:underline">
              Create an app →
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((ws) => {
            const linkedApp = appForWorkspace(ws.id)
            return (
              <Link key={ws.id} href={`/workspaces/${ws.id}`} className="group block">
                <article className="h-full rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:bg-surface-elevated">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-elevated">
                      <Hash className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                    </div>
                    <Badge variant="outline" className="capitalize border-border">
                      {ws.role}
                    </Badge>
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{ws.name}</h3>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{ws.slug}</p>
                  {linkedApp && (
                    <Badge className="mt-3 border-primary/50 bg-primary/30 text-foreground">
                      App: {linkedApp.slug}
                    </Badge>
                  )}
                  <p className="mt-4 text-xs text-muted-foreground">
                    Joined {new Date(ws.created_at).toLocaleDateString()}
                  </p>
                </article>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
