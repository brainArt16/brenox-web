import Link from "next/link"
import { ArrowUpRight, Boxes } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { App } from "@/lib/types"

interface AppCardProps {
  app: App
  keyCount?: number
  webhookCount?: number
}

export function AppCard({ app, keyCount, webhookCount }: AppCardProps) {
  return (
    <Link href={`/apps/${app.id}`} className="group block">
      <article className="relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/40 hover:bg-surface-elevated hover:shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground">
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
            ws #{app.workspace_id}
          </Badge>
          {keyCount !== undefined && (
            <Badge variant="outline" className="border-border bg-surface text-xs">
              {keyCount} keys
            </Badge>
          )}
          {webhookCount !== undefined && webhookCount > 0 && (
            <Badge variant="outline" className="border-border bg-surface text-xs">
              {webhookCount} hooks
            </Badge>
          )}
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Created {new Date(app.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
        </p>
      </article>
    </Link>
  )
}
