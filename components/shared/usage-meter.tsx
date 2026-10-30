import { type LucideIcon } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface UsageMeterProps {
  label: string
  used: number
  limit: number
  unit?: string
  icon?: LucideIcon
  hint?: string
  className?: string
  unlimitedLabel?: string
}

function tone(pct: number) {
  if (pct >= 90) return "danger"
  if (pct >= 75) return "warn"
  return "ok"
}

export function UsageMeter({
  label,
  used,
  limit,
  unit,
  icon: Icon,
  hint,
  className,
  unlimitedLabel = "Unlimited",
}: UsageMeterProps) {
  const hasLimit = limit > 0
  const pct = hasLimit ? Math.min(100, (used / limit) * 100) : 0
  const level = hasLimit ? tone(pct) : "ok"

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          {Icon && (
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-elevated text-muted-foreground">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">{label}</p>
            {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
          </div>
        </div>
        <p className="shrink-0 text-sm tabular-nums text-muted-foreground">
          <span className="font-medium text-foreground">{used.toLocaleString()}</span>
          {" / "}
          {hasLimit ? (
            <>
              {limit.toLocaleString()}
              {unit ? ` ${unit}` : ""}
            </>
          ) : (
            unlimitedLabel
          )}
        </p>
      </div>
      {hasLimit && (
        <Progress
          value={pct}
          className="h-2"
          indicatorClassName={cn(
            level === "warn" && "bg-warning",
            level === "danger" && "bg-destructive"
          )}
        />
      )}
    </div>
  )
}
