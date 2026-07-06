"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  const [userId, setUserId] = useState("")
  const [action, setAction] = useState("")

  function load(filters?: { user_id?: number; action?: string }) {
    setLoading(true)
    listAdminAuditLogs(filters)
      .then(setLogs)
      .catch((error) => toast.error(getErrorMessage(error, "Failed to load audit logs")))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  function handleFilter() {
    const filters: { user_id?: number; action?: string } = {}
    const trimmedAction = action.trim()
    if (trimmedAction) filters.action = trimmedAction
    if (userId.trim()) {
      const parsed = Number(userId.trim())
      if (!Number.isFinite(parsed)) {
        toast.error("User ID must be a number")
        return
      }
      filters.user_id = parsed
    }
    load(filters)
  }

  function handleClear() {
    setUserId("")
    setAction("")
    load()
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Audit logs"
        description="Recent platform HTTP activity recorded by the engine."
      />

      <div className="flex flex-wrap gap-2 max-w-2xl">
        <Input
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-32"
        />
        <Input
          placeholder="Action (e.g. auth.login)"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="flex-1 min-w-[200px]"
          onKeyDown={(e) => e.key === "Enter" && handleFilter()}
        />
        <Button variant="outline" onClick={handleFilter}>
          Filter
        </Button>
        <Button variant="ghost" onClick={handleClear}>
          Clear
        </Button>
      </div>

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
                  <TableCell>
                    {log.user_id != null ? (
                      <Link href={`/admin/users/${log.user_id}`} className="hover:underline">
                        {log.username || `#${log.user_id}`}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </TableCell>
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
