import { cn } from "@/lib/utils"
import type { ConnectionState } from "@/lib/types"

interface StatusPillProps {
  state: ConnectionState
  className?: string
}

const labels: Record<ConnectionState, string> = {
  connected: "Connected",
  connecting: "Connecting",
  reconnecting: "Reconnecting",
  disconnected: "Disconnected",
}

export function StatusPill({ state, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        state === "connected" && "bg-success text-success-foreground",
        (state === "connecting" || state === "reconnecting") && "bg-warning text-warning-foreground",
        state === "disconnected" && "bg-destructive/20 text-destructive",
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full bg-current",
          state === "connected" && "animate-pulse-online"
        )}
      />
      {labels[state]}
    </span>
  )
}
