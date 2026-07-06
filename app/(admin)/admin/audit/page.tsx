"use client"

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
import { listAdminAuditLogs } from "@/lib/engine/admin"
import { getErrorMessage } from "@/lib/engine/errors"
import { toast } from "sonner"
import type { AdminAuditLog } from "@/lib/types"

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AdminAuditLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listAdminAuditLogs()
      .then(setLogs)
      .catch((error) => toast.error(getErrorMessage(error, "Failed to load audit logs")))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-8">
      <PageHeader
        title="Audit logs"
        description="Recent platform HTTP activity recorded by the engine."
      />

      {loading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : (
        <div className="rounded-xl border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Path</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(log.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{log.action}</TableCell>
                  <TableCell>{log.method}</TableCell>
                  <TableCell className="max-w-xs truncate font-mono text-xs">{log.path}</TableCell>
                  <TableCell>{log.user_id ?? "—"}</TableCell>
                  <TableCell>{log.status_code ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
