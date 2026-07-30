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
  showLineNumbers?: boolean
}

function MacTrafficLights() {
  return (
    <div className="flex shrink-0 items-center gap-1.5" aria-hidden>
      <span className="size-3 rounded-full bg-[#ff5f57] shadow-[inset_0_-0.5px_0.5px_rgba(0,0,0,0.25)]" />
      <span className="size-3 rounded-full bg-[#febc2e] shadow-[inset_0_-0.5px_0.5px_rgba(0,0,0,0.25)]" />
      <span className="size-3 rounded-full bg-[#28c840] shadow-[inset_0_-0.5px_0.5px_rgba(0,0,0,0.25)]" />
    </div>
  )
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
          "overflow-x-auto bg-[var(--code-surface)] p-4 font-mono text-[0.8125rem] leading-relaxed text-[#abb2bf]",
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

export function CodeSnippet({
  code,
  title,
  language = "typescript",
  className,
  showLineNumbers = false,
}: CodeSnippetProps) {
  const lineCount = code.split("\n").length
  const label = title ?? language

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-[var(--code-border)] bg-[var(--code-surface)] shadow-lg shadow-black/25",
        className,
      )}
    >
      <div className="relative flex items-center border-b border-[var(--code-border)] bg-[var(--code-header)] px-4 py-3">
        <MacTrafficLights />
        {label && (
          <span className="pointer-events-none absolute inset-x-0 text-center font-mono text-xs text-[var(--code-chrome-fg)]">
            {label}
          </span>
        )}
        <div className="relative z-10 ml-auto">
          <CopyButton
            value={code}
            label="Code copied"
            className="size-7 text-[var(--code-chrome-fg)] hover:bg-white/10 hover:text-white"
          />
        </div>
      </div>

      <div className="relative flex min-w-0">
        {showLineNumbers && (
          <div
            className="hidden shrink-0 select-none border-r border-[var(--code-border)] bg-[var(--code-header)] py-4 pl-4 pr-3 text-right font-mono text-[0.8125rem] leading-relaxed text-[var(--code-chrome-fg)]/60 sm:block"
            aria-hidden
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
        )}
        <HighlightedCode
          code={code}
          language={language}
          className={cn("min-w-0 flex-1", showLineNumbers && "[&_.shiki]:pl-3")}
        />
      </div>
    </div>
  )
}
