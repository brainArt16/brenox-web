"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Logo } from "@/components/brand/logo"
import { cn } from "@/lib/utils"

export function LandingNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "Docs", href: "/docs" },
    { name: "Resources", href: "/resources" },
    { name: "Pricing", href: "/#pricing" },
  ]

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/40 bg-background/75 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo size="md" priority />

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/register">Start free</Link>
          </Button>
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-foreground md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <div
        className={cn(
          "border-t border-border bg-background md:hidden",
          mobileMenuOpen ? "block" : "hidden"
        )}
      >
        <div className="space-y-1 px-4 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-sm text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>
          <div className="space-y-2 border-t border-border pt-4">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button className="w-full" asChild>
              <Link href="/register">Start free</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
