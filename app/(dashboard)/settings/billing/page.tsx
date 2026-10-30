"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { CreditCard, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  createBillingCheckout,
  getAccountBilling,
  listPlans,
} from "@/lib/engine/billing"
import { getErrorMessage } from "@/lib/engine/errors"
import { toast } from "sonner"
import type { AccountBilling, Plan } from "@/lib/types"

export default function SettingsBillingPage() {
  const searchParams = useSearchParams()
  const [billing, setBilling] = useState<AccountBilling | null>(null)
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([getAccountBilling(), listPlans()])
      .then(([billingData, planList]) => {
        setBilling(billingData)
        setPlans(planList)
      })
      .catch((error) => toast.error(getErrorMessage(error, "Failed to load billing")))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (searchParams.get("session_id") && billing) {
      toast.success("Subscription updated — thank you!")
    }
  }, [searchParams, billing])

  async function handleCheckout(planSlug: string) {
    const plan = plans.find((p) => p.slug === planSlug)
    if (plan && plan.price_cents === 0) {
      toast.message("Starter is already included free on your account")
      return
    }
    setCheckoutPlan(planSlug)
    try {
      const { url } = await createBillingCheckout(planSlug)
      window.location.href = url
    } catch (error) {
      toast.error(getErrorMessage(error, "Checkout unavailable — contact support"))
      setCheckoutPlan(null)
    }
  }

  if (loading) {
    return <Skeleton className="h-64 w-full rounded-xl" />
  }

  if (!billing) {
    return <p className="text-muted-foreground">Unable to load billing.</p>
  }

  const usagePct =
    billing.usage.messages_limit > 0
      ? Math.min(100, (billing.usage.messages_this_month / billing.usage.messages_limit) * 100)
      : 0
  const videoPct =
    billing.usage.video_minutes_limit > 0
      ? Math.min(
          100,
          (billing.usage.video_minutes_this_month / billing.usage.video_minutes_limit) * 100
        )
      : 0

  const priceLabel =
    billing.subscription.price_cents === 0
      ? "Free"
      : `$${(billing.subscription.price_cents / 100).toFixed(0)}/month`

  return (
    <div className="space-y-8">
      <PageHeader
        title="Billing"
        description="Account plan, shared message pool, video minutes, and included apps."
        action={
          <Button variant="outline" asChild>
            <Link href="/settings/profile">Profile</Link>
          </Button>
        }
      />

      <div className="rounded-xl border border-border p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Current plan</p>
            <p className="text-xl font-semibold">{billing.subscription.plan_name}</p>
          </div>
          <Badge variant={billing.subscription.needs_payment ? "destructive" : "secondary"}>
            {billing.subscription.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {priceLabel} · {billing.subscription.messages_limit.toLocaleString()} shared messages/mo ·{" "}
          {billing.apps_count}/{billing.apps_limit} apps
          {billing.subscription.video_calls_enabled
            ? ` · ${billing.subscription.video_minutes_limit.toLocaleString()} video min`
            : " · video off"}
        </p>
      </div>

      <div className="rounded-xl border border-border p-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Messages this month (all apps)</span>
          <span>
            {billing.usage.messages_this_month.toLocaleString()} /{" "}
            {billing.usage.messages_limit.toLocaleString()}
          </span>
        </div>
        <Progress value={usagePct} className="h-2" />
      </div>

      {billing.subscription.video_calls_enabled && (
        <div className="rounded-xl border border-border p-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Video minutes this month</span>
            <span>
              {billing.usage.video_minutes_this_month.toLocaleString()} /{" "}
              {billing.usage.video_minutes_limit > 0
                ? billing.usage.video_minutes_limit.toLocaleString()
                : "∞"}
            </span>
          </div>
          {billing.usage.video_minutes_limit > 0 && (
            <Progress value={videoPct} className="h-2" />
          )}
          {billing.subscription.max_call_participants > 0 && (
            <p className="text-xs text-muted-foreground">
              Up to {billing.subscription.max_call_participants} participants per call
            </p>
          )}
        </div>
      )}

      {billing.app_usage.length > 0 && (
        <div className="rounded-xl border border-border p-6 space-y-3">
          <h2 className="font-medium">Usage by app</h2>
          <ul className="space-y-2 text-sm">
            {billing.app_usage.map((row) => (
              <li key={row.app_id} className="flex justify-between gap-4">
                <Link href={`/apps/${row.app_id}`} className="truncate hover:underline">
                  {row.app_name}
                </Link>
                <span className="shrink-0 text-muted-foreground tabular-nums">
                  {row.messages_this_month.toLocaleString()} msgs
                  {row.video_minutes_this_month > 0
                    ? ` · ${row.video_minutes_this_month.toLocaleString()} vid min`
                    : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="font-medium">Change plan</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = billing.subscription.plan_slug === plan.slug
            const isFree = plan.price_cents === 0
            return (
              <div key={plan.slug} className="space-y-3 rounded-xl border border-border p-4">
                <div>
                  <p className="font-medium">{plan.name}</p>
                  <p className="text-2xl font-semibold">
                    {plan.price_display}
                    {!isFree && (
                      <span className="text-sm font-normal text-muted-foreground">/mo</span>
                    )}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {plan.max_apps} apps · {plan.messages_limit.toLocaleString()} msgs
                  {plan.video_calls_enabled
                    ? ` · ${plan.video_minutes_limit.toLocaleString()} vid min`
                    : ""}
                </p>
                <Button
                  size="sm"
                  className="w-full"
                  variant={isCurrent ? "secondary" : "default"}
                  disabled={isCurrent || checkoutPlan === plan.slug || (isFree && isCurrent)}
                  onClick={() => void handleCheckout(plan.slug)}
                >
                  {checkoutPlan === plan.slug ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isCurrent ? (
                    "Current plan"
                  ) : isFree ? (
                    "Included free"
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Upgrade
                    </>
                  )}
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
