"use client"

import { HighlightedCode } from "@/components/shared/code-snippet"

const APP_TSX = `import { BrenoxProvider, ChatWindow } from '@brenox/react'

// Full chat in your app with one component
export function App() {
  return (
    <BrenoxProvider apiKey={process.env.BRENOX_API_KEY}>
      <ChatWindow channelId="support" />
    </BrenoxProvider>
  )
}`

export function DeveloperCodePreview() {
  const lineCount = APP_TSX.split("\n").length

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
      <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-destructive/60" />
        <div className="h-3 w-3 rounded-full bg-warning/60" />
        <div className="h-3 w-3 rounded-full bg-success/60" />
        <span className="ml-4 font-mono text-xs text-muted-foreground">App.tsx</span>
      </div>

      <div className="flex min-w-0 bg-[var(--code-surface)]">
        <div
          className="hidden shrink-0 select-none border-r border-[var(--code-border)] bg-[var(--code-header)] py-4 pl-4 pr-3 text-right font-mono text-[0.8125rem] leading-relaxed text-muted-foreground/50 sm:block"
          aria-hidden
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <HighlightedCode
          code={APP_TSX}
          language="tsx"
          className="min-w-0 flex-1 py-4 [&_.shiki_code]:text-[0.8125rem]"
        />
      </div>
    </div>
  )
}
