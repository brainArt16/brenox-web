import { engineFetch } from "./client"
import type {
  AccountBilling,
  AdminPlan,
  AdminSubscription,
  Plan,
  PlatformSettings,
  PlatformStatus,
} from "@/lib/types"

export async function listPlans(): Promise<Plan[]> {
  const data = await engineFetch<{ plans: Plan[] }>("/api/plans", { auth: false })
  return data.plans
}

export async function getPlatformStatus(): Promise<PlatformStatus> {
  return engineFetch<PlatformStatus>("/api/platform/status")
}

export async function getAccountBilling(): Promise<AccountBilling> {
  return engineFetch<AccountBilling>("/api/billing")
}

export async function createBillingCheckout(planSlug: string): Promise<{ url: string }> {
  return engineFetch<{ url: string }>("/api/billing/checkout", {
    method: "POST",
    body: JSON.stringify({ plan_slug: planSlug }),
  })
}

export async function getAdminBillingOverview(): Promise<{ active_subscriptions: number }> {
  return engineFetch("/api/admin/billing/overview")
}

export async function listAdminSubscriptions(): Promise<AdminSubscription[]> {
  const data = await engineFetch<{ subscriptions: AdminSubscription[] }>(
    "/api/admin/billing/subscriptions"
  )
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

export async function getAdminUserBilling(userId: number): Promise<AccountBilling> {
  return engineFetch<AccountBilling>(`/api/admin/users/${userId}/billing`)
}

export async function updateAdminUserSubscription(
  userId: number,
  body: { plan_slug?: string; status?: string }
): Promise<AccountBilling> {
  return engineFetch<AccountBilling>(`/api/admin/users/${userId}/subscription`, {
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
  max_apps?: number
  video_minutes_limit?: number
  max_call_participants?: number
  webhooks_enabled?: boolean
  video_calls_enabled?: boolean
  moderation_enabled?: boolean
  is_active?: boolean
  is_highlighted?: boolean
  sort_order?: number
}

export async function createAdminPlan(
  body: PlanUpsertBody & {
    slug: string
    name: string
    price_cents: number
    messages_limit: number
    connections_limit: number
    retention_days: number
    max_apps: number
  }
): Promise<AdminPlan> {
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
