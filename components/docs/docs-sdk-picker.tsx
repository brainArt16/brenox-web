"use client"

import { cn } from "@/lib/utils"
import {
  SDK_CATEGORIES,
  SDK_FEATURE_LABELS,
  SDK_REGISTRY,
  type SdkDefinition,
  type SdkFeatureKey,
  type SdkStatus,
} from "@/lib/docs/sdk-registry"
import type { SdkVersionDoc } from "@/lib/docs/sdk-versions"
import { Badge } from "@/components/ui/badge"
import { Check, Clock, FlaskConical } from "lucide-react"

const STATUS_LABEL: Record<SdkStatus, string> = {
  available: "Available",
  beta: "Beta",
  coming_soon: "Coming soon",
}

interface DocsSdkPickerProps {
  selectedId: string
  onSelect: (id: string) => void
  /** full: main content with matrix. sidebar: compact list. section: cards only, no heading/matrix */
  variant?: "full" | "sidebar" | "section"
}

export function DocsSdkPicker({ selectedId, onSelect, variant = "full" }: DocsSdkPickerProps) {
  if (variant === "sidebar") {
    return (
      <div className="space-y-1">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Your SDK
        </p>
        {SDK_REGISTRY.map((sdk) => (
          <button
            key={sdk.id}
            type="button"
            onClick={() => onSelect(sdk.id)}
            className={cn(
              "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors",
              selectedId === sdk.id
                ? "bg-primary/10 font-medium text-primary"
                : "text-muted-foreground hover:bg-surface hover:text-foreground",
            )}
          >
            <span className="truncate">{sdk.language}</span>
            <SdkStatusBadge status={sdk.status} />
          </button>
        ))}
      </div>
    )
  }

  const showHeader = variant === "full"
  const showMatrix = variant === "full"

  return (
    <div className="space-y-8">
      {showHeader && (
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Choose your SDK
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Pick the library that matches your stack. Documentation and code examples update
            automatically. More languages and frameworks are on the roadmap.
          </p>
        </div>
      )}

      {SDK_CATEGORIES.map((category) => {
        const sdks = SDK_REGISTRY.filter((s) => s.category === category.id)
        return (
          <div key={category.id}>
            <div className="mb-3">
              <p className="text-sm font-medium text-foreground">{category.label}</p>
              <p className="text-xs text-muted-foreground">{category.description}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sdks.map((sdk) => (
                <SdkCard
                  key={sdk.id}
                  sdk={sdk}
                  selected={selectedId === sdk.id}
                  onSelect={() => onSelect(sdk.id)}
                />
              ))}
            </div>
          </div>
        )
      })}

      {showMatrix && <DocsSdkMatrix selectedId={selectedId} />}
    </div>
  )
}

