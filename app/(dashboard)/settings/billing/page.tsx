"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import {
  Check,
  CreditCard,
  Loader2,
  MessageSquare,
  Video,
  Boxes,
} from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { Panel } from "@/components/shared/panel"
import { UsageMeter } from "@/components/shared/usage-meter"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  createBillingCheckout,
  getAccountBilling,
  listPlans,
} from "@/lib/engine/billing"
import { getErrorMessage } from "@/lib/engine/errors"
import { cn } from "@/lib/utils"
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
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!billing) {
    return <p className="text-muted-foreground">Unable to load billing.</p>
  }

  const priceLabel =
    billing.subscription.price_cents === 0
      ? "Free"
      : `$${(billing.subscription.price_cents / 100).toFixed(0)}/month`

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Account"
        title="Billing"
        description="Shared message pool, video minutes, and included apps across every project on this account."
        action={
          <Button variant="outline" asChild>
            <Link href="/settings/profile">Profile</Link>
          </Button>
        }
      />

      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Current plan
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-semibold tracking-tight">
                {billing.subscription.plan_name}
              </h2>
              <Badge
                variant={billing.subscription.needs_payment ? "destructive" : "secondary"}
                className="capitalize"
              >
                {billing.subscription.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{priceLabel}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-surface/60 px-3 py-2">
              <p className="text-xs text-muted-foreground">Apps</p>
              <p className="mt-0.5 font-medium tabular-nums">
                {billing.apps_count}/{billing.apps_limit}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-surface/60 px-3 py-2">
              <p className="text-xs text-muted-foreground">Messages</p>
              <p className="mt-0.5 font-medium tabular-nums">
                {billing.subscription.messages_limit.toLocaleString()}/mo
              </p>
            </div>
            <div className="rounded-lg border border-border bg-surface/60 px-3 py-2 col-span-2 sm:col-span-1">
              <p className="text-xs text-muted-foreground">Video</p>
              <p className="mt-0.5 font-medium tabular-nums">
                {billing.subscription.video_calls_enabled
                  ? `${billing.subscription.video_minutes_limit.toLocaleString()} min`
                  : "Off"}
              </p>
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="Usage this month" description="Shared across all apps on your account.">
        <div className="space-y-6">
          <UsageMeter
            label="Messages"
            used={billing.usage.messages_this_month}
            limit={billing.usage.messages_limit}
            icon={MessageSquare}
            hint="All apps combined"
          />
          {billing.subscription.video_calls_enabled && (
            <UsageMeter
              label="Video minutes"
              used={billing.usage.video_minutes_this_month}
              limit={billing.usage.video_minutes_limit}
              unit="min"
              icon={Video}
              hint={
                billing.subscription.max_call_participants > 0
                  ? `Up to ${billing.subscription.max_call_participants} participants per call`
                  : undefined
              }
            />
          )}
          <UsageMeter
            label="Apps"
            used={billing.apps_count}
            limit={billing.apps_limit}
            icon={Boxes}
            hint="Included in your plan"
          />
        </div>
      </Panel>

      {billing.app_usage.length > 0 && (
        <Panel title="Usage by app">
          <ul className="divide-y divide-border">
            {billing.app_usage.map((row) => (
              <li key={row.app_id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <Link
                  href={`/apps/${row.app_id}`}
                  className="truncate text-sm font-medium hover:underline"
                >
                  {row.app_name}
                </Link>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {row.messages_this_month.toLocaleString()} msgs
                  {row.video_minutes_this_month > 0
                    ? ` · ${row.video_minutes_this_month.toLocaleString()} vid min`
                    : ""}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold">Change plan</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Upgrades apply to the whole account — every app shares the new limits.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = billing.subscription.plan_slug === plan.slug
            const isFree = plan.price_cents === 0
            return (
              <div
                key={plan.slug}
                className={cn(
                  "relative flex flex-col rounded-xl border bg-card p-5 shadow-[var(--card-shadow)]",
                  isCurrent ? "border-foreground/30 ring-1 ring-foreground/10" : "border-border"
                )}
              >
                {isCurrent && (
                  <Badge className="absolute right-4 top-4" variant="secondary">
                    Current
                  </Badge>
                )}
                <div className="space-y-1 pr-16">
                  <p className="font-semibold">{plan.name}</p>
                  <p className="text-2xl font-semibold tracking-tight">
                    {plan.price_display}
                    {!isFree && (
                      <span className="text-sm font-normal text-muted-foreground">/mo</span>
                    )}
                  </p>
                </div>
                <ul className="mt-4 flex-1 space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-foreground" />
                    {plan.max_apps} apps
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-foreground" />
                    {plan.messages_limit.toLocaleString()} messages/mo
                  </li>
                  {plan.video_calls_enabled && (
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-foreground" />
                      {plan.video_minutes_limit.toLocaleString()} video min
                      {plan.max_call_participants > 0
                        ? ` · ${plan.max_call_participants} pax`
                        : ""}
                    </li>
                  )}
                </ul>
                <Button
                  size="sm"
                  className="mt-5 w-full"
                  variant={isCurrent ? "secondary" : "default"}
                  disabled={isCurrent || checkoutPlan === plan.slug}
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
