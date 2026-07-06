"use client"

import { type ReactNode } from "react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex h-screen overflow-hidden bg-background">
        <AdminSidebar />
        <main className="flex-1 overflow-auto p-4 sm:p-6 md:max-w-6xl md:mx-auto md:w-full">
          {children}
        </main>
      </div>
    </AdminGuard>
  )
}
