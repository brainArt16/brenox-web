"use client"

import { useEffect, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { getToken } from "@/lib/engine/session"
import { isPlatformAdmin } from "@/lib/engine/admin"

export function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) return
    if (!getToken() || !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`)
      return
    }
    if (!isPlatformAdmin(user.platform_role)) {
      router.replace("/apps")
    }
  }, [isLoading, user, pathname, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!getToken() || !user || !isPlatformAdmin(user.platform_role)) {
    return null
  }

  return children
}
