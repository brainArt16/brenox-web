import { type LucideIcon } from "lucide-react"
import { type ReactNode } from "react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-card/40 px-6 py-16 text-center shadow-[var(--card-shadow)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent" />
      <div className="relative mb-5">
        <div className="absolute inset-0 rounded-2xl bg-foreground/5 blur-xl" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface-elevated">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
