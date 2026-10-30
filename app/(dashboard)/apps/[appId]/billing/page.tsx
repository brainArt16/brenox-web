"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

/** Billing moved to account-level — redirect old app billing URLs. */
export default function AppBillingRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/settings/billing")
  }, [router])

  return (
    <div className="flex items-center justify-center py-24 text-muted-foreground">
      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      Redirecting to account billing…
    </div>
  )
}
