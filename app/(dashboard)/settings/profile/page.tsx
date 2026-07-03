"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PageHeader } from "@/components/layout/page-header"
import { getUser, updateProfile, updatePresence } from "@/lib/api"
import type { UserProfile } from "@/lib/types"
import { toast } from "sonner"
import Link from "next/link"

export default function ProfileSettingsPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [username, setUsername] = useState("")
  const [presence, setPresence] = useState<"online" | "away" | "offline">("online")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getUser().then((u) => {
      setUser(u)
      setUsername(u.username)
    })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await updateProfile(username.trim())
      await updatePresence(presence)
      toast.success("Profile updated")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <PageHeader
        eyebrow="Settings"
        title="Profile"
        description="Your developer account and presence status across workspaces."
      />

      <form
        onSubmit={(e) => void handleSave(e)}
        className="space-y-6 rounded-xl border border-border bg-card p-6"
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user?.email ?? ""} readOnly className="bg-surface text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-surface"
          />
        </div>
        <div className="space-y-2">
          <Label>Presence</Label>
          <Select value={presence} onValueChange={(v) => setPresence(v as typeof presence)}>
            <SelectTrigger className="bg-surface">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="away">Away</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </form>

      <div className="rounded-xl border border-destructive/30 bg-card p-6">
        <h2 className="font-semibold text-destructive">Sign out</h2>
        <p className="mt-1 text-sm text-muted-foreground">End your session on this device.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/login">Sign out</Link>
        </Button>
      </div>
    </div>
  )
}
