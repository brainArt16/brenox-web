import { CheckCircle2, Radio } from "lucide-react"
import { cn } from "@/lib/utils"
import { DOC_CAPABILITIES } from "@/lib/docs/content"

export function DocsCapabilityGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {DOC_CAPABILITIES.map((cap) => (
        <div
          key={cap.title}
          className="group rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/25 hover:bg-surface-elevated"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface">
              <cap.icon className="h-4 w-4 text-primary" />
            </div>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                cap.status === "ready"
                  ? "bg-success/15 text-success"
                  : "bg-warning/15 text-warning",
              )}
            >
              {cap.status === "ready" ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <Radio className="h-3 w-3" />
              )}
              {cap.status === "ready" ? "SDK ready" : "Signaling"}
            </span>
          </div>
          <p className="mt-3 text-sm font-medium text-foreground">{cap.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{cap.description}</p>
          <p className="mt-3 font-mono text-[11px] text-muted-foreground">{cap.sdk}</p>
        </div>
      ))}
    </div>
  )
}
