const TOKEN_KEY = "brenox_token"

function storage(persistent: boolean): Storage | null {
  if (typeof window === "undefined") return null
  return persistent ? localStorage : sessionStorage
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY)
}

export function isPersistentSession(): boolean {
  if (typeof window === "undefined") return true
  return localStorage.getItem(TOKEN_KEY) != null
}

export function setToken(token: string, persistent = true): void {
  clearToken()
  storage(persistent)?.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
}

export function isAuthenticated(): boolean {
  return Boolean(getToken())
}
