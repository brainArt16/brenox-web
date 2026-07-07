import { engineFetch } from "./client"
import type { AppBilling, Plan, PlatformSettings, PlatformStatus } from "@/lib/types"

export async function listPlans(): Promise<Plan[]> {
  const data = await engineFetch<{ plans: Plan[] }>("/api/plans")
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
