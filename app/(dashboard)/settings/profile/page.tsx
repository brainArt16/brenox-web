"use client"

import { useEffect, useState } from "react"
import { Loader2, Eye, EyeOff, User, Shield, LogOut } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/layout/page-header"
import { SettingsSection } from "@/components/settings/settings-section"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { PasswordStrength } from "@/components/shared/password-strength"
import { fetchPresence, updatePassword, updatePresence, updateProfile } from "@/lib/api"
import { isPersistentSession } from "@/lib/engine/session"
import { getErrorMessage } from "@/lib/engine/errors"
import { useAuth } from "@/providers/auth-provider"
import { toast } from "sonner"

type PresenceStatus = "online" | "away" | "offline"

const presenceLabels: Record<PresenceStatus, string> = {
  online: "Online",
  away: "Away",
  offline: "Offline",
}

export default function ProfileSettingsPage() {
  const { user: authUser, refreshUser } = useAuth()
  const [username, setUsername] = useState("")
  const [presence, setPresence] = useState<PresenceStatus>("online")
  const [savingProfile, setSavingProfile] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  const [persistentSession, setPersistentSession] = useState(true)

  useEffect(() => {
    if (authUser) {
      setUsername(authUser.username)
    }
    setPersistentSession(isPersistentSession())
    void fetchPresence()
      .then(setPresence)
      .catch(() => {
        // presence defaults to online when unset
      })
  }, [authUser])

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSavingProfile(true)
    try {
      await updateProfile(username.trim())
      await updatePresence(presence)
      await refreshUser()
      toast.success("Profile updated")
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update profile"))
    } finally {
      setSavingProfile(false)
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    setSavingPassword(true)
    try {
      await updatePassword(currentPassword, newPassword)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      toast.success("Password updated")
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to change password"))
    } finally {
      setSavingPassword(false)
    }
  }

  const initials = authUser?.username?.slice(0, 2).toUpperCase() ?? "BX"
  const memberSince = authUser?.created_at
    ? new Date(authUser.created_at).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader
        eyebrow="Settings"
        title="Account"
        description="Manage your developer profile, presence, and security."
      />

      <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
        <Avatar className="h-14 w-14 rounded-xl">
          <AvatarFallback className="rounded-xl bg-primary text-lg font-semibold text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-semibold">{authUser?.username ?? "Developer"}</p>
          <p className="truncate text-sm text-muted-foreground">{authUser?.email}</p>
          {memberSince && (
            <p className="mt-1 text-xs text-muted-foreground">Member since {memberSince}</p>
          )}
        </div>
        <span className="hidden rounded-md border border-border bg-surface px-2 py-1 text-xs capitalize text-muted-foreground sm:inline">
          {presenceLabels[presence]}
        </span>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-surface">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <SettingsSection
            title="Public profile"
            description="How you appear in workspaces and chat."
            icon={<User className="h-5 w-5" />}
          >
            <form onSubmit={(e) => void handleSaveProfile(e)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={authUser?.email ?? ""}
                  readOnly
                  className="bg-surface text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-surface"
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <Label>Presence</Label>
                <Select value={presence} onValueChange={(v) => setPresence(v as PresenceStatus)}>
                  <SelectTrigger className="bg-surface">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="away">Away</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Shown to other members across your workspaces.
                </p>
              </div>
              <Button type="submit" disabled={savingProfile}>
                {savingProfile ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save profile"
                )}
              </Button>
            </form>
          </SettingsSection>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SettingsSection
            title="Change password"
            description="Use a strong password you do not reuse elsewhere."
            icon={<Shield className="h-5 w-5" />}
          >
            <form onSubmit={(e) => void handleChangePassword(e)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-surface pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-surface pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <PasswordStrength password={newPassword} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-surface"
                  autoComplete="new-password"
                />
              </div>
              <Button type="submit" disabled={savingPassword}>
                {savingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating…
                  </>
                ) : (
                  "Update password"
                )}
              </Button>
            </form>
          </SettingsSection>

          <SettingsSection
            title="Session"
            description="Manage your sign-in on this device."
            icon={<LogOut className="h-5 w-5" />}
            variant="danger"
          >
            <dl className="mb-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Storage</dt>
                <dd className="font-medium">
                  {persistentSession ? "Remember me enabled" : "Browser session only"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Auth</dt>
                <dd className="font-medium">JWT bearer token</dd>
              </div>
            </dl>
            <SignOutButton variant="outline" label="Sign out of this device" />
          </SettingsSection>
        </TabsContent>
      </Tabs>
    </div>
  )
}
