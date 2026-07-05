import Link from "next/link"
import { ArrowRight, ExternalLink, Github, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DEMO_CATALOG, getLiveDemos } from "@/lib/resources/catalog"

export default function ResourcesHubPage() {
  const liveDemos = getLiveDemos()
  const comingSoon = DEMO_CATALOG.filter((demo) => demo.status === "coming-soon")

  return (
    <div className="min-h-full">
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <div className="relative px-6 py-10 sm:px-10 sm:py-12">
            <Badge variant="secondary" className="font-mono text-[11px]">
              Resources
            </Badge>
            <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              SDK demos & tutorials
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
              Step-by-step build guides with code snippets, live demos, and GitHub source. Each
              tutorial walks from scaffold to deploy — the live app is a separate runnable project.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="outline" asChild>
                <Link href="/docs">
                  SDK documentation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Live demos</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {liveDemos.map((demo) => (
              <article
                key={demo.id}
                className="flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30 hover:bg-surface-elevated"
              >
                <div className="flex flex-wrap gap-2">
                  {demo.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[10px]">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h3 className="mt-3 text-lg font-semibold text-foreground">{demo.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {demo.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {demo.sdkPackages.map((pkg) => (
                    <code
                      key={pkg}
                      className="rounded bg-surface px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                    >
                      {pkg}
                    </code>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Button size="sm" asChild>
                    <Link href={`/resources/demos/${demo.id}`}>
                      View tutorial
                      <ArrowRight className="ml-2 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href={demo.liveDemoUrl} target="_blank" rel="noopener noreferrer">
                      <Play className="mr-1.5 h-3.5 w-3.5" />
                      Try live
                    </a>
                  </Button>
                  <Button size="sm" variant="ghost" asChild>
                    <a href={demo.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-1.5 h-3.5 w-3.5" />
                      GitHub
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {comingSoon.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Coming soon</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {comingSoon.map((demo) => (
                <article
                  key={demo.id}
                  className="rounded-xl border border-dashed border-border bg-card/50 p-6 opacity-70"
                >
                  <Badge variant="outline" className="text-[10px]">
                    Coming soon
                  </Badge>
                  <h3 className="mt-3 text-lg font-semibold text-foreground">{demo.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{demo.description}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
