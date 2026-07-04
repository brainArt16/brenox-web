"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { getDocSectionsForSdk } from "@/lib/docs/sdk-registry"

interface DocsTocProps {
  sdkId: string
  className?: string
}

export function DocsToc({ sdkId, className }: DocsTocProps) {
  const sections = getDocSectionsForSdk(sdkId)
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "overview")

  useEffect(() => {
    const elements = sections
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
  }, [sdkId, sections])

  return (
    <nav className={cn("space-y-0.5", className)}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        On this page
      </p>
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className={cn(
            "block rounded-md border-l-2 py-1.5 pl-3 pr-2 text-sm transition-colors",
            activeId === section.id
              ? "border-primary bg-surface-elevated font-medium text-foreground"
              : "border-transparent text-muted-foreground hover:border-border hover:bg-surface hover:text-foreground",
          )}
        >
          {section.label}
        </a>
      ))}
    </nav>
  )
}
