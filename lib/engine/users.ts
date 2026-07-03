import { engineFetch } from "./client"

export type PresenceStatus = "online" | "away" | "offline"

export interface UserPresence {
  user_id: number
  status: PresenceStatus
  connection_count: number
  last_seen: string
}

export async function getMyPresence(): Promise<UserPresence> {
  return engineFetch<UserPresence>("/api/users/me/status")
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  await engineFetch("/api/users/me/password", {
    method: "PATCH",
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  })
}
