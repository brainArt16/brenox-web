"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getAdminUser, updateAdminUser } from "@/lib/engine/admin"
import { getErrorMessage } from "@/lib/engine/errors"
import { useAuth } from "@/providers/auth-provider"
import { toast } from "sonner"
import type { AdminUser, PlatformRole } from "@/lib/types"

export default function AdminUserDetailPage() {
  const params = useParams()
  const userId = Number(params.id)
  const { user: currentUser } = useAuth()
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const canWrite = currentUser?.platform_role === "admin"
  const isSelf = currentUser?.id === userId

  function load() {
    setLoading(true)
    getAdminUser(userId)
      .then(setUser)
      .catch((error) => toast.error(getErrorMessage(error, "Failed to load user")))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!Number.isFinite(userId)) return
    load()
  }, [userId])

  async function handleRoleChange(platform_role: PlatformRole) {
    try {
      const updated = await updateAdminUser(userId, { platform_role })
      setUser(updated)
      toast.success("Role updated")
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update role"))
    }
  }

  async function handleSuspendToggle(suspended: boolean) {
    try {
      const updated = await updateAdminUser(userId, { suspended })
      setUser(updated)
      toast.success(suspended ? "User suspended" : "User unsuspended")
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update user"))
    }
  }

  if (loading) {
    return <Skeleton className="h-64 w-full rounded-xl" />
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">User not found.</p>
        <Button variant="outline" asChild>
          <Link href="/admin/users">Back to users</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={user.username}
        description={user.email}
        action={
          <Button variant="outline" asChild>
            <Link href="/admin/users">Back to users</Link>
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 max-w-2xl">
        <div className="rounded-xl border border-border p-6 space-y-4">
          <h2 className="font-medium">Account</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Platform role</dt>
              <dd>
                {canWrite && !isSelf ? (
                  <Select
                    value={user.platform_role}
                    onValueChange={(value) => void handleRoleChange(value as PlatformRole)}
                  >
                    <SelectTrigger className="h-8 w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="capitalize">{user.platform_role}</span>
                )}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Status</dt>
              <dd>
                <Badge variant={user.suspended ? "destructive" : "secondary"}>
                  {user.suspended ? "Suspended" : "Active"}
                </Badge>
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Joined</dt>
              <dd>{new Date(user.created_at).toLocaleString()}</dd>
            </div>
          </dl>
          {canWrite && !isSelf && (
            <Button
              variant={user.suspended ? "outline" : "destructive"}
              onClick={() => void handleSuspendToggle(!user.suspended)}
            >
              {user.suspended ? "Unsuspend" : "Suspend"}
            </Button>
          )}
        </div>

        <div className="rounded-xl border border-border p-6 space-y-4">
          <h2 className="font-medium">Usage</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Workspaces</dt>
              <dd>{user.workspace_count ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Apps</dt>
              <dd>{user.app_count ?? "—"}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
