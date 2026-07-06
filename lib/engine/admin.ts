import { engineFetch } from "./client"
import type {
  AdminApp,
  AdminAuditLog,
  AdminOverview,
  AdminUser,
  AdminWorkspace,
  AdminWorkspaceMember,
  ApiKey,
  PlatformRole,
} from "@/lib/types"

export function isPlatformAdmin(role?: PlatformRole): boolean {
  return role === "admin" || role === "support"
}

export async function getAdminOverview(): Promise<AdminOverview> {
  return engineFetch<AdminOverview>("/api/admin/overview")
}

export async function listAdminUsers(search?: string): Promise<AdminUser[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : ""
  const data = await engineFetch<{ users: AdminUser[] }>(`/api/admin/users${query}`)
  return data.users
}

export async function getAdminUser(userId: number): Promise<AdminUser> {
  return engineFetch<AdminUser>(`/api/admin/users/${userId}`)
}

export async function updateAdminUser(
  userId: number,
  body: { platform_role?: PlatformRole; suspended?: boolean }
): Promise<AdminUser> {
  return engineFetch<AdminUser>(`/api/admin/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}

export async function listAdminWorkspaces(): Promise<AdminWorkspace[]> {
  const data = await engineFetch<{ workspaces: AdminWorkspace[] }>("/api/admin/workspaces")
  return data.workspaces
}

export async function getAdminWorkspace(workspaceId: number): Promise<AdminWorkspace> {
  return engineFetch<AdminWorkspace>(`/api/admin/workspaces/${workspaceId}`)
}

export async function listAdminWorkspaceMembers(
  workspaceId: number
): Promise<AdminWorkspaceMember[]> {
  const data = await engineFetch<{ members: AdminWorkspaceMember[] }>(
    `/api/admin/workspaces/${workspaceId}/members`
  )
  return data.members
}

export async function listAdminApps(): Promise<AdminApp[]> {
  const data = await engineFetch<{ apps: AdminApp[] }>("/api/admin/apps")
  return data.apps
}

export async function getAdminApp(appId: number): Promise<AdminApp> {
  return engineFetch<AdminApp>(`/api/admin/apps/${appId}`)
}

export async function listAdminAppKeys(appId: number): Promise<ApiKey[]> {
  const data = await engineFetch<{ keys: ApiKey[] }>(`/api/admin/apps/${appId}/keys`)
  return data.keys
}

export async function revokeAdminAppKey(appId: number, keyId: number): Promise<void> {
  await engineFetch<void>(`/api/admin/apps/${appId}/keys/${keyId}`, {
    method: "DELETE",
  })
}

export type AdminAuditLogFilters = {
  user_id?: number
  action?: string
  limit?: number
  offset?: number
}

export async function listAdminAuditLogs(
  filters: AdminAuditLogFilters = {}
): Promise<AdminAuditLog[]> {
  const params = new URLSearchParams()
  if (filters.user_id != null) params.set("user_id", String(filters.user_id))
  if (filters.action) params.set("action", filters.action)
  if (filters.limit != null) params.set("limit", String(filters.limit))
  if (filters.offset != null) params.set("offset", String(filters.offset))
  const query = params.toString()
  const data = await engineFetch<{ audit_logs: AdminAuditLog[] }>(
    `/api/admin/audit-logs${query ? `?${query}` : ""}`
  )
  return data.audit_logs
}
