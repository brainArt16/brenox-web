"use client"

import { m } from "framer-motion"

interface TypingIndicatorProps {
  users: string[]
}

export function TypingIndicator({ users }: TypingIndicatorProps) {
  if (users.length === 0) return null

  const getText = () => {
    if (users.length === 1) {
      return `${users[0]} is typing...`
    } else if (users.length === 2) {
      return `${users[0]} and ${users[1]} are typing...`
    } else if (users.length === 3) {
      return `${users[0]}, ${users[1]}, and ${users[2]} are typing...`
    } else {
      return `${users[0]}, ${users[1]}, and ${users.length - 2} others are typing...`
    }
  }

  return (
    <m.div 
      className="flex items-center gap-2 text-xs text-muted-foreground h-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex gap-1">
        <span className="w-2 h-2 rounded-full bg-muted-foreground animate-typing-dot" />
        <span className="w-2 h-2 rounded-full bg-muted-foreground animate-typing-dot" />
        <span className="w-2 h-2 rounded-full bg-muted-foreground animate-typing-dot" />
      </div>
      <span>{getText()}</span>
    </m.div>
  )
}
