"use client"

import { type ReactNode } from "react"
import { LazyMotion, domAnimation } from "framer-motion"
import { QueryProvider } from "./query-provider"
import { ThemeProvider } from "./theme-provider"
import { AuthProvider } from "./auth-provider"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <LazyMotion features={domAnimation} strict>
            {children}
          </LazyMotion>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
