"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { m } from "framer-motion"
import { LayoutGrid, Boxes, BookOpen, Bell, Settings, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getNotifications } from "@/lib/api"
import { isPlatformAdmin } from "@/lib/engine/admin"
import { useAuth } from "@/providers/auth-provider"

const railItems = [
  { id: "apps", href: "/apps", icon: LayoutGrid, label: "Apps" },
  { id: "workspaces", href: "/workspaces", icon: Boxes, label: "Workspaces" },
  { id: "docs", href: "/docs", icon: BookOpen, label: "Docs" },
] as const

export function DevRailSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    void getNotifications().then((n) => setUnread(n.filter((x) => !x.read).length))
  }, [pathname])

  const initials = user?.username?.slice(0, 2).toUpperCase() ?? "BX"

  function isActive(href: string) {
    if (href === "/apps") return pathname === "/apps" || pathname.startsWith("/apps/")
    if (href === "/workspaces") return pathname.startsWith("/workspaces")
    if (href === "/docs") return pathname.startsWith("/docs")
    if (href === "/notifications") return pathname.startsWith("/notifications")
    if (href === "/admin") return pathname.startsWith("/admin")
    return pathname.startsWith(href)
  }

  function RailButton({
    href,
    icon: Icon,
    label,
    badge,
  }: {
    href: string
    icon: typeof LayoutGrid
    label: string
    badge?: number
  }) {
    const active = isActive(href)
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={cn(
              "relative flex h-12 w-12 items-center justify-center rounded-xl transition-all",
              active
                ? "rounded-2xl bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:rounded-xl hover:bg-secondary/80 hover:text-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            {badge !== undefined && badge > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                {badge > 9 ? "9+" : badge}
              </span>
            )}
            {active && (
              <m.div
                className="absolute left-0 top-1/2 h-8 w-1 -translate-x-[10px] -translate-y-1/2 rounded-r-full bg-foreground"
                layoutId="dev-rail-indicator"
              />
            )}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside className="hidden h-screen w-[72px] flex-col items-center border-r border-sidebar-border bg-sidebar py-3 md:flex">
        <div className="flex w-full flex-1 flex-col items-center gap-2 px-3">
          {railItems.map((item) => (
            <RailButton key={item.id} href={item.href} icon={item.icon} label={item.label} />
          ))}
          {isPlatformAdmin(user?.platform_role) && (
            <RailButton href="/admin" icon={Shield} label="Platform Admin" />
          )}
          <div className="my-1 h-px w-8 bg-sidebar-border" />
          <RailButton href="/notifications" icon={Bell} label="Notifications" badge={unread} />
        </div>

        <div className="flex flex-col items-center gap-2 px-3">
          <div className="my-1 h-px w-8 bg-sidebar-border" />
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <button type="button" className="relative">
                    <Avatar className="h-12 w-12 rounded-xl border-2 border-transparent transition-colors hover:border-primary">
                      <AvatarFallback className="bg-primary text-sm font-semibold text-primary-foreground">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-sidebar bg-online" />
                  </button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="right">Account</TooltipContent>
            </Tooltip>
            <DropdownMenuContent side="right" align="end" className="w-56">
              {user && (
                <>
                  <div className="px-2 py-2">
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem asChild>
                <Link href="/settings/profile">
                  <Settings className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/docs">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Documentation
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/notifications">Notifications</Link>
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
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </TooltipProvider>
  )
}
