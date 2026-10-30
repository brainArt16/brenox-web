import Link from "next/link"
import { ArrowUpRight, FlaskConical, Hash, Radio } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { WorkspaceListItem } from "@/lib/types"

interface WorkspaceCardProps {
  workspace: WorkspaceListItem
  appName?: string
  variant?: "live" | "sandbox" | "standalone"
}

export function WorkspaceCard({
  workspace,
  appName,
  variant = "standalone",
}: WorkspaceCardProps) {
  const isSandbox = variant === "sandbox"
  const Icon = isSandbox ? FlaskConical : Hash

  return (
    <Link href={`/workspaces/${workspace.id}`} className="group block h-full">
      <article
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-200",
          "hover:border-foreground/20 hover:bg-surface-elevated",
          isSandbox && "border-warning/20"
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent",
            isSandbox ? "via-warning/40" : "via-foreground/20"
          )}
        />

        <div className="flex items-start justify-between gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              isSandbox ? "bg-warning/15 text-warning" : "bg-surface-elevated text-muted-foreground"
            )}
          >
            <Icon className="h-5 w-5 transition-colors group-hover:text-foreground" />
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize border-border">
              {workspace.role}
            </Badge>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
          </div>
        </div>

        <h3 className="mt-4 font-semibold text-foreground">{workspace.name}</h3>
        <p className="mt-1 font-mono text-xs text-muted-foreground">{workspace.slug}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {variant === "live" && (
            <Badge className="border-primary/40 bg-primary/15 text-foreground">
              <Radio className="mr-1 h-3 w-3" />
              Live
            </Badge>
          )}
          {isSandbox && (
            <Badge className="border-warning/30 bg-warning/15 text-warning">Sandbox</Badge>
          )}
          {appName && (
            <Badge variant="outline" className="border-border bg-surface text-xs">
              {appName}
            </Badge>
          )}
        </div>

        <p className="mt-auto pt-4 text-xs text-muted-foreground">
          Joined{" "}
          {new Date(workspace.created_at).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </article>
    </Link>
  )
}
