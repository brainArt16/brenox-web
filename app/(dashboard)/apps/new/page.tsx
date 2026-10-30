"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PageHeader } from "@/components/layout/page-header"
import { Panel } from "@/components/shared/panel"
import { createApp } from "@/lib/api"
import { getErrorMessage } from "@/lib/engine/errors"
import { toast } from "sonner"

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export default function NewAppPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planFromUrl = searchParams.get("plan")
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [slugTouched, setSlugTouched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("App name is required")
      return
    }

    setIsLoading(true)
    try {
      if (planFromUrl || sessionStorage.getItem("brenox_selected_plan")) {
        sessionStorage.removeItem("brenox_selected_plan")
      }
      const app = await createApp(name.trim(), slug.trim() || slugify(name))
      toast.success("App created — generate a sandbox key next")
      router.replace(`/apps/${app.id}/keys`)
    } catch (error) {
      const message = getErrorMessage(error, "Failed to create app")
      toast.error(message)
      if (message.toLowerCase().includes("app limit")) {
        router.push("/settings/billing")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground">
        <Link href="/apps">
          <ArrowLeft className="mr-2 h-4 w-4" />
          All apps
        </Link>
      </Button>

      <PageHeader
        eyebrow="New integration"
        title="Create app"
        description="Provisions live + sandbox workspaces, API keys, and webhook endpoints automatically."
        className="border-none pb-0"
      />

      <div className="flex gap-3 rounded-xl border border-border bg-surface-elevated/80 px-4 py-3.5">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <p className="text-sm leading-relaxed text-muted-foreground">
          After creation you&apos;ll create a sandbox key — the fastest path to your first SDK
          integration.
        </p>
      </div>

      <Panel>
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">App name</Label>
            <Input
              id="name"
              placeholder="My Integration"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (!slugTouched) setSlug(slugify(e.target.value))
              }}
              className="bg-surface"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              placeholder="my-integration"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true)
                setSlug(e.target.value)
              }}
              className="bg-surface font-mono"
            />
            <p className="text-xs text-muted-foreground">Lowercase letters, numbers, and hyphens.</p>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full" size="lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating…
              </>
            ) : (
              "Create app"
            )}
          </Button>
        </form>
      </Panel>
    </div>
  )
}
