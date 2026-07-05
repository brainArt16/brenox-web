"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import type { DemoStep } from "@/lib/resources/catalog"

interface ResourcesTocProps {
  steps: DemoStep[]
  className?: string
}

export function ResourcesToc({ steps, className }: ResourcesTocProps) {
  const [activeId, setActiveId] = useState<string>(steps[0]?.id ?? "")

  useEffect(() => {
    const elements = steps
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[]
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActiveId(visible.target.id)
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5] },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [steps])

  return (
    <nav className={cn("space-y-0.5", className)}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Tutorial steps
      </p>
      {steps.map((step) => (
        <a
          key={step.id}
          href={`#${step.id}`}
          className={cn(
            "flex gap-2 rounded-md border-l-2 py-1.5 pl-3 pr-2 text-sm transition-colors",
            activeId === step.id
              ? "border-primary bg-surface-elevated font-medium text-foreground"
              : "border-transparent text-muted-foreground hover:border-border hover:bg-surface hover:text-foreground",
          )}
        >
          <span className="font-mono text-xs text-muted-foreground">{step.number}</span>
          <span className="truncate">{step.title}</span>
        </a>
      ))}
    </nav>
  )
}
