"use client"

import { cn } from "@/lib/utils"
import { getDocSectionsForSdk } from "@/lib/docs/sdk-registry"
import { useDocsSdk } from "@/components/docs/use-docs-sdk"

export function DocsQuickNav() {
  const { sdkId } = useDocsSdk()
  const sections = getDocSectionsForSdk(sdkId).filter((s) =>
    ["quickstart", "browser-origins", "sandbox", "api-keys", "messaging", "calls", "framework", "webhooks"].includes(s.id),
  )

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none lg:hidden">
      <a
        href="#sdks"
        className={cn(
          "shrink-0 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5",
          "text-xs font-medium text-primary",
        )}
      >
        SDKs
      </a>
      {sections.map((link) => (
        <a
          key={link.id}
          href={`#${link.id}`}
          className={cn(
            "shrink-0 rounded-full border border-border bg-surface px-3.5 py-1.5",
            "text-xs font-medium text-muted-foreground transition-colors",
            "hover:border-primary/30 hover:bg-surface-elevated hover:text-foreground",
          )}
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}
