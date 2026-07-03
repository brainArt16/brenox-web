import { type ReactNode } from "react"
import { GuestGuard } from "@/components/auth/guest-guard"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <GuestGuard>{children}</GuestGuard>
      </div>
    </div>
  )
}
