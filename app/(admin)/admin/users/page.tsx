"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { listAdminUsers, updateAdminUser } from "@/lib/engine/admin"
import { getErrorMessage } from "@/lib/engine/errors"
import { useAuth } from "@/providers/auth-provider"
import { toast } from "sonner"
import type { AdminUser, PlatformRole } from "@/lib/types"

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const canWrite = currentUser?.platform_role === "admin"

  function load(query = search) {
    setLoading(true)
    listAdminUsers(query)
      .then(setUsers)
      .catch((error) => toast.error(getErrorMessage(error, "Failed to load users")))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  async function handleRoleChange(userId: number, platform_role: PlatformRole) {
    try {
      await updateAdminUser(userId, { platform_role })
      toast.success("Role updated")
      load()
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update role"))
    }
  }

  async function handleSuspendToggle(userId: number, suspended: boolean) {
    try {
      await updateAdminUser(userId, { suspended })
      toast.success(suspended ? "User suspended" : "User unsuspended")
      load()
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update user"))
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Users"
        description="Platform accounts across all tenants."
      />

      <div className="flex gap-2 max-w-md">
        <Input
          placeholder="Search by email or username"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
        />
        <Button variant="outline" onClick={() => load()}>
          Search
        </Button>
      </div>

      {loading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : (
        <div className="rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                {canWrite && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-medium">{user.username}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </TableCell>
                  <TableCell>
                    {canWrite && user.id !== currentUser?.id ? (
                      <Select
                        value={user.platform_role}
                        onValueChange={(value) =>
                          void handleRoleChange(user.id, value as PlatformRole)
                        }
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
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.suspended ? "destructive" : "secondary"}>
                      {user.suspended ? "Suspended" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  {canWrite && (
                    <TableCell className="text-right">
                      {user.id !== currentUser?.id && (
                        <Button
                          size="sm"
                          variant={user.suspended ? "outline" : "destructive"}
                          onClick={() => void handleSuspendToggle(user.id, !user.suspended)}
                        >
                          {user.suspended ? "Unsuspend" : "Suspend"}
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
