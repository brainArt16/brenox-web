"use client"

import { useEffect, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { getToken } from "@/lib/engine/session"

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) return
    if (!getToken() || !user) {
      const next = encodeURIComponent(pathname)
      router.replace(`/login?next=${next}`)
    }
  }, [isLoading, user, pathname, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!getToken() || !user) {
    return null
  }

  return children
}
