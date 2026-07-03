import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface DocSectionProps {
  id: string
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function DocSection({ id, title, description, children, className }: DocSectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-6 space-y-4", className)}>
      <div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  )
}
