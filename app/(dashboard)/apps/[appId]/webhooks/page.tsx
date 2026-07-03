"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Plus, Webhook, Trash2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { SecretRevealDialog } from "@/components/shared/secret-reveal-dialog"
import { DocLinkCard } from "@/components/shared/doc-link-card"
import { getApp, getWebhooks, createWebhook, deleteWebhook } from "@/lib/api"
import { WEBHOOK_EVENTS } from "@/lib/mock-data"
import type { App, Webhook as WebhookType } from "@/lib/types"
import { getErrorMessage } from "@/lib/engine/errors"
import { toast } from "sonner"

export default function AppWebhooksPage() {
  const params = useParams()
  const appId = Number(params.appId)
  const [app, setApp] = useState<App | null>(null)
  const [webhooks, setWebhooks] = useState<WebhookType[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [url, setUrl] = useState("")
  const [events, setEvents] = useState<string[]>([...WEBHOOK_EVENTS])
  const [creating, setCreating] = useState(false)
  const [newSecret, setNewSecret] = useState<WebhookType | null>(null)

  function load() {
    Promise.all([getApp(appId), getWebhooks(appId)])
      .then(([appData, wh]) => {
        setApp(appData)
        setWebhooks(wh)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (appId) load()
  }, [appId])

  function toggleEvent(event: string) {
    setEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    )
  }

  async function handleCreate() {
    if (!url.startsWith("https://")) {
      toast.error("Webhook URL must use HTTPS")
      return
    }
    if (events.length === 0) {
      toast.error("Select at least one event")
      return
    }

    setCreating(true)
    try {
      const wh = await createWebhook(appId, url, events)
      if (wh.secret) setNewSecret(wh)
      setDialogOpen(false)
      setUrl("")
      load()
      toast.success("Webhook created")
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to create webhook"))
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteWebhook(appId, id)
      toast.success("Webhook removed")
      load()
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to remove webhook"))
    }
  }

  if (loading) return <Skeleton className="h-64 w-full rounded-xl" />
  if (!app) return <Button asChild><Link href="/apps">Back</Link></Button>

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={app.name}
        title="Webhooks"
        description="Receive real-time events at your HTTPS endpoint with signed payloads."
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add webhook
              </Button>
            </DialogTrigger>
            <DialogContent className="border-border bg-card sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add webhook endpoint</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="wh-url">Endpoint URL</Label>
                  <Input
                    id="wh-url"
                    placeholder="https://yourapp.com/webhooks/brenox"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="font-mono bg-surface"
                  />
                </div>
                <div className="space-y-3 rounded-lg border border-border bg-surface p-4">
                  <Label>Events</Label>
                  {WEBHOOK_EVENTS.map((event) => (
                    <div key={event} className="flex items-center gap-2">
                      <Checkbox
                        id={event}
                        checked={events.includes(event)}
                        onCheckedChange={() => toggleEvent(event)}
                      />
                      <Label htmlFor={event} className="cursor-pointer font-mono text-sm font-normal">
                        {event}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => void handleCreate()} disabled={creating}>
                  Create webhook
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <DocLinkCard
        title="Verify signatures"
        description="Validate X-Brenox-Signature using your webhook signing secret."
        href="/docs#webhooks"
        icon={ShieldCheck}
      />

      {webhooks.length === 0 ? (
        <EmptyState
          icon={Webhook}
          title="No webhooks configured"
          description="Get notified when users are provisioned, channels created, or messages sent."
          action={
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add webhook
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>URL</TableHead>
                <TableHead>Events</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhooks.map((wh) => (
                <TableRow key={wh.id} className="border-border">
                  <TableCell className="max-w-xs truncate font-mono text-xs">{wh.url}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {wh.events.map((e) => (
                        <Badge key={e} variant="outline" className="font-mono text-xs">
                          {e}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(wh.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => void handleDelete(wh.id)}
                      aria-label="Delete webhook"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {newSecret?.secret && (
        <SecretRevealDialog
          open={Boolean(newSecret)}
          onOpenChange={(open) => !open && setNewSecret(null)}
          title="Webhook signing secret"
          description="Use this to verify webhook payloads from Brenox."
          secret={newSecret.secret}
          onConfirm={() => setNewSecret(null)}
        />
      )}
    </div>
  )
}
