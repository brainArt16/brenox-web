"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import {
  createAdminPlan,
  deleteAdminPlan,
  listAdminPlans,
  updateAdminPlan,
} from "@/lib/engine/billing"
import { getErrorMessage } from "@/lib/engine/errors"
import { useAuth } from "@/providers/auth-provider"
import { toast } from "sonner"
import type { AdminPlan } from "@/lib/types"

type PlanDraft = {
  name: string
  description: string
  price_cents: string
  stripe_price_id: string
  messages_limit: string
  connections_limit: string
  retention_days: string
  sort_order: string
  webhooks_enabled: boolean
  video_calls_enabled: boolean
  moderation_enabled: boolean
  is_active: boolean
  is_highlighted: boolean
}

function toDraft(plan: AdminPlan): PlanDraft {
  return {
    name: plan.name,
    description: plan.description ?? "",
    price_cents: String(plan.price_cents),
    stripe_price_id: plan.stripe_price_id ?? "",
    messages_limit: String(plan.messages_limit),
    connections_limit: String(plan.connections_limit),
    retention_days: String(plan.retention_days),
    sort_order: String(plan.sort_order ?? 0),
    webhooks_enabled: plan.webhooks_enabled,
    video_calls_enabled: plan.video_calls_enabled,
    moderation_enabled: plan.moderation_enabled,
    is_active: plan.is_active,
    is_highlighted: plan.is_highlighted ?? false,
  }
}

function PlanEditor({
  plan,
  canWrite,
  onSaved,
  onDeleted,
}: {
  plan: AdminPlan
  canWrite: boolean
  onSaved: () => void
  onDeleted: () => void
}) {
  const [draft, setDraft] = useState<PlanDraft>(() => toDraft(plan))
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setDraft(toDraft(plan))
  }, [plan])

  async function handleSave() {
    setSaving(true)
    try {
      await updateAdminPlan(plan.slug, {
        name: draft.name,
        description: draft.description,
        price_cents: Number(draft.price_cents),
        stripe_price_id: draft.stripe_price_id,
        messages_limit: Number(draft.messages_limit),
        connections_limit: Number(draft.connections_limit),
        retention_days: Number(draft.retention_days),
        sort_order: Number(draft.sort_order),
        webhooks_enabled: draft.webhooks_enabled,
        video_calls_enabled: draft.video_calls_enabled,
        moderation_enabled: draft.moderation_enabled,
        is_active: draft.is_active,
        is_highlighted: draft.is_highlighted,
      })
      toast.success(`Plan "${plan.slug}" updated`)
      onSaved()
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update plan"))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete plan "${plan.slug}"? This cannot be undone.`)) return
    try {
      await deleteAdminPlan(plan.slug)
      toast.success("Plan deleted")
      onDeleted()
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete plan"))
    }
  }

  return (
    <div className="rounded-xl border border-border p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold">{plan.name}</h3>
          <p className="font-mono text-sm text-muted-foreground">{plan.slug}</p>
        </div>
        <p className="text-sm text-muted-foreground">
          {plan.subscription_count} subscription{plan.subscription_count === 1 ? "" : "s"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={draft.name} disabled={!canWrite} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Price (cents)</Label>
          <Input value={draft.price_cents} disabled={!canWrite} onChange={(e) => setDraft({ ...draft, price_cents: e.target.value })} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Description</Label>
          <Input value={draft.description} disabled={!canWrite} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Stripe price ID</Label>
          <Input value={draft.stripe_price_id} disabled={!canWrite} onChange={(e) => setDraft({ ...draft, stripe_price_id: e.target.value })} placeholder="price_..." />
        </div>
        <div className="space-y-2">
          <Label>Messages / month</Label>
          <Input value={draft.messages_limit} disabled={!canWrite} onChange={(e) => setDraft({ ...draft, messages_limit: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Connections</Label>
          <Input value={draft.connections_limit} disabled={!canWrite} onChange={(e) => setDraft({ ...draft, connections_limit: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Retention (days)</Label>
          <Input value={draft.retention_days} disabled={!canWrite} onChange={(e) => setDraft({ ...draft, retention_days: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Sort order</Label>
          <Input value={draft.sort_order} disabled={!canWrite} onChange={(e) => setDraft({ ...draft, sort_order: e.target.value })} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {(
          [
            ["webhooks_enabled", "Webhooks"],
            ["video_calls_enabled", "Video calls"],
            ["moderation_enabled", "Moderation"],
            ["is_active", "Active (public)"],
            ["is_highlighted", "Highlighted on landing"],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className="flex items-center justify-between gap-4 rounded-lg border border-border px-3 py-2">
            <span className="text-sm">{label}</span>
            <Switch
              checked={draft[key]}
              disabled={!canWrite}
              onCheckedChange={(checked) => setDraft({ ...draft, [key]: checked })}
            />
          </div>
        ))}
      </div>

      {canWrite && (
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => void handleSave()} disabled={saving}>
            {saving ? "Saving…" : "Save plan"}
          </Button>
          {plan.subscription_count === 0 && (
            <Button variant="destructive" onClick={() => void handleDelete()}>
              Delete
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default function AdminPlansPage() {
  const { user } = useAuth()
  const [plans, setPlans] = useState<AdminPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newSlug, setNewSlug] = useState("")
  const [newName, setNewName] = useState("")
  const canWrite = user?.platform_role === "admin"

  function load() {
    setLoading(true)
    listAdminPlans()
      .then(setPlans)
      .catch((error) => toast.error(getErrorMessage(error, "Failed to load plans")))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  async function handleCreate() {
    if (!newSlug.trim() || !newName.trim()) {
      toast.error("Slug and name are required")
      return
    }
    setCreating(true)
    try {
      await createAdminPlan({
        slug: newSlug.trim().toLowerCase(),
        name: newName.trim(),
        price_cents: 1000,
        messages_limit: 50000,
        connections_limit: 500,
        retention_days: 30,
        is_active: true,
      })
      toast.success("Plan created")
      setNewSlug("")
      setNewName("")
      load()
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to create plan"))
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Plans"
        description="Control pricing, limits, feature toggles, and Stripe price IDs."
      />

      {canWrite && (
        <div className="rounded-xl border border-border p-6 space-y-4 max-w-xl">
          <h2 className="font-medium">Create plan</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={newSlug} onChange={(e) => setNewSlug(e.target.value)} placeholder="pro" />
            </div>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Pro" />
            </div>
          </div>
          <Button onClick={() => void handleCreate()} disabled={creating}>
            {creating ? "Creating…" : "Create plan"}
          </Button>
        </div>
      )}

      {loading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : (
        <div className="space-y-6">
          {plans.map((plan) => (
            <PlanEditor
              key={plan.slug}
              plan={plan}
              canWrite={canWrite}
              onSaved={load}
              onDeleted={load}
            />
          ))}
        </div>
      )}
    </div>
  )
}
