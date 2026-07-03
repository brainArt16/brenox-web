"use client"

import { type ReactNode } from "react"
import { LazyMotion, domAnimation } from "framer-motion"
import { QueryProvider } from "./query-provider"
import { ThemeProvider } from "./theme-provider"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <LazyMotion features={domAnimation} strict>
          {children}
        </LazyMotion>
      </QueryProvider>
    </ThemeProvider>
  )
}
