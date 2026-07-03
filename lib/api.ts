import type { UserProfile, App, ApiKey, ApiKeyCreated, Webhook, WorkspaceListItem, Channel, MessageListItem, WorkspaceMember, Notification } from './types'
import { engineFetch } from './engine/client'
import { fetchCurrentUser } from './engine/auth'
import {
  listApps,
  getAppById,
  createAppRequest,
  listApiKeys,
  createApiKeyRequest,
  revokeApiKeyRequest,
  listWebhooks,
  createWebhookRequest,
  deleteWebhookRequest,
} from './engine/apps'
import {
  listWorkspaces,
  getWorkspaceById,
  listChannels,
  createChannelRequest,
  listMessages,
  sendMessageRequest,
  listMembers,
  inviteMemberRequest,
  removeMemberRequest,
  updateMemberRoleRequest,
} from './engine/workspaces'
import {
  listNotifications,
  markNotificationRead,
  markAllNotificationsReadRequest,
} from './engine/notifications'
import { getMyPresence, changePassword, type PresenceStatus } from './engine/users'

// User — backed by Brenox engine when authenticated
export async function getUser(): Promise<UserProfile> {
  return fetchCurrentUser()
}

// Apps — Brenox engine /api/apps
export async function getApps(): Promise<App[]> {
  return listApps()
}

export async function getApp(appId: number): Promise<App | null> {
  return getAppById(appId)
}

export async function createApp(name: string, slug?: string): Promise<App> {
  return createAppRequest(name, slug)
}

// API Keys
export async function getApiKeys(appId: number): Promise<ApiKey[]> {
  return listApiKeys(appId)
}

export async function createApiKey(appId: number, name: string, isSandbox: boolean): Promise<ApiKeyCreated> {
  return createApiKeyRequest(appId, name, isSandbox)
}

export async function revokeApiKey(appId: number, keyId: number): Promise<void> {
  return revokeApiKeyRequest(appId, keyId)
}

// Webhooks
export async function getWebhooks(appId: number): Promise<Webhook[]> {
  return listWebhooks(appId)
}

export async function createWebhook(appId: number, url: string, events: string[]): Promise<Webhook> {
  return createWebhookRequest(appId, url, events)
}

export async function deleteWebhook(appId: number, webhookId: number): Promise<void> {
  return deleteWebhookRequest(appId, webhookId)
}

// Workspaces — Brenox engine /api/workspaces
export async function getWorkspaces(): Promise<WorkspaceListItem[]> {
  return listWorkspaces()
}

export async function getWorkspace(wsId: number): Promise<WorkspaceListItem | null> {
  return getWorkspaceById(wsId)
}

// Channels
export async function getChannels(workspaceId: number): Promise<Channel[]> {
  return listChannels(workspaceId)
}

export async function createChannel(workspaceId: number, name: string, isReadOnly = false): Promise<Channel> {
  return createChannelRequest(workspaceId, name, isReadOnly)
}

// Messages
export async function getMessages(workspaceId: number, channelId: number): Promise<MessageListItem[]> {
  return listMessages(workspaceId, channelId)
}

export async function sendMessage(workspaceId: number, channelId: number, content: string): Promise<MessageListItem> {
  return sendMessageRequest(workspaceId, channelId, content)
}

// Members
export async function getMembers(workspaceId: number): Promise<WorkspaceMember[]> {
  return listMembers(workspaceId)
}

export async function inviteMember(
  workspaceId: number,
  email: string,
  role: 'admin' | 'moderator' | 'member'
): Promise<WorkspaceMember> {
  return inviteMemberRequest(workspaceId, email, role)
}

export async function removeMember(workspaceId: number, userId: number): Promise<void> {
  return removeMemberRequest(workspaceId, userId)
}

export async function updateMemberRole(
  workspaceId: number,
  userId: number,
  role: WorkspaceMember['role']
): Promise<WorkspaceMember> {
  return updateMemberRoleRequest(workspaceId, userId, role)
}

export async function updateProfile(username: string): Promise<UserProfile> {
  return engineFetch<UserProfile>('/api/users/me', {
    method: 'PATCH',
    body: JSON.stringify({ username }),
  })
}

export async function updatePresence(status: PresenceStatus): Promise<void> {
  await engineFetch('/api/users/me/status', {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export async function fetchPresence(): Promise<PresenceStatus> {
  const p = await getMyPresence()
  return p.status
}

export async function updatePassword(currentPassword: string, newPassword: string): Promise<void> {
  return changePassword(currentPassword, newPassword)
}

// Notifications — Brenox engine /api/notifications
export async function getNotifications(): Promise<Notification[]> {
  return listNotifications()
}

export async function markNotificationAsRead(notificationId: number): Promise<void> {
  await markNotificationRead(notificationId)
}

export async function markAllNotificationsRead(): Promise<number> {
  return markAllNotificationsReadRequest()
}
