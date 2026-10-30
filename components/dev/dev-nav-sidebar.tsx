"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import {
  Bell,
  BookOpen,
  Boxes,
  ExternalLink,
  FlaskConical,
  Hash,
  Key,
  LayoutGrid,
  Lock,
  LogOut,
  Plus,
  Settings,
  Shield,
  Users,
  Webhook,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Logo } from "@/components/brand/logo"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { getApps, getApp, getWorkspaces, getWorkspace, getChannels, getNotifications } from "@/lib/api"
import { isPlatformAdmin } from "@/lib/engine/admin"
import { getDocSectionsForSdk, DEFAULT_SDK_ID } from "@/lib/docs/content"
import { useAuth } from "@/providers/auth-provider"
import type { App, Channel, WorkspaceListItem } from "@/lib/types"

function NavItem({
  href,
  active,
  icon: Icon,
  children,
  badge,
  indented,
}: {
  href: string
  active: boolean
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  badge?: number
  indented?: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
        indented && "pl-8",
        active
          ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
          : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4 shrink-0 opacity-80" />
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {badge !== undefined && badge > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </Link>
  )
}

function SectionLabel({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-1 mt-5 flex items-center gap-2 px-2.5 first:mt-0">
      <span className="flex-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80">
        {children}
      </span>
      {action}
    </div>
  )
}

export function DevNavSidebar({ embedded = false }: { embedded?: boolean }) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, logout } = useAuth()

  const [apps, setApps] = useState<App[]>([])
  const [app, setApp] = useState<App | null>(null)
  const [workspaces, setWorkspaces] = useState<WorkspaceListItem[]>([])
  const [workspace, setWorkspace] = useState<WorkspaceListItem | null>(null)
  const [channels, setChannels] = useState<Channel[]>([])
  const [unread, setUnread] = useState(0)

  const appIdMatch = pathname.match(/^\/apps\/(\d+)/)
  const appId = appIdMatch ? Number(appIdMatch[1]) : null
  const wsIdMatch = pathname.match(/^\/workspaces\/(\d+)/)
  const wsId = wsIdMatch ? Number(wsIdMatch[1]) : null
  const activeChannelId = searchParams.get("channel")
  const docsSdkId = searchParams.get("sdk") ?? DEFAULT_SDK_ID
  const docsVersion = searchParams.get("v")

  const inApps = pathname.startsWith("/apps")
  const inWorkspaces = pathname.startsWith("/workspaces")
  const inDocs = pathname.startsWith("/docs")
  const inSettings = pathname.startsWith("/settings")
  const inNotifications = pathname.startsWith("/notifications")
  const showAdmin = isPlatformAdmin(user?.platform_role)

  useEffect(() => {
    void getNotifications().then((n) => setUnread(n.filter((x) => !x.read).length))
  }, [pathname])

  useEffect(() => {
    if (inApps) void getApps().then(setApps)
  }, [inApps, pathname])

  useEffect(() => {
    if (appId) {
      void getApp(appId).then(setApp)
    } else {
      setApp(null)
    }
  }, [appId])

  useEffect(() => {
    if (inWorkspaces) void getWorkspaces().then(setWorkspaces)
  }, [inWorkspaces, pathname])

  useEffect(() => {
    if (wsId) {
      void getWorkspace(wsId).then(setWorkspace)
      void getChannels(wsId).then(setChannels)
    } else {
      setWorkspace(null)
      setChannels([])
    }
  }, [wsId])

  const displayName = user?.username?.trim() || user?.email?.split("@")[0] || "Developer"
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
        embedded ? "w-full" : "hidden h-screen w-60 md:flex"
      )}
    >
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border px-4">
        <Logo size="sm" href="/apps" priority />
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3 scrollbar-thin">
        <SectionLabel>Console</SectionLabel>
        <div className="space-y-0.5">
          <NavItem href="/apps" active={inApps} icon={LayoutGrid}>
            Apps
          </NavItem>
          <NavItem href="/workspaces" active={inWorkspaces} icon={Boxes}>
            Workspaces
          </NavItem>
          <NavItem href="/docs" active={inDocs} icon={BookOpen}>
            Docs
          </NavItem>
          <NavItem
            href="/notifications"
            active={inNotifications}
            icon={Bell}
            badge={unread}
          >
            Notifications
          </NavItem>
          <NavItem
            href="/settings/billing"
            active={pathname.startsWith("/settings/billing")}
            icon={Settings}
          >
            Billing
          </NavItem>
          {showAdmin && (
            <NavItem href="/admin" active={pathname.startsWith("/admin")} icon={Shield}>
              Platform Admin
            </NavItem>
          )}
        </div>

        {inApps && (
          <>
            <SectionLabel
              action={
                <Link
                  href="/apps/new"
                  className="rounded-sm p-1 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
                  aria-label="New app"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Link>
              }
            >
              Your apps
            </SectionLabel>
            <div className="space-y-0.5">
              <NavItem href="/apps" active={pathname === "/apps"} icon={LayoutGrid} indented>
                All apps
              </NavItem>
              {apps.map((a) => (
                <NavItem
                  key={a.id}
                  href={`/apps/${a.id}`}
                  active={appId === a.id}
                  icon={LayoutGrid}
                  indented
                >
                  {a.name}
                </NavItem>
              ))}
            </div>

            {appId && app && (
              <>
                <SectionLabel>{app.name}</SectionLabel>
                <div className="space-y-0.5">
                  <NavItem
                    href={`/apps/${appId}`}
                    active={pathname === `/apps/${appId}`}
                    icon={LayoutGrid}
                  >
                    Overview
                  </NavItem>
                  <NavItem
                    href={`/apps/${appId}/keys`}
                    active={pathname.endsWith("/keys")}
                    icon={Key}
                  >
                    API Keys
                  </NavItem>
                  <NavItem
                    href={`/apps/${appId}/webhooks`}
                    active={pathname.endsWith("/webhooks")}
                    icon={Webhook}
                  >
                    Webhooks
                  </NavItem>
                  <NavItem
                    href={`/apps/${appId}/sandbox`}
                    active={pathname.endsWith("/sandbox")}
                    icon={FlaskConical}
                  >
                    Sandbox
                  </NavItem>
                  <NavItem href={`/workspaces/${app.workspace_id}`} active={false} icon={ExternalLink}>
                    Open workspace
                  </NavItem>
                </div>
              </>
            )}
          </>
        )}

        {inWorkspaces && (
          <>
            {!wsId && (
              <>
                <SectionLabel>Workspaces</SectionLabel>
                <div className="space-y-0.5">
                  {workspaces.length === 0 ? (
                    <p className="px-2.5 py-1.5 text-xs text-muted-foreground">No workspaces yet</p>
                  ) : (
                    workspaces.map((ws) => (
                      <NavItem
                        key={ws.id}
                        href={`/workspaces/${ws.id}`}
                        active={false}
                        icon={Boxes}
                        indented
                      >
                        {ws.name}
                      </NavItem>
                    ))
                  )}
                </div>
              </>
            )}

            {wsId && workspace && (
              <>
                <SectionLabel>{workspace.name}</SectionLabel>
                <div className="space-y-0.5">
                  {channels.map((ch) => (
                    <Link
                      key={ch.ID}
                      href={`/workspaces/${wsId}?channel=${ch.ID}`}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                        activeChannelId === String(ch.ID) ||
                          (!activeChannelId && channels[0]?.ID === ch.ID)
                          ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                          : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
                      )}
                    >
                      {ch.IsReadOnly ? (
                        <Lock className="h-4 w-4 shrink-0 opacity-80" />
                      ) : (
                        <Hash className="h-4 w-4 shrink-0 opacity-80" />
                      )}
                      <span className="truncate">{ch.Name}</span>
                    </Link>
                  ))}
                  <NavItem
                    href={`/workspaces/${wsId}/settings/members`}
                    active={pathname.includes("/settings/members")}
                    icon={Users}
                  >
                    Members
                  </NavItem>
                </div>
              </>
            )}
          </>
        )}

        {inDocs && (
          <>
            <SectionLabel>Guides</SectionLabel>
            <div className="space-y-0.5">
              {getDocSectionsForSdk(docsSdkId).map((section) => {
                const q = new URLSearchParams({ sdk: docsSdkId })
                if (docsVersion) q.set("v", docsVersion)
                return (
                  <Link
                    key={section.id}
                    href={`/docs?${q.toString()}#${section.id}`}
                    className="block truncate rounded-md px-2.5 py-1.5 pl-8 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-foreground"
                  >
                    {section.label}
                  </Link>
                )
              })}
            </div>
          </>
        )}

        {inSettings && (
          <>
            <SectionLabel>Settings</SectionLabel>
            <div className="space-y-0.5">
              <NavItem
                href="/settings/profile"
                active={pathname === "/settings/profile"}
                icon={Settings}
              >
                Account
              </NavItem>
              <NavItem
                href="/settings/billing"
                active={pathname === "/settings/billing"}
                icon={Settings}
              >
                Billing
              </NavItem>
            </div>
          </>
        )}
      </div>

      <div className="shrink-0 border-t border-sidebar-border p-2">
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-sidebar-accent"
              >
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-primary text-[10px] font-semibold text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium leading-tight">{displayName}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{user?.email}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/settings/profile">
                  <Settings className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings/billing">Billing</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/docs">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Documentation
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={(e) => {
                  e.preventDefault()
                  logout()
                  router.replace("/login")
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ThemeToggle className="h-8 w-8 shrink-0" />
        </div>
      </div>
    </aside>
  )
}
