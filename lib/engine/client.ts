import { getEngineBaseUrl } from "./config"
import { EngineApiError, sanitizeClientMessage } from "./errors"
import { clearToken, getToken, isPersistentSession, setToken } from "./session"

type EngineFetchOptions = RequestInit & {
  /** Attach Bearer token (default true). Set false for /auth/login and /auth/register. */
  auth?: boolean
  /** Retry once after POST /auth/refresh on 401 (default true for authed calls). */
  refreshOnUnauthorized?: boolean
}

let refreshInFlight: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const token = getToken()
  if (!token) return null

  const res = await fetch(`${getEngineBaseUrl()}/auth/refresh`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (!res.ok) {
    clearToken()
    return null
  }

  const data = (await res.json()) as { token?: string }
  if (!data.token) {
    clearToken()
    return null
  }

  setToken(data.token, isPersistentSession())
  return data.token
}

async function parseErrorMessage(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string }
    if (body.error) return sanitizeClientMessage(body.error)
  } catch {
    // ignore JSON parse failures
  }
  return sanitizeClientMessage(res.statusText || "Request failed")
}

export async function engineFetch<T>(
  path: string,
  options: EngineFetchOptions = {}
): Promise<T> {
  const {
    auth = true,
    refreshOnUnauthorized = auth,
    headers: initHeaders,
    ...init
  } = options

  const headers = new Headers(initHeaders)
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  if (auth) {
    const token = getToken()
    if (token) headers.set("Authorization", `Bearer ${token}`)
  }

  const url = `${getEngineBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`

  let res = await fetch(url, { ...init, headers })

  if (res.status === 401 && auth && refreshOnUnauthorized) {
    if (!refreshInFlight) {
      refreshInFlight = refreshAccessToken().finally(() => {
        refreshInFlight = null
      })
    }
    const newToken = await refreshInFlight
    if (newToken) {
      headers.set("Authorization", `Bearer ${newToken}`)
      res = await fetch(url, { ...init, headers })
    }
  }

  if (!res.ok) {
    throw new EngineApiError(res.status, await parseErrorMessage(res))
  }

  if (res.status === 204) {
    return undefined as T
  }

  return res.json() as Promise<T>
}
