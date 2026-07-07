"use client"

import { useEffect, useState } from "react"
import { AlertTriangle } from "lucide-react"
import { getPlatformStatus } from "@/lib/engine/billing"

export function MaintenanceBanner() {
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    getPlatformStatus()
      .then((status) => {
        if (status.maintenance_mode) {
          setMessage(
            status.maintenance_message ||
              "Brenox is undergoing scheduled maintenance."
          )
        }
      })
      .catch(() => {})
  }, [])

  if (!message) return null

  return (
    <div className="flex items-center gap-2 border-b border-warning/30 bg-warning/10 px-4 py-2 text-sm text-warning">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  )
}
