"use client"

import { useCallback, useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  getAdminUserBilling,
  listAdminPlans,
  updateAdminUserSubscription,
} from "@/lib/engine/billing"
import { getErrorMessage } from "@/lib/engine/errors"
import { toast } from "sonner"
import type { AccountBilling, AdminPlan } from "@/lib/types"

const SUBSCRIPTION_STATUSES = [
  { value: "active", label: "Active", description: "In good standing — usage allowed" },
  { value: "trialing", label: "Trialing", description: "Trial period — usage allowed" },
  { value: "past_due", label: "Past due", description: "Payment failed — usage blocked" },
  { value: "canceled", label: "Canceled", description: "Ended — usage blocked" },
] as const

interface AdminSubscriptionEditorProps {
  userId: number
  canWrite: boolean
  onSaved?: (billing: AccountBilling) => void
}

export function AdminSubscriptionEditor({
  userId,
  canWrite,
  onSaved,
}: AdminSubscriptionEditorProps) {
  const [billing, setBilling] = useState<AccountBilling | null>(null)
  const [plans, setPlans] = useState<AdminPlan[]>([])
  const [planSlug, setPlanSlug] = useState("")
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [billingData, planList] = await Promise.all([
        getAdminUserBilling(userId),
        listAdminPlans(),
      ])
      setBilling(billingData)
      setPlans(planList)
      setPlanSlug(billingData.subscription.plan_slug)
      setStatus(billingData.subscription.status)
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load subscription"))
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (!Number.isFinite(userId)) return
    void load()
  }, [userId, load])

  const dirty =
    billing !== null &&
    (planSlug !== billing.subscription.plan_slug || status !== billing.subscription.status)

  async function handleSave() {
    if (!billing || !dirty) return

    setSaving(true)
    try {
      const body: { plan_slug?: string; status?: string } = {}
      if (planSlug !== billing.subscription.plan_slug) {
        body.plan_slug = planSlug
      }
      if (status !== billing.subscription.status) {
        body.status = status
      }

      const updated = await updateAdminUserSubscription(userId, body)
      setBilling(updated)
      setPlanSlug(updated.subscription.plan_slug)
      setStatus(updated.subscription.status)
      onSaved?.(updated)
      toast.success("Subscription updated")
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update subscription"))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <Skeleton className="h-48 w-full rounded-xl" />
  }

  if (!billing) {
    return (
      <section className="rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">No billing record for this user.</p>
      </section>
    )
  }

  const usagePct =
    billing.usage.messages_limit > 0
      ? Math.min(100, (billing.usage.messages_this_month / billing.usage.messages_limit) * 100)
      : 0

  const selectedPlan = plans.find((plan) => plan.slug === planSlug)

  return (
    <section
      id="subscription"
      className="scroll-mt-20 space-y-6 rounded-xl border border-border bg-card p-6"
    >
      <div className="space-y-1">
        <h2 className="font-semibold">Account subscription</h2>
        <p className="text-sm text-muted-foreground">
          Override plan and status without Stripe. Shared quotas apply to all of this user&apos;s
          apps.
        </p>
      </div>

      <div className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border p-4">
          <p className="text-muted-foreground">Current plan</p>
          <p className="mt-1 font-medium">{billing.subscription.plan_name}</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-muted-foreground">Status</p>
          <p className="mt-1">
            <Badge variant="outline" className="capitalize">
              {billing.subscription.status}
            </Badge>
          </p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-muted-foreground">Apps</p>
          <p className="mt-1 font-medium">
            {billing.apps_count}/{billing.apps_limit}
          </p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-muted-foreground">Period end</p>
          <p className="mt-1 font-medium">
            {billing.subscription.current_period_end
              ? new Date(billing.subscription.current_period_end).toLocaleDateString()
              : "—"}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shared messages this month</span>
          <span>
            {billing.usage.messages_this_month.toLocaleString()} /{" "}
            {billing.usage.messages_limit.toLocaleString()}
          </span>
        </div>
        <Progress value={usagePct} className="h-2" />
      </div>

      {canWrite ? (
        <div className="grid max-w-2xl gap-4 border-t border-border pt-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="admin-plan">Plan</Label>
            <Select value={planSlug} onValueChange={setPlanSlug}>
              <SelectTrigger id="admin-plan">
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem key={plan.slug} value={plan.slug}>
                    {plan.name}
                    {!plan.is_active ? " (inactive)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedPlan ? (
              <p className="text-xs text-muted-foreground">
                {selectedPlan.max_apps} apps · {selectedPlan.messages_limit.toLocaleString()} msgs
                {selectedPlan.webhooks_enabled ? " · webhooks" : ""}
                {selectedPlan.video_calls_enabled ? " · video" : ""}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="admin-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {SUBSCRIPTION_STATUSES.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {SUBSCRIPTION_STATUSES.find((item) => item.value === status)?.description}
            </p>
          </div>

          <div className="sm:col-span-2">
            <Button onClick={() => void handleSave()} disabled={!dirty || saving}>
              {saving ? "Saving…" : "Save subscription"}
            </Button>
          </div>
        </div>
      ) : (
        <p className="border-t border-border pt-4 text-sm text-muted-foreground">
          Platform admin role required to edit subscriptions.
        </p>
      )}
    </section>
  )
}
