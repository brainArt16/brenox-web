"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  fetchCurrentUser,
  login as loginRequest,
  logout as logoutSession,
  register as registerRequest,
  type LoginInput,
  type RegisterInput,
} from "@/lib/engine/auth"
import { getToken } from "@/lib/engine/session"
import type { UserProfile } from "@/lib/types"

interface AuthContextValue {
  user: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (input: LoginInput, remember?: boolean) => Promise<void>
  register: (input: RegisterInput, remember?: boolean) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    if (!getToken()) {
      setUser(null)
      return
    }
    const profile = await fetchCurrentUser()
    setUser(profile)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      if (!getToken()) {
        if (!cancelled) {
          setUser(null)
          setIsLoading(false)
        }
        return
      }

      try {
        const profile = await fetchCurrentUser()
        if (!cancelled) setUser(profile)
      } catch {
        logoutSession()
        if (!cancelled) setUser(null)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void bootstrap()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (input: LoginInput, remember = true) => {
    const profile = await loginRequest(input, remember)
    setUser(profile)
  }, [])

  const register = useCallback(async (input: RegisterInput, remember = true) => {
    const profile = await registerRequest(input, remember)
    setUser(profile)
  }, [])

  const logout = useCallback(() => {
    logoutSession()
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, register, logout, refreshUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return ctx
}
