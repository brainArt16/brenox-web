"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  ExternalLink,
  Info,
  Layers,
  Lightbulb,
  Loader2,
} from "lucide-react"
import { DocSection } from "@/components/docs/doc-section"
import { DocsCallout } from "@/components/docs/docs-callout"
import { DocsCapabilityGrid } from "@/components/docs/docs-capability-grid"
import { DocsCodeTabs } from "@/components/docs/docs-code-tabs"
import { DocsComingSoonPanel, DocsSdkBanner, DocsSdkMatrix, DocsSdkPicker } from "@/components/docs/docs-sdk-picker"
import { DocsHero } from "@/components/docs/docs-hero"
import { DocsQuickNav } from "@/components/docs/docs-quick-nav"
import { DocsRealtimeSection } from "@/components/docs/docs-realtime-section"
import { DocsToc } from "@/components/docs/docs-toc"
import { DocsVersionPicker } from "@/components/docs/docs-version-picker"
import { SdkIcon } from "@/components/docs/sdk-icon"
import { useDocsSdk } from "@/components/docs/use-docs-sdk"
import { CodeSnippet } from "@/components/shared/code-snippet"
import { FlowSteps } from "@/components/shared/flow-steps"
import { useAuth } from "@/providers/auth-provider"
import {
  BEST_PRACTICES,
  CONSOLE_STEPS,
  REACT_HOOKS,
  SDK_REGISTRY,
  WEBHOOK_EVENTS,
} from "@/lib/docs/content"
import { getApps } from "@/lib/api"

function gatePath(path: string, isAuthenticated: boolean) {
  return isAuthenticated ? path : `/login?next=${encodeURIComponent(path)}`
}

