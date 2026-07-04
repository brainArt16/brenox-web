"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { DOC_SECTIONS } from "@/lib/docs/content"

interface DocsTocProps {
  className?: string
}

export function DocsToc({ className }: DocsTocProps) {
  const [activeId, setActiveId] = useState<string>(DOC_SECTIONS[0].id)

  useEffect(() => {
    const sections = DOC_SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean)
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActiveId(visible.target.id)
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5] },
    )

    sections.forEach((el) => observer.observe(el!))
    return () => observer.disconnect()
  }, [])

  return (
    <nav className={cn("space-y-0.5", className)}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        On this page
      </p>
      {DOC_SECTIONS.map((section) => (
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
