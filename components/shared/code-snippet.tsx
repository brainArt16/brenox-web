"use client"

import { CopyButton } from "@/components/shared/copy-button"

interface CodeSnippetProps {
  code: string
  title?: string
}

export function CodeSnippet({ code, title }: CodeSnippetProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      {title && (
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <span className="text-xs font-medium text-muted-foreground">{title}</span>
          <CopyButton value={code} label="Code copied" />
        </div>
      )}
      <div className="relative">
        {!title && (
          <div className="absolute right-2 top-2">
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
