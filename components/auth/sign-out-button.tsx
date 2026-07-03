"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { Button, type ButtonProps } from "@/components/ui/button"

type SignOutButtonProps = Omit<ButtonProps, "onClick"> & {
  label?: string
}

export function SignOutButton({ label = "Sign out", ...props }: SignOutButtonProps) {
  const router = useRouter()
  const { logout } = useAuth()

  function handleSignOut() {
    logout()
    router.replace("/login")
  }

  return (
    <Button type="button" onClick={handleSignOut} {...props}>
      {label}
    </Button>
  )
}
