import Link from "next/link"
import {
  MessageSquare,
  Video,
  Users,
  Zap,
  ArrowRight,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <Zap className="w-4 h-4" />
            <span>Low-Code Chat Infrastructure for Developers</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">
            Add Chat to Your App
            <span className="text-primary"> in Minutes, Not Months</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl text-pretty">
            Integrate fully-working messaging, calls, and presence into your web, mobile, or desktop apps with our SDKs and pre-built UI Kit — or go headless and power your own custom UI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button asChild size="lg" className="px-8 h-12 text-base">
              <Link href="/#pricing">
                View Plans
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 h-12 text-base">
              <Link href="/docs">View Documentation</Link>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              <span>Web, iOS, Android & Desktop SDKs</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              <span>Pre-built UI components</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              <span>Headless API for custom UIs</span>
            </div>
          </div>
        </div>

        <div className="mt-16 relative animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
          <div className="relative mx-auto max-w-5xl rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden shadow-2xl">
            <div className="relative flex items-center px-4 py-3 border-b border-border bg-surface/50">
              <div className="flex items-center gap-1.5" aria-hidden>
                <span className="size-3 rounded-full bg-[#ff5f57]" />
                <span className="size-3 rounded-full bg-[#febc2e]" />
                <span className="size-3 rounded-full bg-[#28c840]" />
              </div>
              <span className="pointer-events-none absolute inset-x-0 text-center text-xs text-muted-foreground font-mono">
                your-app.com — powered by @brenox/react UI Kit
              </span>
            </div>

            <div className="flex h-[400px]">
              <div className="w-16 border-r border-border bg-sidebar flex flex-col items-center py-4 gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                  P
                </div>
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground">
                  <Users className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground">
                  <MessageSquare className="w-5 h-5" />
                </div>
              </div>

              <div className="w-56 border-r border-border bg-surface p-4">
                <div className="text-sm font-semibold mb-4">Brenox Team</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-sidebar-accent text-sidebar-accent-foreground text-sm">
                    <span className="text-muted-foreground">#</span>
                    general
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground text-sm hover:bg-secondary/50 rounded-md">
                    <span>#</span>
                    engineering
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground text-sm hover:bg-secondary/50 rounded-md">
                    <span>#</span>
                    design
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground text-sm hover:bg-secondary/50 rounded-md">
                    <Video className="w-4 h-4" />
                    voice-chat
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-6 mb-2">DIRECT MESSAGES</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 px-2 py-1.5 text-sm">
                    <div className="w-6 h-6 rounded-full bg-primary/30" />
                    <span>Sarah Chen</span>
                    <div className="w-2 h-2 rounded-full bg-online ml-auto" />
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                  <span className="text-muted-foreground">#</span>
                  <span className="font-medium">general</span>
                </div>
                <div className="flex-1 p-4 space-y-4 overflow-hidden">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/30 flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">Alex Kim</span>
                        <span className="text-xs text-muted-foreground">Today at 2:34 PM</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Just shipped the new WebSocket integration. Latency is down to 12ms average!
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/30 flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">Sarah Chen</span>
                        <span className="text-xs text-muted-foreground">Today at 2:36 PM</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Amazing work! The typing indicators are so smooth now.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-typing-dot" />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-typing-dot" />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-typing-dot" />
                    </div>
                    <span>Marcus is typing...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
