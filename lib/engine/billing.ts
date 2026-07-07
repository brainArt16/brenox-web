import { engineFetch } from "./client"
import type { AdminPlan, AppBilling, Plan, PlatformSettings, PlatformStatus } from "@/lib/types"

export async function listPlans(): Promise<Plan[]> {
  const data = await engineFetch<{ plans: Plan[] }>("/api/plans", { auth: false })
  return data.plans
}

export async function getPlatformStatus(): Promise<PlatformStatus> {
  return engineFetch<PlatformStatus>("/api/platform/status")
}

export async function getAppBilling(appId: number): Promise<AppBilling> {
  return engineFetch<AppBilling>(`/api/apps/${appId}/billing`)
}

export async function createBillingCheckout(
  appId: number,
  planSlug: string
): Promise<{ url: string }> {
  return engineFetch<{ url: string }>(`/api/apps/${appId}/billing/checkout`, {
    method: "POST",
    body: JSON.stringify({ plan_slug: planSlug }),
  })
}

export async function getAdminBillingOverview(): Promise<{ active_subscriptions: number }> {
  return engineFetch("/api/admin/billing/overview")
}

export async function listAdminSubscriptions() {
  const data = await engineFetch<{
    subscriptions: import("@/lib/types").AdminSubscription[]
  }>("/api/admin/billing/subscriptions")
  return data.subscriptions
}

export async function getAdminPlatformSettings(): Promise<PlatformSettings> {
  return engineFetch<PlatformSettings>("/api/admin/platform-settings")
}

export async function updateAdminPlatformSettings(
  body: Partial<PlatformSettings>
): Promise<PlatformSettings> {
  return engineFetch<PlatformSettings>("/api/admin/platform-settings", {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}

export async function updateAdminAppSubscription(
  appId: number,
  body: { plan_slug?: string; status?: string }
): Promise<AppBilling> {
  return engineFetch<AppBilling>(`/api/admin/apps/${appId}/subscription`, {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}

export async function listAdminPlans(): Promise<AdminPlan[]> {
  const data = await engineFetch<{ plans: AdminPlan[] }>("/api/admin/plans")
  return data.plans
}

export type PlanUpsertBody = {
  slug?: string
  name?: string
  description?: string
  price_cents?: number
  stripe_price_id?: string
  messages_limit?: number
  connections_limit?: number
  retention_days?: number
  webhooks_enabled?: boolean
  video_calls_enabled?: boolean
  moderation_enabled?: boolean
  is_active?: boolean
  is_highlighted?: boolean
  sort_order?: number
}

export async function createAdminPlan(body: PlanUpsertBody & { slug: string; name: string; price_cents: number; messages_limit: number; connections_limit: number; retention_days: number }): Promise<AdminPlan> {
  return engineFetch<AdminPlan>("/api/admin/plans", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export async function updateAdminPlan(slug: string, body: PlanUpsertBody): Promise<AdminPlan> {
  return engineFetch<AdminPlan>(`/api/admin/plans/${slug}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}

export async function deleteAdminPlan(slug: string): Promise<void> {
  await engineFetch<void>(`/api/admin/plans/${slug}`, { method: "DELETE" })
}
