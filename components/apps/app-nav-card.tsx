import Link from "next/link"
import { ArrowUpRight, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface AppNavCardProps {
  href: string
  icon: LucideIcon
  label: string
  description: string
  meta?: string
  tone?: "default" | "sandbox" | "live"
}

export function AppNavCard({
  href,
  icon: Icon,
  label,
  description,
  meta,
  tone = "default",
}: AppNavCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-5 shadow-[var(--card-shadow)] transition-all",
        "hover:bg-surface-elevated",
        tone === "sandbox" && "border-warning/20 hover:border-warning/40",
        tone === "live" && "border-border hover:border-foreground/25",
        tone === "default" && "border-border hover:border-foreground/20"
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent",
          tone === "sandbox" ? "via-warning/45" : "via-foreground/20"
        )}
      />

      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl transition-colors",
            tone === "sandbox" && "bg-warning/15 text-warning",
            tone === "live" && "bg-foreground/10 text-foreground",
            tone === "default" &&
              "bg-surface-elevated text-muted-foreground group-hover:text-foreground"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
      </div>

      <div className="mt-4 flex-1">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>

      {meta && (
        <p className="mt-4 border-t border-border/70 pt-3 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          {meta}
        </p>
      )}
    </Link>
  )
}
