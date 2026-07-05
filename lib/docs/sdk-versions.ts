/**
 * SDK version catalog for developer documentation.
 *
 * Start with one row per SDK (initial release). When you ship a new version:
 * 1. Bump version in the SDK repo package.json (source of truth for publishing).
 * 2. Prepend a new row here; mark the previous "current" as "supported" (or "deprecated").
 * 3. Update snippets in sdk-snippets.ts only if APIs changed in that version.
 *
 * Docs URLs: /docs?sdk=typescript&v=0.1.0
 */

export type SdkVersionStatus = "current" | "supported" | "deprecated" | "beta"

export interface SdkVersionDoc {
  /** Semver, e.g. 0.1.0 */
  version: string
  status: SdkVersionStatus
  /** ISO date string */
  released?: string
  /** Shown in version picker and changelog panel */
  highlights: string[]
  /**
   * Exact install target(s) for this version.
   * Example: "@brenox/sdk@0.1.0" or "@brenox/react@0.1.0 @brenox/sdk@0.1.0"
   */
  installPackages: string
  /** Optional warning when viewing old docs */
  deprecationMessage?: string
}

/** Per-SDK version history — newest first */
export const SDK_VERSION_CATALOG: Record<string, SdkVersionDoc[]> = {
  typescript: [
    {
      version: "0.1.3",
      status: "current",
      released: "2026-07-05",
      highlights: [
        "BrenoxServer.sessions.create() — issue embed JWTs via POST /v1/sessions",
        "CreateSessionInput and DeveloperSession types on @brenox/sdk/server",
        "Embed-first flow: backend provisions users, frontend receives session tokens",
      ],
      installPackages: "@brenox/sdk@0.1.3",
    },
    {
      version: "0.1.1",
      status: "supported",
      released: "2026-07-04",
      highlights: [
        "npm README and package metadata with live documentation links",
        "Published to npm with homepage and repository fields",
      ],
      installPackages: "@brenox/sdk@0.1.1",
    },
    {
      version: "0.1.0",
      status: "supported",
      released: "2026-07-04",
      highlights: [
        "Initial public release — BrenoxClient for browsers and Node",
        "Auth, workspaces, channels, messaging (REST + WebSocket)",
        "Typing, presence, notifications, and attachments",
        "BrenoxServer for backend / API key integrations",
        "Call signaling helper (WebRTC SDP & ICE)",
      ],
      installPackages: "@brenox/sdk@0.1.0",
    },
  ],
  react: [
    {
      version: "0.1.3",
      status: "current",
      released: "2026-07-05",
      highlights: [
        "Published alongside @brenox/sdk@0.1.3",
        "useCallSignaling unchanged — pairs with embed session tokens from your backend",
      ],
      installPackages: "@brenox/react@0.1.3 @brenox/sdk@0.1.3",
    },
    {
      version: "0.1.1",
      status: "supported",
      released: "2026-07-04",
      highlights: [
        "npm README with links to live React SDK documentation",
        "Published alongside @brenox/sdk@0.1.1",
      ],
      installPackages: "@brenox/react@0.1.1 @brenox/sdk@0.1.1",
    },
    {
      version: "0.1.0",
      status: "supported",
      released: "2026-07-04",
      highlights: [
        "Initial public release — BrenoxProvider + React hooks",
        "useMessages, useChannel, useNotifications, useCallSignaling",
        "Requires @brenox/sdk >= 0.1.0",
      ],
      installPackages: "@brenox/react@0.1.0 @brenox/sdk@0.1.0",
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
