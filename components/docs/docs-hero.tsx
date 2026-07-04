import Link from "next/link"
import { ArrowRight, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SdkIcon } from "@/components/docs/sdk-icon"
import type { SdkDefinition } from "@/lib/docs/sdk-registry"
import type { SdkVersionDoc } from "@/lib/docs/sdk-versions"

interface DocsHeroProps {
  sdk: SdkDefinition
  version?: SdkVersionDoc
  sandboxHref: string
}

export function DocsHero({ sdk, version, sandboxHref }: DocsHeroProps) {
  const isAvailable = sdk.status === "available" || sdk.status === "beta"

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      <div className="relative px-6 py-10 sm:px-10 sm:py-12">
        <div className="flex items-start gap-4">
          {sdk.icon ? (
            <div className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-surface border border-border">
              <SdkIcon src={sdk.icon} alt={sdk.name} size={32} />
            </div>
          ) : null}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="font-mono text-[11px]">
                {version ? `${sdk.packageName}@${version.version}` : sdk.packageName}
              </Badge>
              <Badge variant={isAvailable ? "default" : "outline"} className="text-[11px]">
                {isAvailable ? "Available now" : "Coming soon"}
              </Badge>
              <Badge variant="outline" className="text-[11px]">
                Messaging → Calls
              </Badge>
            </div>

            <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {isAvailable ? `Build with ${sdk.name}` : `${sdk.name} SDK is on the way`}
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
              {sdk.description} Pick your stack below — docs and examples update per SDK.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <a href="#sdks">
              Choose SDK
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
          {isAvailable && (
            <>
              <Button variant="outline" asChild>
                <a href="#quickstart">Quick start</a>
              </Button>
              <Button variant="outline" asChild>
                <Link href={sandboxHref}>Sandbox</Link>
              </Button>
            </>
          )}
          {sdk.githubUrl && (
            <Button variant="ghost" asChild>
              <a href={sdk.githubUrl} target="_blank" rel="noopener noreferrer">
                <SdkIcon src="/icons/GitHub.svg" alt="GitHub" size={16} className="mr-2" />
                GitHub
              </a>
            </Button>
          )}
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
