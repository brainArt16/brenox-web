const DEFAULT_API_URL = "http://localhost:8080"

/** Base URL for Brenox engine HTTP API (dashboard integration, not @brenox/sdk). */
export function getEngineBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_BRENOX_API_URL ??
    process.env.NEXT_PUBLIC_BRENOX_URL ??
    DEFAULT_API_URL
  ).replace(/\/$/, "")
}
