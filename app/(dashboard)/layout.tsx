"use client"

import { usePathname } from "next/navigation"
import { Suspense, type ReactNode } from "react"
import { DevRailSidebar } from "@/components/dev/dev-rail-sidebar"
import { DevNavSidebar } from "@/components/dev/dev-nav-sidebar"
import { DevMobileNav } from "@/components/dev/dev-mobile-nav"
import { AuthGuard } from "@/components/auth/auth-guard"
import { cn } from "@/lib/utils"

function NavSidebarFallback() {
  return <aside className="hidden md:flex w-60 h-screen bg-surface border-r border-border" />
}

function DashboardMain({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isWorkspaceChat = /^\/workspaces\/\d+$/.test(pathname)

  return (
    <main
      className={cn(
        "flex-1 flex flex-col min-w-0 pt-14 pb-16 md:pt-0 md:pb-0 overflow-auto",
        isWorkspaceChat && "overflow-hidden"
      )}
    >
      <div
        className={cn(
          "flex-1",
          isWorkspaceChat ? "p-0" : "p-4 sm:p-6 md:max-w-5xl md:mx-auto md:w-full"
        )}
      >
        {children}
      </div>
    </main>
  )
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="h-screen flex overflow-hidden bg-background">
        <DevMobileNav />
        <DevRailSidebar />
        <Suspense fallback={<NavSidebarFallback />}>
          <DevNavSidebar />
        </Suspense>
        <DashboardMain>{children}</DashboardMain>
      </div>
    </AuthGuard>
  )
}
