"use client"

import { cn } from "@/lib/utils"
import { DOC_QUICK_LINKS } from "@/lib/docs/content"

export function DocsQuickNav() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none lg:hidden">
      {DOC_QUICK_LINKS.map((link) => (
        <a
          key={link.id}
          href={link.href}
          className={cn(
            "shrink-0 rounded-full border border-border bg-surface px-3.5 py-1.5",
            "text-xs font-medium text-muted-foreground transition-colors",
            "hover:border-primary/30 hover:bg-surface-elevated hover:text-foreground",
          )}
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}
