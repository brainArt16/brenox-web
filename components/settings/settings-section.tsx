import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SettingsSectionProps {
  title: string
  description?: string
  icon?: ReactNode
  children: ReactNode
  className?: string
  variant?: "default" | "danger"
}

export function SettingsSection({
  title,
  description,
  icon,
  children,
  className,
  variant = "default",
}: SettingsSectionProps) {
  return (
    <section
      className={cn(
        "rounded-xl border bg-card p-6",
        variant === "danger" ? "border-destructive/30" : "border-border",
        className
      )}
    >
      <div className="mb-6 flex items-start gap-3">
        {icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-elevated text-muted-foreground">
            {icon}
          </div>
        )}
        <div>
          <h2
            className={cn(
              "font-semibold",
              variant === "danger" ? "text-destructive" : "text-foreground"
            )}
          >
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {children}
    </section>
  )
}
