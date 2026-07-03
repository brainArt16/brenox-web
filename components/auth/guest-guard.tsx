"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { getToken } from "@/lib/engine/session"

export function GuestGuard({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) return
    if (getToken() && user) {
      router.replace("/apps")
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (getToken() && user) {
    return null
  }

  return children
}
