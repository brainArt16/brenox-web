"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  getAdminApp,
  listAdminAppKeys,
  revokeAdminAppKey,
} from "@/lib/engine/admin"
import { AdminSubscriptionEditor } from "@/components/admin/admin-subscription-editor"
import { getErrorMessage } from "@/lib/engine/errors"
import { useAuth } from "@/providers/auth-provider"
import { toast } from "sonner"
import type { AdminApp, ApiKey } from "@/lib/types"

export default function AdminAppDetailPage() {
  const params = useParams()
  const appId = Number(params.appId)
  const { user: currentUser } = useAuth()
  const [app, setApp] = useState<AdminApp | null>(null)
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const canWrite = currentUser?.platform_role === "admin"

  function loadKeys() {
    return listAdminAppKeys(appId).then(setKeys)
  }

  useEffect(() => {
    if (!Number.isFinite(appId)) return

    setLoading(true)
    Promise.all([getAdminApp(appId), listAdminAppKeys(appId)])
      .then(([appData, keyList]) => {
        setApp(appData)
        setKeys(keyList)
      })
      .catch((error) => toast.error(getErrorMessage(error, "Failed to load app")))
      .finally(() => setLoading(false))
  }, [appId])

  async function handleRevoke(keyId: number) {
    if (!confirm("Revoke this API key immediately? This cannot be undone.")) return

    try {
      await revokeAdminAppKey(appId, keyId)
      toast.success("API key revoked")
      await loadKeys()
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to revoke key"))
    }
  }

  if (loading) {
    return <Skeleton className="h-64 w-full rounded-xl" />
  }

  if (!app) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">App not found.</p>
        <Button variant="outline" asChild>
          <Link href="/admin/apps">Back to apps</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={app.name}
        description={app.slug}
        action={
          <Button variant="outline" asChild>
            <Link href="/admin/apps">Back to apps</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3 max-w-2xl text-sm">
        <div className="rounded-xl border border-border p-4">
          <p className="text-muted-foreground">Owner</p>
          <p className="font-medium mt-1">
            <Link href={`/admin/users/${app.owner_id}`} className="hover:underline">
              {app.owner_email}
            </Link>
          </p>
        </div>
        <div className="rounded-xl border border-border p-4">
          <p className="text-muted-foreground">Workspace</p>
          <p className="font-medium mt-1">
            <Link href={`/admin/workspaces/${app.workspace_id}`} className="hover:underline">
              #{app.workspace_id}
            </Link>
          </p>
        </div>
        <div className="rounded-xl border border-border p-4">
          <p className="text-muted-foreground">Created</p>
          <p className="font-medium mt-1">
            {new Date(app.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <AdminSubscriptionEditor appId={appId} canWrite={canWrite} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">API keys</h2>
          {canWrite && (
            <p className="text-sm text-muted-foreground">
              Emergency revoke — admin only
            </p>
          )}
        </div>
        <div className="rounded-xl border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Prefix</TableHead>
                <TableHead>Environment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last used</TableHead>
                {canWrite && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell className="font-medium">{key.name}</TableCell>
                  <TableCell className="font-mono text-xs">{key.key_prefix}…</TableCell>
                  <TableCell>
                    <Badge variant="outline">{key.is_sandbox ? "Sandbox" : "Live"}</Badge>
                  </TableCell>
                  <TableCell>
                    {key.revoked_at ? (
                      <Badge variant="destructive">Revoked</Badge>
                    ) : (
                      <Badge variant="secondary">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {key.last_used_at
                      ? new Date(key.last_used_at).toLocaleString()
                      : "Never"}
                  </TableCell>
                  {canWrite && (
                    <TableCell className="text-right">
                      {!key.revoked_at && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => void handleRevoke(key.id)}
                        >
                          Revoke
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
