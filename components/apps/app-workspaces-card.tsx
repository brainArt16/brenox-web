import Link from "next/link"
import { ArrowUpRight, FlaskConical, Radio } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Panel } from "@/components/shared/panel"
import { CopyButton } from "@/components/shared/copy-button"
import { cn } from "@/lib/utils"

interface AppWorkspacesCardProps {
  liveWorkspaceId: number
  sandboxWorkspaceId?: number
  workspaceLinkPrefix?: string
}

function Lane({
  href,
  label,
  subtitle,
  workspaceId,
  tone,
}: {
  href: string
  label: string
  subtitle: string
  workspaceId: number
  tone: "live" | "sandbox"
}) {
  const isSandbox = tone === "sandbox"
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col gap-3 rounded-xl border p-4 transition-all",
        "hover:bg-surface-elevated",
        isSandbox ? "border-warning/25 hover:border-warning/40" : "border-border hover:border-foreground/20"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              isSandbox ? "bg-warning/15 text-warning" : "bg-surface-elevated text-muted-foreground"
            )}
          >
            {isSandbox ? <FlaskConical className="h-4 w-4" /> : <Radio className="h-4 w-4" />}
          </div>
          <div>
            <Badge
              className={cn(
                isSandbox
                  ? "border-warning/30 bg-warning/15 text-warning"
                  : "border-primary/40 bg-primary/15 text-foreground"
              )}
            >
              {label}
            </Badge>
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
      </div>
      <div
        className="flex items-center gap-1 font-mono text-sm"
        onClick={(e) => e.preventDefault()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        #{workspaceId}
        <span onClick={(e) => e.stopPropagation()}>
          <CopyButton value={String(workspaceId)} />
        </span>
      </div>
    </Link>
  )
}

export function AppWorkspacesCard({
  liveWorkspaceId,
  sandboxWorkspaceId,
  workspaceLinkPrefix = "/workspaces",
}: AppWorkspacesCardProps) {
  return (
    <Panel
      title="Data lanes"
      description={
        <>
          Isolated live and sandbox workspaces on the same API.{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">bx_live_*</code> uses live;{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">bx_test_*</code> uses sandbox.
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Lane
          href={`${workspaceLinkPrefix}/${liveWorkspaceId}`}
          label="Live"
          subtitle="Production data"
          workspaceId={liveWorkspaceId}
          tone="live"
        />
        {sandboxWorkspaceId ? (
          <Lane
            href={`${workspaceLinkPrefix}/${sandboxWorkspaceId}`}
            label="Sandbox"
            subtitle="Test data only"
            workspaceId={sandboxWorkspaceId}
            tone="sandbox"
          />
        ) : (
          <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
            Sandbox workspace not provisioned yet.
          </div>
        )}
      </div>
    </Panel>
  )
}
