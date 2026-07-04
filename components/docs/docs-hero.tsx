import Link from "next/link"
import { ArrowRight, BookOpen, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface DocsHeroProps {
  sandboxHref: string
}

export function DocsHero({ sandboxHref }: DocsHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      <div className="relative px-6 py-10 sm:px-10 sm:py-12">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="font-mono text-[11px]">
            @brenox/sdk v0.4
          </Badge>
          <Badge variant="outline" className="text-[11px]">
            Messaging → Calls
          </Badge>
        </div>

        <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Build chat, voice &amp; video with the Brenox SDK
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
          Everything you need to integrate realtime communication — install the SDK, create an app
          in this console, and ship in minutes. No direct platform API required.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <a href="#quickstart">
              Get started
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button variant="outline" asChild>
            <Link href={sandboxHref}>Open sandbox</Link>
          </Button>
          <Button variant="ghost" asChild>
            <a
              href="https://github.com/brainArt16/brenox-sdk"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </a>
          </Button>
          <Button variant="ghost" asChild>
            <a
              href="https://github.com/brainArt16/brenox-sdk/blob/main/docs/DEVELOPER_GUIDE.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Full guide
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
