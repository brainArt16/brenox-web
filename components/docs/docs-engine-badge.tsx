"use client"

import { Server } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { EngineVersionDoc } from "@/lib/docs/engine-versions"

interface DocsEngineBadgeProps {
  engine: EngineVersionDoc
  className?: string
}

export function DocsEngineBadge({ engine }: DocsEngineBadgeProps) {
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <Server className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Brenox Engine</span>
        <Badge variant="secondary" className="font-mono text-[11px]">
          {engine.version}
        </Badge>
        <Badge variant="outline" className="font-mono text-[11px]">
          API {engine.apiVersion}
        </Badge>
      </div>
      <p className="mt-2 font-mono text-xs text-muted-foreground">{engine.baseUrl}</p>
      {engine.highlights.length > 0 && (
        <ul className="mt-2 space-y-0.5">
          {engine.highlights.slice(0, 2).map((h) => (
            <li key={h} className="text-xs text-muted-foreground">
              · {h}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
