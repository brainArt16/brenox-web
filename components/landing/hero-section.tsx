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
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/15 rounded-full blur-3xl" />
      </div>

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
              <Link href="/register">
                Start Free
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
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface/50">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-warning/60" />
              <div className="w-3 h-3 rounded-full bg-success/60" />
              <span className="ml-4 text-xs text-muted-foreground font-mono">
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

          <div className="absolute -left-4 top-1/3 bg-card border border-border rounded-lg p-3 shadow-xl hidden lg:block">
            <div className="text-xs text-muted-foreground">Active Users</div>
            <div className="text-2xl font-bold text-primary">2.4K</div>
            <div className="text-xs text-success">+12% today</div>
          </div>

          <div className="absolute -right-4 top-1/2 bg-card border border-border rounded-lg p-3 shadow-xl hidden lg:block">
            <div className="text-xs text-muted-foreground">Messages/sec</div>
            <div className="text-2xl font-bold text-accent">847</div>
            <div className="flex gap-1 mt-1">
              {[4, 7, 3, 8, 5, 9, 6].map((h, i) => (
                <div key={i} className="w-1 bg-accent/60 rounded-full" style={{ height: h * 3 }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
