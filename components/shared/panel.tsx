import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PanelProps {
  children: ReactNode
  className?: string
  title?: string
  description?: ReactNode
  action?: ReactNode
  padded?: boolean
}

export function Panel({
  children,
  className,
  title,
  description,
  action,
  padded = true,
}: PanelProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card shadow-[var(--card-shadow)]",
        className
      )}
    >
      {(title || action) && (
        <div
          className={cn(
            "flex flex-col gap-3 border-b border-border/80 sm:flex-row sm:items-start sm:justify-between",
            padded ? "px-5 py-4 sm:px-6" : "p-4"
          )}
        >
          <div className="min-w-0 space-y-1">
            {title && <h2 className="text-sm font-semibold text-foreground">{title}</h2>}
            {description && (
              <div className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {description}
              </div>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={cn(padded && "p-5 sm:p-6")}>{children}</div>
    </section>
  )
}
