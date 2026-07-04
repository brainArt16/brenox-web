"use client"

import { CopyButton } from "@/components/shared/copy-button"
import { cn } from "@/lib/utils"

interface CodeSnippetProps {
  code: string
  title?: string
  language?: string
  className?: string
}

export function CodeSnippet({ code, title, language = "typescript", className }: CodeSnippetProps) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-surface", className)}>
      {(title || language) && (
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <div className="flex items-center gap-2">
            {title && <span className="text-xs font-medium text-foreground">{title}</span>}
            {language && (
              <span className="rounded bg-card px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                {language}
              </span>
            )}
          </div>
          <CopyButton value={code} label="Code copied" />
        </div>
      )}
      <div className="relative">
        {!title && !language && (
          <div className="absolute right-2 top-2 z-10">
            <CopyButton value={code} label="Code copied" />
          </div>
        )}
        <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-foreground">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  )
}
