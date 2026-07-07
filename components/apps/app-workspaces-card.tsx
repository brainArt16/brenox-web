import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { CopyButton } from "@/components/shared/copy-button"

interface AppWorkspacesCardProps {
  liveWorkspaceId: number
  sandboxWorkspaceId?: number
  workspaceLinkPrefix?: string
}

export function AppWorkspacesCard({
  liveWorkspaceId,
  sandboxWorkspaceId,
  workspaceLinkPrefix = "/workspaces",
}: AppWorkspacesCardProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 space-y-4">
      <div>
        <h2 className="font-semibold">Data lanes</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Each app has isolated live and sandbox workspaces on the same API.{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">bx_live_*</code> keys use live;{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">bx_test_*</code> keys use sandbox.
        </p>
      </div>

      <dl className="grid gap-3 sm:grid-cols-2 text-sm">
        <div className="rounded-lg border border-border p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="border-primary/50 bg-primary/30 text-foreground">Live</Badge>
            <span className="text-muted-foreground">Production data</span>
          </div>
          <dd className="flex items-center gap-1 font-mono">
            #{liveWorkspaceId}
            <CopyButton value={String(liveWorkspaceId)} />
          </dd>
          <dd>
            <Link
              href={`${workspaceLinkPrefix}/${liveWorkspaceId}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              Open live workspace
            </Link>
          </dd>
        </div>

        <div className="rounded-lg border border-border p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="border-warning/30 bg-warning/20 text-warning">Sandbox</Badge>
            <span className="text-muted-foreground">Test data only</span>
          </div>
          {sandboxWorkspaceId ? (
            <>
              <dd className="flex items-center gap-1 font-mono">
                #{sandboxWorkspaceId}
                <CopyButton value={String(sandboxWorkspaceId)} />
              </dd>
              <dd>
                <Link
                  href={`${workspaceLinkPrefix}/${sandboxWorkspaceId}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Open sandbox workspace
                </Link>
              </dd>
            </>
          ) : (
            <dd className="text-muted-foreground">Run migration 16 to provision sandbox workspace.</dd>
          )}
        </div>
      </dl>
    </section>
  )
}
