"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import {
  getAdminPlatformSettings,
  updateAdminPlatformSettings,
} from "@/lib/engine/billing"
import { getErrorMessage } from "@/lib/engine/errors"
import { useAuth } from "@/providers/auth-provider"
import { toast } from "sonner"

export default function AdminSettingsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [maintenanceMessage, setMaintenanceMessage] = useState("")
  const canWrite = user?.platform_role === "admin"

  useEffect(() => {
    getAdminPlatformSettings()
      .then((settings) => {
        setMaintenanceMode(settings.maintenance_mode)
        setMaintenanceMessage(settings.maintenance_message)
      })
      .catch((error) => toast.error(getErrorMessage(error, "Failed to load settings")))
      .finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      const updated = await updateAdminPlatformSettings({
        maintenance_mode: maintenanceMode,
        maintenance_message: maintenanceMessage,
      })
      setMaintenanceMode(updated.maintenance_mode)
      setMaintenanceMessage(updated.maintenance_message)
      toast.success("Platform settings saved")
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to save settings"))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <Skeleton className="h-64 w-full rounded-xl" />
  }

  return (
    <div className="space-y-8 max-w-xl">
      <PageHeader
        title="Platform settings"
        description="Maintenance mode and global platform controls."
      />

      <div className="rounded-xl border border-border p-6 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <Label htmlFor="maintenance">Maintenance mode</Label>
            <p className="text-sm text-muted-foreground">
              Blocks API traffic except admin and health endpoints.
            </p>
          </div>
          <Switch
            id="maintenance"
            checked={maintenanceMode}
            onCheckedChange={setMaintenanceMode}
            disabled={!canWrite}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Maintenance message</Label>
          <Input
            id="message"
            value={maintenanceMessage}
            onChange={(e) => setMaintenanceMessage(e.target.value)}
            disabled={!canWrite}
          />
        </div>

        {canWrite && (
          <Button onClick={() => void handleSave()} disabled={saving}>
            {saving ? "Saving…" : "Save settings"}
          </Button>
        )}
      </div>
    </div>
  )
}
