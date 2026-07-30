"use client"

import { CodeSnippet } from "@/components/shared/code-snippet"

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
  return (
    <CodeSnippet
      code={APP_TSX}
      title="App.tsx"
      language="tsx"
      showLineNumbers
      className="shadow-2xl shadow-black/40"
    />
  )
}
