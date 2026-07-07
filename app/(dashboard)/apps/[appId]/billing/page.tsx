"use client"

import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { CreditCard, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  createBillingCheckout,
  getAppBilling,
  listPlans,
} from "@/lib/engine/billing"
import { getErrorMessage } from "@/lib/engine/errors"
import { toast } from "sonner"
import type { AppBilling, Plan } from "@/lib/types"

export default function AppBillingPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const appId = Number(params.appId)
  const [billing, setBilling] = useState<AppBilling | null>(null)
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null)

  useEffect(() => {
    if (!Number.isFinite(appId)) return
    Promise.all([getAppBilling(appId), listPlans()])
      .then(([billingData, planList]) => {
        setBilling(billingData)
        setPlans(planList)
      })
      .catch((error) => toast.error(getErrorMessage(error, "Failed to load billing")))
      .finally(() => setLoading(false))
  }, [appId])

  useEffect(() => {
    if (searchParams.get("session_id") && billing) {
      toast.success("Subscription updated — thank you!")
    }
  }, [searchParams, billing])

  async function handleCheckout(planSlug: string) {
    setCheckoutPlan(planSlug)
    try {
      const { url } = await createBillingCheckout(appId, planSlug)
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
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">Billing not found for this app.</p>
        <Button variant="outline" asChild>
          <Link href={`/apps/${appId}`}>Back to app</Link>
        </Button>
      </div>
    )
  }

  const usagePct =
    billing.usage.messages_limit > 0
      ? Math.min(100, (billing.usage.messages_this_month / billing.usage.messages_limit) * 100)
      : 0

  return (
    <div className="space-y-8">
      <PageHeader
        title="Billing"
        description="Plan, usage, and subscription for this app."
        action={
          <Button variant="outline" asChild>
            <Link href={`/apps/${appId}`}>Back to app</Link>
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
          ${(billing.subscription.price_cents / 100).toFixed(0)}/month ·{" "}
          {billing.subscription.messages_limit.toLocaleString()} messages ·{" "}
          {billing.subscription.connections_limit.toLocaleString()} connections
        </p>
      </div>

      <div className="rounded-xl border border-border p-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Messages this month</span>
          <span>
            {billing.usage.messages_this_month.toLocaleString()} /{" "}
            {billing.usage.messages_limit.toLocaleString()}
          </span>
        </div>
        <Progress value={usagePct} className="h-2" />
      </div>

      <div className="space-y-4">
        <h2 className="font-medium">Change plan</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.slug} className="rounded-xl border border-border p-4 space-y-3">
              <div>
                <p className="font-medium">{plan.name}</p>
                <p className="text-2xl font-semibold">{plan.price_display}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
              </div>
              <p className="text-xs text-muted-foreground">
                {plan.messages_limit.toLocaleString()} msgs · {plan.connections_limit.toLocaleString()} conn
              </p>
              <Button
                size="sm"
                className="w-full"
                variant={billing.subscription.plan_slug === plan.slug ? "secondary" : "default"}
                disabled={
                  billing.subscription.plan_slug === plan.slug ||
                  checkoutPlan === plan.slug
                }
                onClick={() => void handleCheckout(plan.slug)}
              >
                {checkoutPlan === plan.slug ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : billing.subscription.plan_slug === plan.slug ? (
                  "Current plan"
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Subscribe
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
