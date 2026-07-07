"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
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
  getAdminBillingOverview,
  listAdminSubscriptions,
} from "@/lib/engine/billing"
import { getErrorMessage } from "@/lib/engine/errors"
import { toast } from "sonner"
import type { AdminSubscription } from "@/lib/types"

export default function AdminBillingPage() {
  const [activeCount, setActiveCount] = useState(0)
  const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAdminBillingOverview(), listAdminSubscriptions()])
      .then(([overview, subs]) => {
        setActiveCount(overview.active_subscriptions)
        setSubscriptions(subs)
      })
      .catch((error) => toast.error(getErrorMessage(error, "Failed to load billing")))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-8">
      <PageHeader
        title="Billing"
        description="Subscriptions and usage across all apps."
      />

      <div className="rounded-xl border border-border p-6 max-w-xs">
        <p className="text-sm text-muted-foreground">Active subscriptions</p>
        <p className="text-3xl font-semibold">{activeCount}</p>
      </div>

      {loading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : (
        <div className="rounded-xl border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>App</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Messages (month)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((sub) => (
                <TableRow key={sub.app_id}>
                  <TableCell>
                    <Link href={`/admin/apps/${sub.app_id}`} className="hover:underline">
                      <div className="font-medium">{sub.app_name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{sub.app_slug}</div>
                    </Link>
                  </TableCell>
                  <TableCell>{sub.plan_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {sub.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {sub.messages_this_month.toLocaleString()}
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
