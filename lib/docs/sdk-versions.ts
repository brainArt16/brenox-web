/**
 * SDK version catalog for developer documentation.
 *
 * Maintainer workflow when shipping a new SDK release:
 * 1. Bump version in the SDK repo package.json (source of truth for publishing).
 * 2. Add a row here under the matching sdk id (copy from CHANGELOG).
 * 3. Mark the previous "current" as "supported" (or "deprecated" if breaking).
 * 4. Update snippets in sdk-snippets.ts only if APIs changed in that version.
 *
 * Docs URLs: /docs?sdk=typescript&v=0.4.0
 */

export type SdkVersionStatus = "current" | "supported" | "deprecated" | "beta"

export interface SdkVersionDoc {
  /** Semver, e.g. 0.4.0 */
  version: string
  status: SdkVersionStatus
  /** ISO date string */
  released?: string
  /** Shown in version picker and changelog panel */
  highlights: string[]
  /**
   * Exact install target(s) for this version.
   * Example: "@brenox/sdk@0.4.0" or "@brenox/react@0.1.0 @brenox/sdk@0.4.0"
   */
  installPackages: string
  /** Optional warning when viewing old docs */
  deprecationMessage?: string
}

/** Per-SDK version history — newest first */
export const SDK_VERSION_CATALOG: Record<string, SdkVersionDoc[]> = {
  typescript: [
    {
      version: "0.4.0",
      status: "current",
      released: "2026-03-01",
      highlights: [
        "Notifications API",
        "Attachments / presigned uploads",
        "@brenox/react hooks package",
      ],
      installPackages: "@brenox/sdk@0.4.0",
    },
    {
      version: "0.3.0",
      status: "supported",
      released: "2026-02-01",
      highlights: [
        "BrenoxServer (backend / API key integrations)",
        "App management on client",
        "Call signaling helper",
      ],
      installPackages: "@brenox/sdk@0.3.0",
    },
    {
      version: "0.2.0",
      status: "supported",
      released: "2026-01-15",
      highlights: [
        "WebSocket channel client",
        "Typing indicators & reconnect",
        "Sequence tracking + REST backfill",
      ],
      installPackages: "@brenox/sdk@0.2.0",
    },
    {
      version: "0.1.0",
      status: "deprecated",
      released: "2025-12-01",
      highlights: ["Initial REST + auth", "Workspaces, channels, messages"],
      installPackages: "@brenox/sdk@0.1.0",
      deprecationMessage:
        "v0.1.0 lacks WebSocket and BrenoxServer. Upgrade to 0.4.x for current features.",
    },
  ],
  react: [
    {
      version: "0.1.0",
      status: "current",
      released: "2026-03-01",
      highlights: [
        "BrenoxProvider",
        "useMessages, useChannel, useNotifications, useCallSignaling",
        "Requires @brenox/sdk >= 0.4.0",
      ],
      installPackages: "@brenox/react@0.1.0 @brenox/sdk@0.4.0",
    },
  ],
  python: [],
  go: [],
  flutter: [],
  vue: [],
  "react-native": [],
}

export function getVersionsForSdk(sdkId: string): SdkVersionDoc[] {
  return SDK_VERSION_CATALOG[sdkId] ?? []
}

export function getVersionDoc(sdkId: string, version: string): SdkVersionDoc | undefined {
  return getVersionsForSdk(sdkId).find((v) => v.version === version)
}

/** Latest published version for an SDK (first entry in catalog) */
export function getDefaultVersion(sdkId: string): SdkVersionDoc | undefined {
  return getVersionsForSdk(sdkId)[0]
}

export function getVersionOrDefault(
  sdkId: string,
  versionParam: string | null,
): SdkVersionDoc | undefined {
  const versions = getVersionsForSdk(sdkId)
  if (versions.length === 0) return undefined

  if (versionParam) {
    const match = getVersionDoc(sdkId, versionParam)
    if (match) return match
  }

  return versions.find((v) => v.status === "current") ?? versions[0]
}

export function isVersionDeprecated(version: SdkVersionDoc): boolean {
  return version.status === "deprecated"
}

export function buildDocsQuery(sdkId: string, version?: string): string {
  const params = new URLSearchParams({ sdk: sdkId })
  if (version) params.set("v", version)
  return `/docs?${params.toString()}`
}
