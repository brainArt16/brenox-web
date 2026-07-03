"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import {
  ChevronDown,
  Hash,
  Key,
  LayoutGrid,
  Lock,
  Plus,
  BookOpen,
  Bell,
  Settings,
  Users,
  Webhook,
  FlaskConical,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { getApps, getApp, getWorkspaces, getWorkspace, getChannels } from "@/lib/api"
import { useAuth } from "@/providers/auth-provider"
import type { App, Channel, WorkspaceListItem } from "@/lib/types"

function NavLink({
  href,
  active,
  icon: Icon,
  children,
}: {
  href: string
  active: boolean
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors",
        active
          ? "bg-secondary text-foreground"
          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
      )}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="truncate flex-1">{children}</span>
    </Link>
  )
}

export function DevNavSidebar({ embedded = false }: { embedded?: boolean }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [apps, setApps] = useState<App[]>([])
  const [app, setApp] = useState<App | null>(null)
  const [workspaces, setWorkspaces] = useState<WorkspaceListItem[]>([])
  const [workspace, setWorkspace] = useState<WorkspaceListItem | null>(null)
  const [channels, setChannels] = useState<Channel[]>([])
  const [appsOpen, setAppsOpen] = useState(true)
  const [channelsOpen, setChannelsOpen] = useState(true)

  const appIdMatch = pathname.match(/^\/apps\/(\d+)/)
  const appId = appIdMatch ? Number(appIdMatch[1]) : null
  const wsIdMatch = pathname.match(/^\/workspaces\/(\d+)/)
  const wsId = wsIdMatch ? Number(wsIdMatch[1]) : null
  const activeChannelId = searchParams.get("channel")

  useEffect(() => {
    if (pathname.startsWith("/apps")) {
      void getApps().then(setApps)
    }
  }, [pathname])

  useEffect(() => {
    if (appId) {
      void getApp(appId).then(setApp)
    } else {
      setApp(null)
    }
  }, [appId])

  useEffect(() => {
    if (pathname.startsWith("/workspaces")) {
      void getWorkspaces().then(setWorkspaces)
    }
  }, [pathname])

  useEffect(() => {
    if (wsId) {
      void getWorkspace(wsId).then(setWorkspace)
      void getChannels(wsId).then(setChannels)
    } else {
      setWorkspace(null)
      setChannels([])
    }
  }, [wsId])

  const headerTitle =
    app?.name ??
    workspace?.name ??
    (pathname.startsWith("/settings") ? "Settings" : pathname.startsWith("/docs") ? "Documentation" : pathname.startsWith("/notifications") ? "Notifications" : "Developer Console")

  return (
    <aside
      className={cn(
        "h-full flex flex-col bg-surface border-r border-border",
        embedded ? "flex w-full" : "hidden md:flex w-60 h-screen"
      )}
    >
      <div className="h-14 px-4 flex items-center border-b border-border">
        <span className="font-semibold truncate">{headerTitle}</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-2 py-3">
        {/* Apps section */}
        {(pathname.startsWith("/apps")) && (
          <>
            <Collapsible open={appsOpen} onOpenChange={setAppsOpen}>
              <div className="group flex items-center gap-1 px-2 py-1.5">
                <CollapsibleTrigger className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground uppercase tracking-wide">
                  <ChevronDown className={cn("w-3 h-3 transition-transform", !appsOpen && "-rotate-90")} />
                  Apps
                </CollapsibleTrigger>
                <Link
                  href="/apps/new"
                  className="ml-auto p-1 hover:bg-secondary rounded-sm opacity-0 group-hover:opacity-100"
                  aria-label="New app"
                >
                  <Plus className="w-3 h-3" />
                </Link>
              </div>
              <CollapsibleContent>
                <div className="space-y-0.5 mb-4">
                  <NavLink href="/apps" active={pathname === "/apps"} icon={LayoutGrid}>
                    All apps
                  </NavLink>
                  {apps.map((a) => (
                    <NavLink
                      key={a.id}
                      href={`/apps/${a.id}`}
                      active={appId === a.id && !pathname.includes("/keys") && !pathname.includes("/webhooks") && !pathname.includes("/sandbox")}
                      icon={LayoutGrid}
                    >
                      {a.name}
                    </NavLink>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {appId && app && (
              <div className="mb-4">
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {app.name}
                </div>
                <div className="space-y-0.5">
                  <NavLink href={`/apps/${appId}`} active={pathname === `/apps/${appId}`} icon={LayoutGrid}>
                    Overview
                  </NavLink>
                  <NavLink href={`/apps/${appId}/keys`} active={pathname.endsWith("/keys")} icon={Key}>
                    API Keys
                  </NavLink>
                  <NavLink href={`/apps/${appId}/webhooks`} active={pathname.endsWith("/webhooks")} icon={Webhook}>
                    Webhooks
                  </NavLink>
                  <NavLink href={`/apps/${appId}/sandbox`} active={pathname.endsWith("/sandbox")} icon={FlaskConical}>
                    Sandbox
                  </NavLink>
                  <NavLink href={`/workspaces/${app.workspace_id}`} active={false} icon={ExternalLink}>
                    Open workspace
                  </NavLink>
                </div>
              </div>
            )}
          </>
        )}

        {/* Workspaces section */}
        {pathname.startsWith("/workspaces") && (
          <>
            {!wsId && (
              <div className="space-y-0.5">
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Workspaces
                </div>
                {workspaces.map((ws) => (
                  <NavLink
                    key={ws.id}
                    href={`/workspaces/${ws.id}`}
                    active={wsId === ws.id || (pathname === "/workspaces" && false)}
                    icon={Hash}
                  >
                    {ws.name}
                  </NavLink>
                ))}
              </div>
            )}

            {wsId && workspace && (
              <>
                <Collapsible open={channelsOpen} onOpenChange={setChannelsOpen}>
                  <CollapsibleTrigger className="w-full flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground uppercase tracking-wide">
                    <ChevronDown className={cn("w-3 h-3 transition-transform", !channelsOpen && "-rotate-90")} />
                    Channels
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-0.5">
                      {channels.map((ch) => (
                        <Link
                          key={ch.ID}
                          href={`/workspaces/${wsId}?channel=${ch.ID}`}
                          className={cn(
                            "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors",
                            activeChannelId === String(ch.ID) || (!activeChannelId && channels[0]?.ID === ch.ID)
                              ? "bg-secondary text-foreground"
                              : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                          )}
                        >
                          {ch.IsReadOnly ? (
                            <Lock className="w-4 h-4 flex-shrink-0" />
                          ) : (
                            <Hash className="w-4 h-4 flex-shrink-0" />
                          )}
                          <span className="truncate">{ch.Name}</span>
                        </Link>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <div className="mt-4 space-y-0.5">
                  <NavLink
                    href={`/workspaces/${wsId}/settings/members`}
                    active={pathname.includes("/settings/members")}
                    icon={Users}
                  >
                    Members
                  </NavLink>
                </div>
              </>
            )}
          </>
        )}

        {pathname.startsWith("/settings") && (
          <div className="space-y-0.5">
            <div className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Settings
            </div>
            <NavLink href="/settings/profile" active={pathname === "/settings/profile"} icon={Settings}>
              Profile
            </NavLink>
            <NavLink href="/notifications" active={pathname === "/notifications"} icon={Bell}>
              Notifications
            </NavLink>
          </div>
        )}

        {pathname.startsWith("/docs") && (
          <div className="space-y-0.5">
            <NavLink href="/docs" active={pathname === "/docs"} icon={BookOpen}>
              SDK & API
            </NavLink>
            <NavLink href="/docs#websocket" active={false} icon={BookOpen}>
              WebSocket events
            </NavLink>
            <NavLink href="/docs#quickstart" active={false} icon={BookOpen}>
              Quick start
            </NavLink>
          </div>
        )}

        {pathname.startsWith("/notifications") && (
          <div className="space-y-0.5">
            <NavLink href="/notifications" active={pathname === "/notifications"} icon={Bell}>
              All notifications
            </NavLink>
          </div>
        )}
      </div>

      <div className="p-2 border-t border-border bg-surface-elevated">
        <Link
          href="/settings/profile"
          className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary/50 transition-colors"
        >
          <div className="relative">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {user?.username?.slice(0, 2).toUpperCase() ?? "BX"}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-online border-2 border-surface-elevated rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.username ?? "Developer"}</p>
            <p className="text-xs text-muted-foreground truncate">Online</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <Settings className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </aside>
  )
}
