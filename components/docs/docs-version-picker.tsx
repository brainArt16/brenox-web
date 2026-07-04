"use client"

import { cn } from "@/lib/utils"
import type { SdkVersionDoc, SdkVersionStatus } from "@/lib/docs/sdk-versions"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlertTriangle, Sparkles } from "lucide-react"

const STATUS_LABEL: Record<SdkVersionStatus, string> = {
  current: "Current",
  supported: "Supported",
  deprecated: "Deprecated",
  beta: "Beta",
}

interface DocsVersionPickerProps {
  versions: SdkVersionDoc[]
  selected?: SdkVersionDoc
  onSelect: (version: string) => void
  className?: string
}

export function DocsVersionPicker({
  versions,
  selected,
  onSelect,
  className,
}: DocsVersionPickerProps) {
  if (versions.length === 0) return null

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="docs-version" className="text-xs font-medium text-muted-foreground">
          Version
        </label>
        <Select value={selected?.version ?? versions[0].version} onValueChange={onSelect}>
          <SelectTrigger id="docs-version" className="h-8 w-[140px] bg-surface text-sm">
            <SelectValue placeholder="Version" />
          </SelectTrigger>
          <SelectContent>
            {versions.map((v) => (
              <SelectItem key={v.version} value={v.version}>
                <span className="font-mono">{v.version}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {STATUS_LABEL[v.status]}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selected && <VersionStatusBadge status={selected.status} />}
      </div>

      {selected?.deprecationMessage && (
        <div className="flex gap-2 rounded-lg border border-warning/30 bg-warning/5 px-3 py-2 text-sm text-muted-foreground">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <span>{selected.deprecationMessage}</span>
        </div>
      )}

      {selected && selected.highlights.length > 0 && (
        <div className="rounded-lg border border-border bg-card px-3 py-2.5">
          <p className="flex items-center gap-1.5 text-xs font-medium text-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            What&apos;s in v{selected.version}
          </p>
          <ul className="mt-2 space-y-1">
            {selected.highlights.map((h) => (
              <li key={h} className="text-xs text-muted-foreground">
                · {h}
              </li>
            ))}
          </ul>
          {selected.released && (
            <p className="mt-2 text-[10px] text-muted-foreground">
              Released {selected.released}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function VersionStatusBadge({ status }: { status: SdkVersionStatus }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
        status === "current" && "bg-primary/15 text-primary",
        status === "supported" && "bg-surface text-muted-foreground",
        status === "deprecated" && "bg-warning/15 text-warning",
        status === "beta" && "bg-success/15 text-success",
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}
