"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { listAdminWorkspaces } from "@/lib/engine/admin"
import { getErrorMessage } from "@/lib/engine/errors"
import { toast } from "sonner"
import type { AdminWorkspace } from "@/lib/types"

export default function AdminWorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<AdminWorkspace[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listAdminWorkspaces()
      .then(setWorkspaces)
      .catch((error) => toast.error(getErrorMessage(error, "Failed to load workspaces")))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-8">
      <PageHeader
        title="Workspaces"
        description="All workspaces on the platform."
      />

      {loading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : (
        <div className="rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Owner ID</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workspaces.map((workspace) => (
                <TableRow key={workspace.id}>
                  <TableCell className="font-medium">
                    <Link href={`/admin/workspaces/${workspace.id}`} className="hover:underline">
                      {workspace.name}
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{workspace.slug}</TableCell>
                  <TableCell>
                    <Link href={`/admin/users/${workspace.owner_id}`} className="hover:underline">
                      {workspace.owner_id}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(workspace.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
