"use client"

import { CodeSnippet } from "@/components/shared/code-snippet"

const APP_TSX = `import { BrenoxProvider, ChatWindow } from '@brenox/react'

export function App() {
  return (
    <BrenoxProvider apiKey={process.env.BRENOX_API_KEY}>
      <ChatWindow channelId="support" />
    </BrenoxProvider>
  )
}`

export function DeveloperCodePreview() {
  return (
    <CodeSnippet
      code={APP_TSX}
      title="App.tsx"
      language="tsx"
      showLineNumbers
      className="overflow-hidden rounded-2xl border border-border shadow-[0_24px_80px_-24px_rgba(0,0,0,0.55)]"
    />
  )
}
