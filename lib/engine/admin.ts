import { engineFetch } from "./client"
import type {
  AdminApp,
  AdminAuditLog,
  AdminOverview,
  AdminUser,
  AdminWorkspace,
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

export async function listAdminApps(): Promise<AdminApp[]> {
  const data = await engineFetch<{ apps: AdminApp[] }>("/api/admin/apps")
  return data.apps
}

export async function listAdminAuditLogs(): Promise<AdminAuditLog[]> {
  const data = await engineFetch<{ audit_logs: AdminAuditLog[] }>("/api/admin/audit-logs")
  return data.audit_logs
}
