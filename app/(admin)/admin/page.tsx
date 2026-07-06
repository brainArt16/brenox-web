"use client"

import { useEffect, useState } from "react"
import { Users, Boxes, LayoutGrid } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { Skeleton } from "@/components/ui/skeleton"
import { getAdminOverview } from "@/lib/engine/admin"
import { getErrorMessage } from "@/lib/engine/errors"
import { toast } from "sonner"
import type { AdminOverview } from "@/lib/types"

export default function AdminOverviewPage() {
  const [overview, setOverview] = useState<AdminOverview | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminOverview()
      .then(setOverview)
      .catch((error) => toast.error(getErrorMessage(error, "Failed to load overview")))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Platform"
        title="Admin overview"
        description="Cross-tenant metrics for users, workspaces, and developer apps."
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Users" value={overview?.users ?? 0} icon={Users} />
          <StatCard label="Workspaces" value={overview?.workspaces ?? 0} icon={Boxes} />
          <StatCard label="Apps" value={overview?.apps ?? 0} icon={LayoutGrid} />
        </div>
      )}
    </div>
  )
}