function DocsPageContent() {
  const { sdk, isAvailable, snippets, versions, version, setSdk, setVersion } = useDocsSdk()
  const { isAuthenticated } = useAuth()
  const [firstAppId, setFirstAppId] = useState<string | null>(null)

  const has = (id: string) => sdk.sections.includes(id as (typeof sdk.sections)[number])

  useEffect(() => {
    if (!isAuthenticated) return
    void getApps().then((apps) => {
      if (apps[0]) setFirstAppId(String(apps[0].id))
    })
  }, [isAuthenticated])

  const { sandboxHref, keysHref, webhooksHref, newAppHref } = useMemo(() => {
    const appsBase = gatePath("/apps", isAuthenticated)
    return {
      sandboxHref:
        isAuthenticated && firstAppId
          ? `/apps/${firstAppId}/sandbox`
          : gatePath("/apps", isAuthenticated),
      keysHref:
        isAuthenticated && firstAppId
          ? `/apps/${firstAppId}/keys`
          : appsBase,
      webhooksHref:
        isAuthenticated && firstAppId
          ? `/apps/${firstAppId}/webhooks`
          : appsBase,
      newAppHref: gatePath("/apps/new", isAuthenticated),
    }
  }, [firstAppId, isAuthenticated])

  const consoleSteps = CONSOLE_STEPS.map((step) => ({
    ...step,
    href:
      step.number === 1
        ? newAppHref
        : step.number === 2
          ? keysHref
          : step.number === 3
            ? sandboxHref
            : step.href,
    active: step.number === 1,
  }))

  return (
    <div className="min-h-full">
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <DocsHero sdk={sdk} version={version} sandboxHref={sandboxHref} />
        <DocsQuickNav />
        <DocsSdkBanner sdk={sdk} version={version} />
        {versions.length > 0 && (
          <DocsVersionPicker
            versions={versions}
            selected={version}
            onSelect={setVersion}
          />
        )}

        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-10">
          <div className="min-w-0 flex-1 space-y-16">
            {has("overview") && (
              <DocSection
                id="overview"
                title="What you can build"
                description="Brenox SDKs cover messaging through voice and video. Pick your language or framework — examples below update to match."
              >
                <DocsCapabilityGrid />
                <DocsCallout icon={Layers} title="SDK-first integration" variant="tip">
                  Integrate through official SDKs only. Use the developer console for apps, keys, and
                  webhooks — never call the platform HTTP API directly from your product.
                </DocsCallout>
              </DocSection>
            )}

            {has("sdks") && (
              <DocSection
                id="sdks"
                title="Choose your SDK"
                description="Select the library for your stack. Documentation, snippets, and table of contents adapt automatically."
              >
                <DocsSdkPicker selectedId={sdk.id} onSelect={setSdk} variant="section" />
                <DocsSdkMatrix selectedId={sdk.id} />
              </DocSection>
            )}

            {has("quickstart") && (
              <DocSection
                id="quickstart"
                title="Quick start"
                badge={isAvailable ? "~5 min" : sdk.status}
                description={
                  isAvailable
                    ? `Install ${sdk.packageName} and send your first message.`
                    : `${sdk.name} is not published yet — preview the planned workflow below.`
                }
              >
                {isAvailable ? (
                  <DocsCodeTabs
                    language={sdk.codeLanguage}
                    tabs={[
                      { id: "install", label: "Install", code: snippets.install, language: "bash" },
                      { id: "env", label: "Environment", code: snippets.env, language: "bash" },
                      { id: "code", label: "First message", code: snippets.quickStart },
                    ]}
                  />
                ) : (
                  <DocsComingSoonPanel sdk={sdk} />
                )}
                {isAvailable && (
                  <DocsCallout icon={Lightbulb} title="Package managers" variant="info">
                    <code className="font-mono text-xs">@brenox/*</code> packages are published to npm.
                    Use <strong className="font-medium text-foreground">npm</strong>,{" "}
                    <strong className="font-medium text-foreground">pnpm</strong>, or{" "}
                    <strong className="font-medium text-foreground">yarn</strong> — imports and
                    usage are identical after install.
                  </DocsCallout>
                )}
                {isAvailable && (
                  <DocsCallout icon={Lightbulb} title="Credentials" variant="info">
                    Create an app under{" "}
                    <Link href={newAppHref} className="font-medium text-primary hover:underline">
                      Apps → New app
                    </Link>
                    , then a sandbox key at{" "}
                    <Link href={keysHref} className="font-medium text-primary hover:underline">
                      API Keys
                    </Link>
                    .
                  </DocsCallout>
                )}
              </DocSection>
            )}

            {has("console") && (
              <DocSection id="console" title="Console setup" description="Four steps from zero to a working integration.">
                <FlowSteps steps={consoleSteps} />
              </DocSection>
            )}

            {has("auth") && isAvailable && (
              <DocSection id="auth" title="Authentication" description="Two credential types - one for users, one for your server.">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-card p-5">
                    <p className="font-mono text-xs text-muted-foreground">
                      {sdk.role === "framework" ? "Via @brenox/sdk" : sdk.packageName}
                    </p>
                    <p className="mt-2 text-sm font-medium text-foreground">User sessions</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      End users sign in through the SDK. Tokens persist and refresh automatically.
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-5">
                    <p className="font-mono text-xs text-muted-foreground">BrenoxServer</p>
                    <p className="mt-2 text-sm font-medium text-foreground">Server API keys</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      Keys from App → API Keys. Never expose{" "}
                      <code className="font-mono text-xs">bx_*</code> in client code.
                    </p>
                  </div>
                </div>
              </DocSection>
            )}

            {has("messaging") && isAvailable && snippets.messaging && (
              <DocSection
                id="messaging"
                title="Messaging"
                badge={sdk.packageName}
                description="REST for history, WebSocket for live delivery, plus attachments and presence."
              >
                <DocsCodeTabs
                  language={sdk.codeLanguage}
                  tabs={[
                    { id: "messages", label: "Send & list", code: snippets.messaging },
                    ...(snippets.attachments
                      ? [{ id: "files", label: "Attachments", code: snippets.attachments }]
                      : []),
                  ]}
                />
              </DocSection>
            )}

            {has("realtime") && isAvailable && snippets.realtime && (
              <DocsRealtimeSection
                connectCode={snippets.realtime}
                codeLanguage={sdk.codeLanguage}
                usesHooks={sdk.role === "framework"}
              />
            )}

            {has("calls") && isAvailable && snippets.calls && (
              <DocSection id="calls" title="Voice & video calls" badge="CallSignaling">
                <CodeSnippet code={snippets.calls} title="Initiate a call" language={sdk.codeLanguage} />
                {snippets.callsNote && (
                  <CodeSnippet code={snippets.callsNote} title="SDK vs your code" language="guide" />
                )}
                <DocsCallout icon={Info} title="Signaling, not media" variant="warning">
                  The SDK exchanges SDP and ICE. You implement RTCPeerConnection, media capture, and
                  STUN/TURN for production.
                </DocsCallout>
              </DocSection>
            )}

            {has("server") && isAvailable && snippets.server && (
              <DocSection id="server" title="Server SDK" badge="BrenoxServer">
                <CodeSnippet code={snippets.server} title="Provision & send" language={sdk.codeLanguage} />
                <Link href={sandboxHref} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                  Try in sandbox
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </DocSection>
            )}

            {has("framework") && isAvailable && (
              <DocSection id="framework" title="Framework hooks" badge={sdk.packageName}>
                <CodeSnippet
                  code={snippets.framework || snippets.quickStart}
                  title="Provider + hooks"
                  language={sdk.codeLanguage}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  {REACT_HOOKS.map((hook) => (
                    <div key={hook.name} className="rounded-xl border border-border bg-card p-4">
                      <p className="font-mono text-sm font-medium text-primary">{hook.name}</p>
                      <p className="mt-1.5 text-sm text-muted-foreground">{hook.description}</p>
                      <code className="mt-3 block overflow-x-auto rounded-md bg-surface px-2 py-1.5 font-mono text-[10px] text-muted-foreground">
                        {hook.snippet}
                      </code>
                    </div>
                  ))}
                </div>
              </DocSection>
            )}

            {has("webhooks") && (
              <DocSection id="webhooks" title="Webhooks">
                <div className="grid gap-3 sm:grid-cols-3">
                  {WEBHOOK_EVENTS.map((event) => (
                    <div key={event.name} className="rounded-xl border border-border bg-card p-4">
                      <p className="font-mono text-xs">{event.name}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  ))}
                </div>
                {snippets.webhookVerify && isAvailable && (
                  <CodeSnippet code={snippets.webhookVerify} title="Verify signatures" language="typescript" />
                )}
                <Link href={webhooksHref} className="text-sm font-medium text-primary hover:underline">
                  Register webhooks →
                </Link>
              </DocSection>
            )}

            {has("best-practices") && (
              <DocSection id="best-practices" title="Best practices">
                <div className="grid gap-4 sm:grid-cols-3">
                  {BEST_PRACTICES.map((item) => (
                    <div key={item.title} className="rounded-xl border border-border bg-card p-4">
                      <item.icon className="h-5 w-5 text-muted-foreground" />
                      <p className="mt-3 text-sm font-medium">{item.title}</p>
                      <p className="mt-1.5 text-sm text-muted-foreground">{item.body}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <p className="text-sm font-medium">All SDK packages</p>
                  {SDK_REGISTRY.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          {pkg.icon ? (
                            <SdkIcon src={pkg.icon} alt={pkg.name} size={18} />
                          ) : null}
                          <p className="font-mono text-sm font-medium">{pkg.packageName}</p>
                          <span className="text-xs text-muted-foreground">· {pkg.language}</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{pkg.description}</p>
                      </div>
                      {pkg.installCommand && (
                        <code className="shrink-0 rounded-lg bg-surface px-3 py-2 font-mono text-[11px] text-muted-foreground">
                          {pkg.installCommand}
                        </code>
                      )}
                    </div>
                  ))}
                </div>
              </DocSection>
            )}
          </div>

          <aside className="hidden w-56 shrink-0 lg:block">
            <div className="sticky top-20 space-y-6">
              <DocsSdkPicker selectedId={sdk.id} onSelect={setSdk} variant="sidebar" />
              <DocsToc sdkId={sdk.id} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default function DocsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <DocsPageContent />
    </Suspense>
  )
}
