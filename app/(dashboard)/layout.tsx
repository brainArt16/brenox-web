"use client"

import { usePathname } from "next/navigation"
import { Suspense, type ReactNode } from "react"
import { DevNavSidebar } from "@/components/dev/dev-nav-sidebar"
import { DevMobileNav } from "@/components/dev/dev-mobile-nav"
import { AuthGuard } from "@/components/auth/auth-guard"
import { MaintenanceBanner } from "@/components/shared/maintenance-banner"
import { cn } from "@/lib/utils"

function NavSidebarFallback() {
  return (
    <aside className="hidden h-screen w-60 border-r border-sidebar-border bg-sidebar md:flex" />
  )
}

function DashboardMain({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isWorkspaceChat = /^\/workspaces\/\d+$/.test(pathname)

  return (
    <main
      className={cn(
        "flex min-w-0 flex-1 flex-col overflow-auto pb-16 pt-14 md:pb-0 md:pt-0",
        isWorkspaceChat && "overflow-hidden"
      )}
    >
      <div
        className={cn(
          "flex-1",
          isWorkspaceChat ? "p-0" : "mx-auto w-full max-w-5xl p-4 sm:p-6 md:p-8"
        )}
      >
        <MaintenanceBanner />
        {children}
      </div>
    </main>
  )
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-background">
        <DevMobileNav />
        <Suspense fallback={<NavSidebarFallback />}>
          <DevNavSidebar />
        </Suspense>
        <DashboardMain>{children}</DashboardMain>
      </div>
    </AuthGuard>
  )
}
