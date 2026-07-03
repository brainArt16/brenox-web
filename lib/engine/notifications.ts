import { engineFetch } from "./client"
import type { Notification } from "@/lib/types"

interface EngineNotification {
  id: number
  type: string
  title: string
  body: string
  read: boolean
  created_at: string
  read_at?: string
  data?: Record<string, unknown>
}

function mapNotification(raw: EngineNotification): Notification {
  return {
    id: raw.id,
    type: raw.type,
    title: raw.title,
    body: raw.body,
    read: raw.read,
    created_at: raw.created_at,
  }
}

export async function listNotifications(
  limit = 50,
  offset = 0
): Promise<Notification[]> {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  })
  const data = await engineFetch<{ notifications: EngineNotification[] }>(
    `/api/notifications?${params.toString()}`
  )
  return (data.notifications ?? []).map(mapNotification)
}

export async function markNotificationRead(id: number): Promise<Notification> {
  const raw = await engineFetch<EngineNotification>(
    `/api/notifications/${id}/read`,
    { method: "PATCH" }
  )
  return mapNotification(raw)
}

export async function markAllNotificationsReadRequest(): Promise<number> {
  const data = await engineFetch<{ marked_read: number }>(
    "/api/notifications/read-all",
    { method: "POST" }
  )
  return data.marked_read ?? 0
}
