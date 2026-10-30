"use client"

import Link from "next/link"
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
  getAdminBillingOverview,
  listAdminSubscriptions,
} from "@/lib/engine/billing"
import { getErrorMessage } from "@/lib/engine/errors"
import { useAuth } from "@/providers/auth-provider"
import { toast } from "sonner"
import type { AdminSubscription } from "@/lib/types"

export default function AdminBillingPage() {
  const { user: currentUser } = useAuth()
  const canWrite = currentUser?.platform_role === "admin"
  const [activeCount, setActiveCount] = useState(0)
  const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>([])
  const [loading, setLoading] = useState(true)

  function load() {
    setLoading(true)
    Promise.all([getAdminBillingOverview(), listAdminSubscriptions()])
      .then(([overview, subs]) => {
        setActiveCount(overview.active_subscriptions)
        setSubscriptions(subs)
      })
      .catch((error) => toast.error(getErrorMessage(error, "Failed to load billing")))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="space-y-8">
      <PageHeader
        title="Billing"
        description="Account subscriptions and shared usage across the platform."
      />

      <div className="max-w-xs rounded-xl border border-border p-6">
        <p className="text-sm text-muted-foreground">Active subscriptions</p>
        <p className="text-3xl font-semibold">{activeCount}</p>
      </div>

      {loading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Apps</TableHead>
                <TableHead>Messages</TableHead>
                <TableHead>Video min</TableHead>
                {canWrite && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((sub) => (
                <TableRow key={sub.user_id}>
                  <TableCell>
                    <Link href={`/admin/users/${sub.user_id}`} className="hover:underline">
                      <div className="font-medium">{sub.user_email}</div>
                      <div className="font-mono text-xs text-muted-foreground">
                        {sub.user_username || `user #${sub.user_id}`}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>{sub.plan_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {sub.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {sub.apps_count}/{sub.max_apps}
                  </TableCell>
                  <TableCell>{sub.messages_this_month.toLocaleString()}</TableCell>
                  <TableCell>{(sub.video_minutes_this_month ?? 0).toLocaleString()}</TableCell>
                  {canWrite && (
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/users/${sub.user_id}#subscription`}>Manage</Link>
                      </Button>
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
