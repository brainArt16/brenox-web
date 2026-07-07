"use client"

import { useEffect, useState } from "react"
import { CopyButton } from "@/components/shared/copy-button"
import { highlightCode } from "@/lib/shiki/highlighter"
import { cn } from "@/lib/utils"

interface CodeSnippetProps {
  code: string
  title?: string
  language?: string
  className?: string
}

export function HighlightedCode({
  code,
  language,
  className,
}: {
  code: string
  language: string
  className?: string
}) {
  const [html, setHtml] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setHtml(null)

    void highlightCode(code, language).then((result) => {
      if (!cancelled) setHtml(result)
    })

    return () => {
      cancelled = true
    }
  }, [code, language])

  if (!html) {
    return (
      <pre
        className={cn(
          "overflow-x-auto bg-[var(--code-surface)] p-4 font-mono text-[0.8125rem] leading-relaxed text-foreground",
          className,
        )}
      >
        <code>{code}</code>
      </pre>
    )
  }

  return (
    <div
      className={cn(
        "shiki-code overflow-x-auto bg-[var(--code-surface)] text-xs leading-relaxed",
        "[&_.shiki]:m-0 [&_.shiki]:overflow-x-auto [&_.shiki]:bg-transparent [&_.shiki]:p-4",
        "[&_.shiki_code]:font-mono [&_.shiki_code]:text-[0.8125rem] [&_.shiki_code]:leading-relaxed",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export function CodeSnippet({ code, title, language = "typescript", className }: CodeSnippetProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-[var(--code-border)] bg-card shadow-[var(--card-shadow)]",
        className,
      )}
    >
      {(title || language) && (
        <div className="flex items-center justify-between border-b border-[var(--code-border)] bg-[var(--code-header)] px-4 py-2.5">
          <div className="flex items-center gap-2">
            {title && <span className="text-xs font-medium text-foreground">{title}</span>}
            {language && (
              <span className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
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
        <HighlightedCode code={code} language={language} />
      </div>
    </div>
  )
}
