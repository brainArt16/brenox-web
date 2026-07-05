"use client"

import Link from "next/link"
import { ArrowRight, ExternalLink, FileCode, Github, Lightbulb, Play } from "lucide-react"
import { DocSection } from "@/components/docs/doc-section"
import { DocsCallout } from "@/components/docs/docs-callout"
import { ResourcesToc } from "@/components/resources/resources-toc"
import { CodeSnippet } from "@/components/shared/code-snippet"
import { FlowSteps } from "@/components/shared/flow-steps"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { DemoResource } from "@/lib/resources/catalog"
import { getChatSnippet } from "@/lib/resources/demos/chat/snippets"

function getSnippet(demoId: string, key: string) {
  if (demoId === "chat") return getChatSnippet(key)
  return undefined
}

function ProseBlock({ text }: { text: string }) {
  const blocks = text.split("\n\n")

  return (
    <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
      {blocks.map((block, index) => {
        if (block.startsWith("| Surface |")) {
          const rows = block.split("\n").filter((line) => line.startsWith("|") && !line.includes("---"))
          return (
            <div key={index} className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    {rows[0]
                      ?.split("|")
                      .filter(Boolean)
                      .map((cell, i) => (
                        <th key={i} className="px-4 py-2 font-medium text-foreground">
                          {cell.trim()}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-border last:border-0">
                      {row
                        .split("|")
                        .filter(Boolean)
                        .map((cell, i) => (
                          <td key={i} className="px-4 py-2">
                            {cell.trim().startsWith("[") ? (
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: cell
                                    .trim()
                                    .replace(
                                      /\[([^\]]+)\]\(([^)]+)\)/g,
                                      '<a href="$2" class="font-medium text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>',
                                    ),
                                }}
                              />
                            ) : (
                              <code className="font-mono text-xs">{cell.trim()}</code>
                            )}
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }

        if (block.startsWith("**") && block.includes("**")) {
          const [heading, ...rest] = block.split("\n")
          const headingText = heading.replace(/\*\*/g, "")
          return (
            <div key={index}>
              <p className="font-medium text-foreground">{headingText}</p>
              {rest.length > 0 && (
                <p className="mt-2 whitespace-pre-wrap">{rest.join("\n")}</p>
              )}
            </div>
          )
        }

        const html = block
          .replace(/`([^`]+)`/g, '<code class="font-mono text-xs text-foreground">$1</code>')
          .replace(
            /\[([^\]]+)\]\(([^)]+)\)/g,
            '<a href="$2" class="font-medium text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>',
          )

        return (
          <p
            key={index}
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )
      })}
    </div>
  )
}

interface DemoTutorialViewProps {
  demo: DemoResource
}

export function DemoTutorialView({ demo }: DemoTutorialViewProps) {
  const flowSteps = demo.steps.map((step, index) => ({
    number: step.number,
    title: step.title,
    description: step.description,
    href: `#${step.id}`,
    active: index === 0,
  }))

  return (
    <div className="min-h-full">
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <div className="relative px-6 py-10 sm:px-10 sm:py-12">
            <div className="flex flex-wrap gap-2">
              {demo.sdkPackages.map((pkg) => (
                <Badge key={pkg} variant="secondary" className="font-mono text-[11px]">
                  {pkg}
                </Badge>
              ))}
              <Badge variant={demo.status === "live" ? "default" : "outline"} className="text-[11px]">
                {demo.status === "live" ? "Live demo" : "Coming soon"}
              </Badge>
              {demo.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-[11px]">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {demo.title} — step-by-step tutorial
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
              {demo.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <a href={demo.liveDemoUrl} target="_blank" rel="noopener noreferrer">
                  <Play className="mr-2 h-4 w-4" />
                  Try live demo
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={demo.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  View on GitHub
                  <ExternalLink className="ml-2 h-3.5 w-3.5" />
                </a>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/docs?sdk=react">
                  SDK docs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <DocsCallout icon={Lightbulb} title="Three surfaces" variant="tip">
          This tutorial lives on brenox-web. The{" "}
          <a
            href={demo.liveDemoUrl}
            className="font-medium text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            live demo
          </a>{" "}
          is a separate runnable app. Full source is on{" "}
          <a
            href={demo.githubUrl}
            className="font-medium text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .
        </DocsCallout>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Overview</h2>
          <FlowSteps steps={flowSteps} />
        </section>

        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-10">
          <div className="min-w-0 flex-1 space-y-16">
            {demo.steps.map((step, index) => {
              const snippet = getSnippet(demo.id, step.snippetKey)
              const nextStep = demo.steps[index + 1]

              return (
                <DocSection
                  key={step.id}
                  id={step.id}
                  title={`${step.number}. ${step.title}`}
                  description={step.description}
                  badge={`Step ${step.number}`}
                >
                  <ProseBlock text={step.prose} />

                  {snippet && (
                    <CodeSnippet
                      code={snippet.code}
                      title={snippet.title}
                      language={snippet.language}
                    />
                  )}

                  {step.files && step.files.length > 0 && (
                    <div className="rounded-xl border border-border bg-card p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <FileCode className="h-4 w-4 text-muted-foreground" />
                        Files in this step
                      </div>
                      <ul className="mt-2 space-y-1">
                        {step.files.map((file) => (
                          <li key={file} className="font-mono text-xs text-muted-foreground">
                            {file}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {nextStep && (
                    <Link
                      href={`#${nextStep.id}`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                      Next: {nextStep.title}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </DocSection>
              )
            })}
          </div>

          <aside className="hidden w-56 shrink-0 lg:block">
            <div className="sticky top-20 space-y-6">
              <ResourcesToc steps={demo.steps} />
              <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Quick links
                </p>
                <a
                  href={demo.liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Play className="h-3.5 w-3.5" />
                  Try live demo
                </a>
                <a
                  href={demo.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Github className="h-3.5 w-3.5" />
                  GitHub source
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
