"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  MessageSquare,
  Bell,
  Settings,
  Code2,
  BarChart3,
  Shield,
  Menu,
  X,
  ChevronRight,
  Hash,
  Users,
  Video,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

const navigationItems = [
  { href: "/app", icon: MessageSquare, label: "Messages", badge: 3 },
  { href: "/app/notifications", icon: Bell, label: "Notifications", badge: 5 },
  { href: "/app/developers", icon: Code2, label: "Developer" },
  { href: "/app/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/app/admin", icon: Shield, label: "Admin" },
  { href: "/app/settings", icon: Settings, label: "Settings" },
]

const channels = [
  { id: "1", name: "general", type: "text", unread: 3 },
  { id: "2", name: "engineering", type: "text", unread: 0 },
  { id: "3", name: "design", type: "text", unread: 1 },
  { id: "4", name: "Voice Lounge", type: "voice", members: 3 },
]

const workspaces = [
  { id: "1", name: "Acme Corp", initials: "AC", active: true },
  { id: "2", name: "Side Project", initials: "SP", active: false },
  { id: "3", name: "Personal", initials: "P", active: false },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Header */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-lg md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0">
            <div className="flex h-full flex-col">
              {/* Workspace Header */}
              <div className="flex items-center gap-3 border-b border-border p-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    AC
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="font-semibold text-foreground">Acme Corp</h2>
                  <p className="text-xs text-muted-foreground">3 workspaces</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="flex-1">
                {/* Channels */}
                <div className="p-3">
                  <div className="flex items-center justify-between px-2 py-1">
                    <span className="text-xs font-semibold uppercase text-muted-foreground">
                      Channels
                    </span>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {channels.map((channel) => (
                      <Link
                        key={channel.id}
                        href={`/app/channels/${channel.id}`}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors",
                          "hover:bg-muted",
                          pathname === `/app/channels/${channel.id}`
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {channel.type === "voice" ? (
                          <Video className="h-4 w-4" />
                        ) : (
                          <Hash className="h-4 w-4" />
                        )}
                        <span className="flex-1">{channel.name}</span>
                        {channel.unread > 0 && (
                          <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                            {channel.unread}
                          </Badge>
                        )}
                        {channel.type === "voice" && channel.members > 0 && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" />
                            {channel.members}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Navigation */}
                <div className="border-t border-border p-3">
                  <div className="px-2 py-1">
                    <span className="text-xs font-semibold uppercase text-muted-foreground">
                      Navigation
                    </span>
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors",
                          "hover:bg-muted",
                          pathname === item.href
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              </ScrollArea>

              {/* User Profile */}
              <div className="border-t border-border p-3">
                <Link
                  href="/app/settings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">John Doe</p>
                    <p className="text-xs text-muted-foreground">Online</p>
                  </div>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <h1 className="text-lg font-semibold text-foreground">Brenox</h1>

        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Bell className="h-5 w-5" />
        </Button>
      </header>

      {/* Bottom Navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/80 backdrop-blur-lg md:hidden">
        <div className="flex h-16 items-center justify-around">
          {[
            { href: "/app", icon: MessageSquare, label: "Chat" },
            { href: "/app/notifications", icon: Bell, label: "Alerts" },
            { href: "/app/call", icon: Video, label: "Call" },
            { href: "/app/settings", icon: Settings, label: "Settings" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}
