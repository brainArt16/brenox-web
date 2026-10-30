import Link from "next/link"
import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface AppMetricCardProps {
  label: string
  value: string | number
  hint?: string
  icon: LucideIcon
  href?: string
  tone?: "default" | "sandbox" | "live"
  className?: string
}

export function AppMetricCard({
  label,
  value,
  hint,
  icon: Icon,
  href,
  tone = "default",
  className,
}: AppMetricCardProps) {
  const body = (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent opacity-60" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </p>
          <p className="text-3xl font-semibold tabular-nums tracking-tight text-foreground">
            {value}
          </p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
            tone === "sandbox" && "bg-warning/15 text-warning",
            tone === "live" && "bg-foreground/10 text-foreground",
            tone === "default" && "bg-surface-elevated text-muted-foreground group-hover:text-foreground"
          )}
        >
          <Icon className="h-4.5 w-4.5 h-[18px] w-[18px]" />
        </div>
      </div>
    </>
  )

  const classes = cn(
    "group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-[var(--card-shadow)] transition-all",
    href && "hover:border-foreground/25 hover:bg-surface-elevated",
    className
  )

  if (href) {
    return (
      <Link href={href} className={classes}>
        {body}
      </Link>
    )
  }

  return <div className={classes}>{body}</div>
}
