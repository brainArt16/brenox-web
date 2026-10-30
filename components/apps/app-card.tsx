import Link from "next/link"
import { ArrowUpRight, Boxes, Key, Webhook } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { App } from "@/lib/types"

interface AppCardProps {
  app: App
  keyCount?: number
  webhookCount?: number
}

export function AppCard({ app, keyCount, webhookCount }: AppCardProps) {
  return (
    <Link href={`/apps/${app.id}`} className="group block h-full">
      <article className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card p-5 shadow-[var(--card-shadow)] transition-all duration-200 hover:border-foreground/20 hover:bg-surface-elevated">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-elevated text-muted-foreground transition-colors group-hover:text-foreground">
            <Boxes className="h-5 w-5" />
          </div>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
        </div>

        <div className="mt-4 space-y-1">
          <h3 className="font-semibold text-foreground">{app.name}</h3>
          <p className="font-mono text-xs text-muted-foreground">{app.slug}</p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-border bg-surface text-xs">
            Live #{app.workspace_id}
          </Badge>
          {app.sandbox_workspace_id ? (
            <Badge variant="outline" className="border-warning/30 bg-warning/10 text-xs text-warning">
              Sandbox #{app.sandbox_workspace_id}
            </Badge>
          ) : null}
        </div>

        <div className="mt-auto flex items-center gap-4 border-t border-border/70 pt-4 mt-4 text-xs text-muted-foreground">
          {keyCount !== undefined && (
            <span className="inline-flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5" />
              {keyCount} keys
            </span>
          )}
          {webhookCount !== undefined && (
            <span className="inline-flex items-center gap-1.5">
              <Webhook className="h-3.5 w-3.5" />
              {webhookCount} hooks
            </span>
          )}
          <span className="ml-auto">
            {new Date(app.created_at).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </article>
    </Link>
  )
}
