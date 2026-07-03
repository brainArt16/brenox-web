"use client"

import { cn } from "@/lib/utils"

type PresenceStatus = "online" | "away" | "busy" | "offline" | "typing" | "recording"

interface PresenceBadgeProps {
  status: PresenceStatus
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  className?: string
  pulse?: boolean
}

const statusConfig = {
  online: {
    color: "bg-emerald-500",
    label: "Online",
    ringColor: "ring-emerald-500/30",
  },
  away: {
    color: "bg-amber-500",
    label: "Away",
    ringColor: "ring-amber-500/30",
  },
  busy: {
    color: "bg-red-500",
    label: "Do not disturb",
    ringColor: "ring-red-500/30",
  },
  offline: {
    color: "bg-zinc-500",
    label: "Offline",
    ringColor: "ring-zinc-500/30",
  },
  typing: {
    color: "bg-blue-500",
    label: "Typing...",
    ringColor: "ring-blue-500/30",
  },
  recording: {
    color: "bg-red-500",
    label: "Recording",
    ringColor: "ring-red-500/30",
  },
}

const sizeConfig = {
  sm: {
    badge: "h-2 w-2",
    container: "h-3 w-3",
    text: "text-xs",
  },
  md: {
    badge: "h-2.5 w-2.5",
    container: "h-4 w-4",
    text: "text-sm",
  },
  lg: {
    badge: "h-3 w-3",
    container: "h-5 w-5",
    text: "text-sm",
  },
}

export function PresenceBadge({
  status,
  size = "md",
  showLabel = false,
  className,
  pulse = true,
}: PresenceBadgeProps) {
  const config = statusConfig[status]
  const sizes = sizeConfig[size]

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center",
          sizes.container
        )}
      >
        <span
          className={cn(
            "rounded-full",
            config.color,
            sizes.badge,
            pulse && status === "online" && "animate-pulse"
          )}
        />
        {(status === "online" || status === "typing" || status === "recording") && pulse && (
          <span
            className={cn(
              "absolute inset-0 rounded-full ring-2",
              config.ringColor,
              "animate-ping opacity-75"
            )}
            style={{ animationDuration: "2s" }}
          />
        )}
      </div>
      {showLabel && (
        <span className={cn("text-muted-foreground", sizes.text)}>
          {config.label}
        </span>
      )}
    </div>
  )
}

// Presence indicator that can be positioned on avatars
interface AvatarPresenceProps {
  status: PresenceStatus
  size?: "sm" | "md" | "lg"
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
}

const positionConfig = {
  "bottom-right": "bottom-0 right-0",
  "bottom-left": "bottom-0 left-0",
  "top-right": "top-0 right-0",
  "top-left": "top-0 left-0",
}

export function AvatarPresence({
  status,
  size = "md",
  position = "bottom-right",
}: AvatarPresenceProps) {
  const config = statusConfig[status]
  const sizes = sizeConfig[size]

  return (
    <div
      className={cn(
        "absolute flex items-center justify-center rounded-full border-2 border-background",
        positionConfig[position],
        sizes.container
      )}
    >
      <span className={cn("rounded-full", config.color, sizes.badge)} />
    </div>
  )
}

// Typing indicator with animated dots
interface TypingDotsProps {
  className?: string
}

export function TypingDots({ className }: TypingDotsProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <span
        className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
        style={{ animationDelay: "0ms" }}
      />
      <span
        className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
        style={{ animationDelay: "150ms" }}
      />
      <span
        className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  )
}
