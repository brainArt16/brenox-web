import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string | number
  hint?: string
  icon?: LucideIcon
  className?: string
}

export function StatCard({ label, value, hint, icon: Icon, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-[var(--card-shadow)] transition-all",
        "hover:border-foreground/15 hover:bg-surface-elevated",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {label}
          </p>
          <p className="truncate text-2xl font-semibold tabular-nums tracking-tight text-foreground">
            {value}
          </p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        {Icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-elevated text-muted-foreground transition-colors group-hover:text-foreground">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  )
}
