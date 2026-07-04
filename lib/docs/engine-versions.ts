/**
 * Brenox engine release catalog for developer documentation.
 *
 * When you ship a new engine release:
 * 1. Bump VERSION in brenox-engine (source of truth).
 * 2. Prepend a row here; mark the previous "current" as "supported".
 * 3. Confirm baseUrl matches production (https://api.breno-x.com).
 *
 * Verify: curl https://api.breno-x.com/version
 */

export type EngineVersionStatus = "current" | "supported" | "deprecated"

export interface EngineVersionDoc {
  /** Engine release semver, e.g. 1.0.0 */
  version: string
  status: EngineVersionStatus
  /** ISO date string */
  released?: string
  /** Developer API path version, e.g. v1 */
  apiVersion: string
  /** Production HTTP base URL for SDK examples */
  baseUrl: string
  highlights: string[]
  deprecationMessage?: string
}

/** Engine release history — newest first */
export const ENGINE_VERSION_CATALOG: EngineVersionDoc[] = [
  {
    version: "1.0.0",
    status: "current",
    released: "2026-07-05",
    apiVersion: "v1",
    baseUrl: "https://api.breno-x.com",
    highlights: [
      "Initial production release",
      "JWT platform API (/auth, /api) + Developer API (/v1)",
      "WebSocket realtime, presence, notifications, attachments, call signaling",
      "Apps, API keys, webhooks, and BrenoxServer provisioning",
    ],
  },
]

export function getEngineVersions(): EngineVersionDoc[] {
  return ENGINE_VERSION_CATALOG
}

export function getEngineVersion(version: string): EngineVersionDoc | undefined {
  return ENGINE_VERSION_CATALOG.find((v) => v.version === version)
}

export function getDefaultEngineVersion(): EngineVersionDoc {
  return (
    ENGINE_VERSION_CATALOG.find((v) => v.status === "current") ??
    ENGINE_VERSION_CATALOG[0]
  )
}

export function getEngineVersionOrDefault(
  versionParam: string | null,
): EngineVersionDoc {
  if (versionParam) {
    const match = getEngineVersion(versionParam)
    if (match) return match
  }
  return getDefaultEngineVersion()
}

export function buildEngineDocsQuery(engineVersion?: string): string {
  const params = new URLSearchParams()
  if (engineVersion) params.set("engine", engineVersion)
  const qs = params.toString()
  return qs ? `/docs?${qs}` : "/docs"
}