function SdkCard({
  sdk,
  selected,
  onSelect,
}: {
  sdk: SdkDefinition
  selected: boolean
  onSelect: () => void
}) {
  const disabled = sdk.status === "coming_soon"

  return (
    <button
      type="button"
      data-sdk-id={sdk.id}
      onClick={onSelect}
      className={cn(
        "group relative flex flex-col rounded-xl border p-4 text-left transition-all",
        selected
          ? "border-primary bg-primary/5 ring-1 ring-primary/30"
          : "border-border bg-card hover:border-primary/25 hover:bg-surface-elevated",
        disabled && !selected && "opacity-90",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-foreground">{sdk.name}</p>
          <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{sdk.packageName}</p>
        </div>
        <SdkStatusBadge status={sdk.status} />
      </div>

      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        {sdk.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-1">
        {sdk.bestFor.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-surface px-1.5 py-0.5 text-[10px] text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      {sdk.note && (
        <p className="mt-2 text-[10px] text-muted-foreground">{sdk.note}</p>
      )}

      {selected && (
        <span className="absolute bottom-3 right-3 h-2 w-2 rounded-full bg-primary" />
      )}
    </button>
  )
}

function SdkStatusBadge({ status }: { status: SdkStatus }) {
  return (
    <Badge
      variant={status === "available" ? "default" : "secondary"}
      className={cn(
        "shrink-0 text-[10px] font-normal",
        status === "coming_soon" && "bg-surface text-muted-foreground",
        status === "beta" && "bg-warning/15 text-warning",
      )}
    >
      {status === "coming_soon" ? (
        <Clock className="mr-1 h-3 w-3" />
      ) : status === "beta" ? (
        <FlaskConical className="mr-1 h-3 w-3" />
      ) : null}
      {STATUS_LABEL[status]}
    </Badge>
  )
}

export function DocsSdkMatrix({ selectedId }: { selectedId: string }) {
  const features = Object.keys(SDK_FEATURE_LABELS) as SdkFeatureKey[]

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <p className="text-sm font-medium text-foreground">Feature comparison</p>
        <p className="text-xs text-muted-foreground">
          Highlighted column:{" "}
          <span className="font-medium text-primary">
            {SDK_REGISTRY.find((s) => s.id === selectedId)?.name}
          </span>
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-left">
              <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Feature</th>
              {SDK_REGISTRY.map((sdk) => (
                <th
                  key={sdk.id}
                  className={cn(
                    "px-3 py-2.5 text-center text-[11px] font-medium",
                    sdk.id === selectedId ? "bg-primary/10 text-primary" : "text-muted-foreground",
                  )}
                >
                  {sdk.language}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {features.map((feature) => (
              <tr key={feature}>
                <td className="px-4 py-2 text-xs text-foreground">
                  {SDK_FEATURE_LABELS[feature]}
                </td>
                {SDK_REGISTRY.map((sdk) => (
                  <td
                    key={sdk.id}
                    className={cn(
                      "px-3 py-2 text-center",
                      sdk.id === selectedId && "bg-primary/5",
                    )}
                  >
                    {sdk.features.includes(feature) ? (
                      sdk.status === "coming_soon" ? (
                        <Clock className="mx-auto h-3.5 w-3.5 text-muted-foreground" />
                      ) : (
                        <Check className="mx-auto h-3.5 w-3.5 text-success" />
                      )
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function DocsSdkBanner({
  sdk,
  version,
}: {
  sdk: SdkDefinition
  version?: SdkVersionDoc
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface-elevated px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted-foreground">
          Viewing docs for{" "}
          <span className="font-medium text-foreground">{sdk.name}</span>
          <span className="ml-2 font-mono text-xs text-primary">
            {version ? `${sdk.packageName}@${version.version}` : sdk.packageName}
          </span>
        </p>
        {version?.installPackages && sdk.status === "available" && (
          <code className="mt-1 block font-mono text-[11px] text-muted-foreground">
            npm install {version.installPackages}
          </code>
        )}
      </div>
      {version && (
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase",
            version.status === "current" && "bg-primary/15 text-primary",
            version.status === "deprecated" && "bg-warning/15 text-warning",
            version.status === "supported" && "bg-surface text-muted-foreground",
          )}
        >
          {version.status}
        </span>
      )}
      {!version && <SdkStatusBadge status={sdk.status} />}
    </div>
  )
}

export function DocsComingSoonPanel({ sdk }: { sdk: SdkDefinition }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-surface p-8 text-center">
      <Clock className="mx-auto h-10 w-10 text-muted-foreground" />
      <p className="mt-4 text-lg font-medium text-foreground">{sdk.name} SDK — coming soon</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{sdk.description}</p>
      {sdk.installCommand && (
        <code className="mt-4 inline-block rounded-lg bg-card px-4 py-2 font-mono text-xs text-muted-foreground">
          {sdk.installCommand}
        </code>
      )}
      <p className="mt-4 text-xs text-muted-foreground">
        Planned features:{" "}
        {sdk.features.map((f) => SDK_FEATURE_LABELS[f]).join(" · ")}
      </p>
      <p className="mt-6 text-sm text-muted-foreground">
        Use{" "}
        <button
          type="button"
          className="font-medium text-primary hover:underline"
          onClick={() => {
            const el = document.querySelector('[data-sdk-id="typescript"]')
            el?.scrollIntoView({ behavior: "smooth" })
          }}
        >
          JavaScript / TypeScript
        </button>{" "}
        today, or follow progress on GitHub.
      </p>
    </div>
  )
}
