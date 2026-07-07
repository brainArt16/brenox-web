"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Plus, Key, ShieldAlert, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { PageHeader } from "@/components/layout/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { SecretRevealDialog } from "@/components/shared/secret-reveal-dialog"
import { DocLinkCard } from "@/components/shared/doc-link-card"
import { getApp, getApiKeys, createApiKey, revokeApiKey } from "@/lib/api"
import type { ApiKey, ApiKeyCreated, App } from "@/lib/types"
import { getErrorMessage } from "@/lib/engine/errors"
import { toast } from "sonner"

export default function AppKeysPage() {
  const params = useParams()
  const appId = Number(params.appId)
  const [app, setApp] = useState<App | null>(null)
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [keyName, setKeyName] = useState("")
  const [isSandbox, setIsSandbox] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newSecret, setNewSecret] = useState<ApiKeyCreated | null>(null)
  const [revokeId, setRevokeId] = useState<number | null>(null)

  function load() {
    Promise.all([getApp(appId), getApiKeys(appId)])
      .then(([appData, keyData]) => {
        setApp(appData)
        setKeys(keyData)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (appId) load()
  }, [appId])

  async function handleCreate() {
    setCreating(true)
    try {
      const created = await createApiKey(appId, keyName || (isSandbox ? "Sandbox" : "Production"), isSandbox)
      setNewSecret(created)
      setDialogOpen(false)
      setKeyName("")
      load()
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to create key"))
    } finally {
      setCreating(false)
    }
  }

  async function handleRevoke() {
    if (!revokeId) return
    await revokeApiKey(appId, revokeId)
    toast.success("Key revoked")
    setRevokeId(null)
    load()
  }

  if (loading) return <Skeleton className="h-64 w-full rounded-xl" />

  if (!app) {
    return (
      <Button asChild>
        <Link href="/apps">Back to apps</Link>
      </Button>
    )
  }

  const activeCount = keys.filter((k) => !k.revoked_at).length

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={app.name}
        title="API Keys"
        description="Server-side keys for BrenoxServer. Never expose these in client apps."
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create key
              </Button>
            </DialogTrigger>
            <DialogContent className="border-border bg-card">
              <DialogHeader>
                <DialogTitle>Create API key</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="key-name">Name</Label>
                  <Input
                    id="key-name"
                    placeholder="e.g. CI, staging"
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    className="bg-surface"
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border bg-surface p-4">
                  <div>
                    <Label>Sandbox key</Label>
                    <p className="text-xs text-muted-foreground">Use bx_test_* for development</p>
                  </div>
                  <Switch checked={isSandbox} onCheckedChange={setIsSandbox} />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => void handleCreate()} disabled={creating}>
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <DocLinkCard
          title="BrenoxServer"
          description="Use your key with the server SDK on your backend."
          href="/docs?sdk=typescript#server"
          icon={BookOpen}
        />
        <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <div>
            <p className="text-sm font-medium">{activeCount} active key{activeCount !== 1 ? "s" : ""}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Revoke keys you no longer use. Secrets are shown once at creation.
            </p>
          </div>
        </div>
      </div>

      {keys.length === 0 ? (
        <EmptyState
          icon={Key}
          title="No API keys yet"
          description="Create a sandbox key to test BrenoxServer in the Sandbox tab."
          action={
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create sandbox key
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Prefix</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last used</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((key) => {
                const revoked = Boolean(key.revoked_at)
                return (
                  <TableRow
                    key={key.id}
                    className={`border-border ${revoked ? "opacity-50" : ""}`}
                  >
                    <TableCell className="font-medium">{key.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{key.key_prefix}</TableCell>
                    <TableCell>
                      {key.is_sandbox ? (
                        <Badge className="border-warning/30 bg-warning/20 text-warning">Sandbox</Badge>
                      ) : (
                        <Badge className="border-primary/50 bg-primary/30 text-foreground">Live</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(key.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {key.expires_at ? new Date(key.expires_at).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell>
                      {revoked ? (
                        <Badge variant="outline" className="text-muted-foreground">Revoked</Badge>
                      ) : (
                        <Badge className="bg-success/20 text-success">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {!revoked && (
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setRevokeId(key.id)}>
                          Revoke
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {newSecret && (
        <SecretRevealDialog
          open={Boolean(newSecret)}
          onOpenChange={(open) => !open && setNewSecret(null)}
          title="API key created"
          description="Copy your key now. You won't be able to see it again."
          secret={newSecret.secret}
          onConfirm={() => setNewSecret(null)}
        />
      )}

      <AlertDialog open={revokeId !== null} onOpenChange={(open) => !open && setRevokeId(null)}>
        <AlertDialogContent className="border-border bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke API key?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. Applications using this key will stop working immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => void handleRevoke()} className="bg-destructive text-destructive-foreground">
              Revoke
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
