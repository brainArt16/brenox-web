import { BRENOX_API_URL_PRODUCTION } from "@/lib/docs/api-config"

const DEV_API_URL = "http://localhost:8080"

/** Base URL for Brenox engine HTTP API (dashboard integration, not @brenox/sdk). */
export function getEngineBaseUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_BRENOX_API_URL ?? process.env.NEXT_PUBLIC_BRENOX_URL

  if (fromEnv) {
    return fromEnv.replace(/\/$/, "")
  }

  // Production builds must not default to localhost — set NEXT_PUBLIC_BRENOX_API_URL in .env.local for local dev.
  if (process.env.NODE_ENV === "production") {
    return BRENOX_API_URL_PRODUCTION
  }

  return DEV_API_URL
}
