"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGrid, Boxes, BookOpen, Bell, Settings, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DevNavSidebar } from "@/components/dev/dev-nav-sidebar"
import { cn } from "@/lib/utils"

const bottomNav = [
  { href: "/apps", icon: LayoutGrid, label: "Apps", match: (p: string) => p.startsWith("/apps") },
  { href: "/workspaces", icon: Boxes, label: "Spaces", match: (p: string) => p.startsWith("/workspaces") },
  { href: "/docs", icon: BookOpen, label: "Docs", match: (p: string) => p.startsWith("/docs") },
  { href: "/notifications", icon: Bell, label: "Alerts", match: (p: string) => p.startsWith("/notifications") },
  { href: "/settings/profile", icon: Settings, label: "Profile", match: (p: string) => p.startsWith("/settings") },
]

export function DevMobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-md md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <div className="border-b border-border p-4">
              <h2 className="font-semibold">Developer Console</h2>
              <p className="text-xs text-muted-foreground">Brenox platform</p>
            </div>
            <div className="flex-1 overflow-hidden" onClick={() => setOpen(false)}>
              <DevNavSidebar embedded />
            </div>
          </SheetContent>
        </Sheet>
        <span className="text-lg font-semibold tracking-tight">Brenox</span>
        <Link href="/notifications" className="relative p-2" aria-label="Notifications">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </Link>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/90 backdrop-blur-md md:hidden">
        <div className="flex h-16 items-center justify-around">
          {bottomNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-2",
                item.match(pathname) ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}
