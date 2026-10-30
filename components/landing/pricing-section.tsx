"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { listPlans } from "@/lib/engine/billing"
import { cn } from "@/lib/utils"
import type { Plan } from "@/lib/types"

function planFeatures(plan: Plan): string[] {
  const appsLabel =
    plan.max_apps < 0 ? "Unlimited apps" : `${plan.max_apps} app${plan.max_apps === 1 ? "" : "s"}`
  const features = [
    appsLabel,
    `${plan.messages_limit.toLocaleString()} shared messages/month`,
    `${plan.connections_limit.toLocaleString()} concurrent connections`,
    `${plan.retention_days}-day message history`,
  ]
  if (plan.webhooks_enabled) features.push("Custom webhooks")
  if (plan.video_calls_enabled) {
    const mins =
      plan.video_minutes_limit > 0
        ? `${plan.video_minutes_limit.toLocaleString()} video minutes/month`
        : "Video calls"
    features.push(mins)
    if (plan.max_call_participants > 0) {
      features.push(`Up to ${plan.max_call_participants} call participants`)
    }
  }
  if (plan.moderation_enabled) features.push("Moderation tools")
  return features
}

export function PricingSection() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listPlans()
      .then(setPlans)
      .catch(() => setPlans([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="pricing" className="scroll-mt-20 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Pricing that scales with you
          </h2>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            Start free. Upgrade when you need more apps, messages, or video minutes — shared across
            your account.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
          </div>
        ) : plans.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            Plans unavailable right now.{" "}
            <Link href="/register" className="underline underline-offset-4">
              Create an account
            </Link>{" "}
            to continue.
          </p>
        ) : (
          <div
            className={cn(
              "mx-auto grid max-w-5xl gap-4",
              plans.length >= 3
                ? "md:grid-cols-3"
                : plans.length === 2
                  ? "md:grid-cols-2"
                  : "md:grid-cols-1"
            )}
          >
            {plans.map((plan) => {
              const isFree = plan.price_cents === 0
              return (
                <div
                  key={plan.slug}
                  className={cn(
                    "relative flex flex-col overflow-hidden rounded-2xl border bg-card p-6 shadow-[var(--card-shadow)]",
                    plan.is_highlighted
                      ? "border-foreground/30 ring-1 ring-foreground/10 md:-mt-2 md:mb-2 md:p-7"
                      : "border-border"
                  )}
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">{plan.name}</h3>
                      {plan.description && (
                        <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                      )}
                    </div>
                    {plan.is_highlighted && <Badge variant="secondary">Popular</Badge>}
                  </div>

                  <div className="mb-6">
                    <span className="text-4xl font-semibold tracking-tight">{plan.price_display}</span>
                    {!isFree && <span className="text-muted-foreground">/month</span>}
                  </div>

                  <ul className="mb-8 flex-1 space-y-2.5">
                    {planFeatures(plan).map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={plan.is_highlighted ? "default" : "outline"}
                    asChild
                  >
                    <Link href={`/register?plan=${plan.slug}`}>
                      {isFree ? "Start free" : `Get ${plan.name}`}
                    </Link>
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
