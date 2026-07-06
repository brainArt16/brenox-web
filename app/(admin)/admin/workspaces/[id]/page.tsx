"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
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
  getAdminWorkspace,
  listAdminWorkspaceMembers,
} from "@/lib/engine/admin"
import { getErrorMessage } from "@/lib/engine/errors"
import { toast } from "sonner"
import type { AdminWorkspace, AdminWorkspaceMember } from "@/lib/types"

export default function AdminWorkspaceDetailPage() {
  const params = useParams()
  const workspaceId = Number(params.id)
  const [workspace, setWorkspace] = useState<AdminWorkspace | null>(null)
  const [members, setMembers] = useState<AdminWorkspaceMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!Number.isFinite(workspaceId)) return

    setLoading(true)
    Promise.all([
      getAdminWorkspace(workspaceId),
      listAdminWorkspaceMembers(workspaceId),
    ])
      .then(([ws, memberList]) => {
        setWorkspace(ws)
        setMembers(memberList)
      })
      .catch((error) => toast.error(getErrorMessage(error, "Failed to load workspace")))
      .finally(() => setLoading(false))
  }, [workspaceId])

  if (loading) {
    return <Skeleton className="h-64 w-full rounded-xl" />
  }

  if (!workspace) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">Workspace not found.</p>
        <Button variant="outline" asChild>
          <Link href="/admin/workspaces">Back to workspaces</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={workspace.name}
        description={`/${workspace.slug}`}
        action={
          <Button variant="outline" asChild>
            <Link href="/admin/workspaces">Back to workspaces</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3 max-w-xl text-sm">
        <div className="rounded-xl border border-border p-4">
          <p className="text-muted-foreground">Owner ID</p>
          <p className="font-medium mt-1">
            <Link href={`/admin/users/${workspace.owner_id}`} className="hover:underline">
              {workspace.owner_id}
            </Link>
          </p>
        </div>
        <div className="rounded-xl border border-border p-4">
          <p className="text-muted-foreground">Members</p>
          <p className="font-medium mt-1">{workspace.member_count ?? members.length}</p>
        </div>
        <div className="rounded-xl border border-border p-4">
          <p className="text-muted-foreground">Channels</p>
          <p className="font-medium mt-1">{workspace.channel_count ?? "—"}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-medium">Members</h2>
        <div className="rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <Link
                      href={`/admin/users/${member.user_id}`}
                      className="hover:underline"
                    >
                      <div className="font-medium">{member.username}</div>
                      <div className="text-sm text-muted-foreground">{member.email}</div>
                    </Link>
                  </TableCell>
                  <TableCell className="capitalize">{member.role}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(member.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
