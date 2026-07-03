import { engineFetch } from "./client"
import { EngineApiError } from "./errors"
import type { App, ApiKey, ApiKeyCreated, Webhook } from "@/lib/types"

export async function listApps(): Promise<App[]> {
  const data = await engineFetch<{ apps: App[] }>("/api/apps")
  return data.apps ?? []
}

export async function fetchApp(appId: number): Promise<App> {
  return engineFetch<App>(`/api/apps/${appId}`)
}

export async function getAppById(appId: number): Promise<App | null> {
  try {
    return await fetchApp(appId)
  } catch (error) {
    if (error instanceof EngineApiError && error.status === 404) {
      return null
    }
    throw error
  }
}

export async function createAppRequest(name: string, slug?: string): Promise<App> {
  return engineFetch<App>("/api/apps", {
    method: "POST",
    body: JSON.stringify({ name, slug: slug ?? "" }),
  })
}

export async function listApiKeys(appId: number): Promise<ApiKey[]> {
  const data = await engineFetch<{ api_keys: ApiKey[] }>(`/api/apps/${appId}/keys`)
  return data.api_keys ?? []
}

export async function createApiKeyRequest(
  appId: number,
  name: string,
  sandbox: boolean
): Promise<ApiKeyCreated> {
  return engineFetch<ApiKeyCreated>(`/api/apps/${appId}/keys`, {
    method: "POST",
    body: JSON.stringify({ name, sandbox }),
  })
}

export async function revokeApiKeyRequest(appId: number, keyId: number): Promise<void> {
  await engineFetch(`/api/apps/${appId}/keys/${keyId}`, { method: "DELETE" })
}

export async function listWebhooks(appId: number): Promise<Webhook[]> {
  const data = await engineFetch<{ webhooks: Webhook[] }>(`/api/apps/${appId}/webhooks`)
  return data.webhooks ?? []
}

export async function createWebhookRequest(
  appId: number,
  url: string,
  events: string[]
): Promise<Webhook> {
  return engineFetch<Webhook>(`/api/apps/${appId}/webhooks`, {
    method: "POST",
    body: JSON.stringify({ url, events }),
  })
}

export async function deleteWebhookRequest(appId: number, webhookId: number): Promise<void> {
  await engineFetch(`/api/apps/${appId}/webhooks/${webhookId}`, { method: "DELETE" })
}
