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
import { listAdminApps } from "@/lib/engine/admin"
import { getErrorMessage } from "@/lib/engine/errors"
import { toast } from "sonner"
import type { AdminApp } from "@/lib/types"

export default function AdminAppsPage() {
  const [apps, setApps] = useState<AdminApp[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listAdminApps()
      .then(setApps)
      .catch((error) => toast.error(getErrorMessage(error, "Failed to load apps")))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-8">
      <PageHeader
        title="Apps"
        description="Developer apps across all accounts."
      />

      {loading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : (
        <div className="rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>App</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Workspace</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apps.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>
                    <Link href={`/admin/apps/${app.id}`} className="hover:underline">
                      <div className="font-medium">{app.name}</div>
                      <div className="font-mono text-sm text-muted-foreground">{app.slug}</div>
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm">
                    <Link href={`/admin/users/${app.owner_id}`} className="hover:underline">
                      {app.owner_email}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/workspaces/${app.workspace_id}`} className="hover:underline">
                      {app.workspace_id}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(app.created_at).toLocaleDateString()}
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
