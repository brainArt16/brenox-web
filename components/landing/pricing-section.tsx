"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { listPlans } from "@/lib/engine/billing"
import type { Plan } from "@/lib/types"

function planFeatures(plan: Plan): string[] {
  const features = [
    `${plan.messages_limit.toLocaleString()} messages/month`,
    `${plan.connections_limit.toLocaleString()} concurrent connections`,
    `${plan.retention_days}-day message history`,
  ]
  if (plan.webhooks_enabled) features.push("Custom webhooks")
  if (plan.video_calls_enabled) features.push("Video calls")
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
    <section id="pricing" className="py-24 scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-muted-foreground text-lg">
            Pick the plan that fits your stage. All plans include SDK access, UI Kit, and realtime infrastructure.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className={`grid gap-6 max-w-5xl mx-auto ${plans.length >= 3 ? "md:grid-cols-3" : plans.length === 2 ? "md:grid-cols-2" : "md:grid-cols-1"}`}>
            {plans.map((plan) => (
              <div
                key={plan.slug}
                className={`rounded-xl border p-6 ${
                  plan.is_highlighted
                    ? "border-primary bg-card shadow-lg shadow-primary/10"
                    : "border-border bg-card"
                }`}
              >
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
                  {plan.description && (
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  )}
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price_display}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {planFeatures(plan).map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-0.5">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.is_highlighted ? "default" : "outline"}
                  asChild
                >
                  <Link href={`/register?plan=${plan.slug}`}>Get {plan.name}</Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
