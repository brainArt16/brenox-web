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
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border p-5 transition-all",
        isSandbox
          ? "border-warning/25 bg-warning/[0.03]"
          : "border-border bg-surface/30"
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent",
          isSandbox ? "via-warning/50" : "via-foreground/25"
        )}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl",
              isSandbox ? "bg-warning/15 text-warning" : "bg-foreground/10 text-foreground"
            )}
          >
            {isSandbox ? <FlaskConical className="h-5 w-5" /> : <Radio className="h-5 w-5" />}
          </div>
          <div>
            <Badge
              className={cn(
                isSandbox
                  ? "border-warning/30 bg-warning/15 text-warning"
                  : "border-foreground/20 bg-foreground/10 text-foreground"
              )}
            >
              {label}
            </Badge>
            <p className="mt-1.5 text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-border/60 pt-4">
        <div className="flex items-center gap-1.5 font-mono text-sm">
          <span className="text-muted-foreground">#</span>
          {workspaceId}
          <CopyButton value={String(workspaceId)} />
        </div>
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          Open
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
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
          <code className="rounded bg-muted px-1 py-0.5 text-xs">bx_live_*</code> → live ·{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">bx_test_*</code> → sandbox.
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Lane
          href={`${workspaceLinkPrefix}/${liveWorkspaceId}`}
          label="Live"
          subtitle="Production channels & messages"
          workspaceId={liveWorkspaceId}
          tone="live"
        />
        {sandboxWorkspaceId ? (
          <Lane
            href={`${workspaceLinkPrefix}/${sandboxWorkspaceId}`}
            label="Sandbox"
            subtitle="Safe for keys, CI, and demos"
            workspaceId={sandboxWorkspaceId}
            tone="sandbox"
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground">
            Sandbox workspace not provisioned yet.
          </div>
        )}
      </div>
    </Panel>
  )
}
