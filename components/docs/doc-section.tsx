import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface DocSectionProps {
  id: string
  title: string
  description?: string
  badge?: string
  children: ReactNode
  className?: string
}

export function DocSection({
  id,
  title,
  description,
  badge,
  children,
  className,
}: DocSectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-8 space-y-5", className)}>
      <div className="border-b border-border pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
          {badge && (
            <span className="rounded-full bg-surface px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  )
}
