"use client"

import { useEffect, useState } from "react"
import { Bell, CheckCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { getNotifications, markAllNotificationsRead, markNotificationAsRead } from "@/lib/api"
import type { Notification } from "@/lib/types"
import { cn } from "@/lib/utils"
import { getErrorMessage } from "@/lib/engine/errors"
import { toast } from "sonner"

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  function load() {
    setLoading(true)
    getNotifications()
      .then(setItems)
      .catch((error) => {
        toast.error(getErrorMessage(error, "Failed to load notifications"))
        setItems([])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  async function handleMarkAll() {
    try {
      const count = await markAllNotificationsRead()
      toast.success(count > 0 ? `Marked ${count} as read` : "All caught up")
      load()
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to mark notifications read"))
    }
  }

  async function handleMarkOne(id: number) {
    try {
      await markNotificationAsRead(id)
      load()
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update notification"))
    }
  }

  const unread = items.filter((n) => !n.read).length

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Activity"
        title="Notifications"
        description="Mentions, replies, workspace invites, and call events."
        action={
          unread > 0 ? (
            <Button variant="outline" size="sm" onClick={() => void handleMarkAll()}>
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark all read
            </Button>
          ) : undefined
        }
      />

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl border border-border bg-card" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You'll see mentions, replies, workspace invites, and other activity here."
        />
      ) : (
        <ul className="space-y-2">
          {items.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => !n.read && void handleMarkOne(n.id)}
                className={cn(
                  "w-full rounded-xl border px-4 py-4 text-left transition-colors",
                  n.read
                    ? "border-border bg-card/50 opacity-75"
                    : "border-primary/30 bg-surface-elevated hover:bg-secondary/30"
                )}
              >
                <div className="flex items-start gap-3">
                  {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  <div className={cn("min-w-0 flex-1", n.read && "ml-5")}>
                    <p className="font-medium text-foreground">{n.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(n.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
