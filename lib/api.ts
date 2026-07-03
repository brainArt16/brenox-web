import type { UserProfile, App, ApiKey, ApiKeyCreated, Webhook, WorkspaceListItem, Channel, MessageListItem, WorkspaceMember, Notification } from './types'
import { mockUser, mockWebhooks, mockWorkspaces, mockChannels, mockMessages, mockMembers, mockNotifications } from './mock-data'
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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

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

// Workspaces
export async function getWorkspaces(): Promise<WorkspaceListItem[]> {
  await delay(400)
  return mockWorkspaces
}

export async function getWorkspace(wsId: number): Promise<WorkspaceListItem | null> {
  await delay(300)
  return mockWorkspaces.find(ws => ws.id === wsId) || null
}

// Channels
export async function getChannels(workspaceId: number): Promise<Channel[]> {
  await delay(400)
  return mockChannels.filter(ch => ch.WorkspaceID === workspaceId)
}

export async function createChannel(workspaceId: number, name: string, isReadOnly = false): Promise<Channel> {
  await delay(400)
  const channel: Channel = {
    ID: Math.max(...mockChannels.map(c => c.ID), 0) + 1,
    Name: name,
    OwnerID: 1,
    WorkspaceID: workspaceId,
    IsReadOnly: isReadOnly,
    CreatedAt: new Date().toISOString(),
  }
  mockChannels.push(channel)
  return channel
}

// Messages
export async function getMessages(channelId: number): Promise<MessageListItem[]> {
  await delay(400)
  return mockMessages.filter(msg => msg.channel_id === channelId)
}

export async function sendMessage(channelId: number, content: string): Promise<MessageListItem> {
  await delay(300)
  const newMessage: MessageListItem = {
    id: Math.max(...mockMessages.map(m => m.id), 0) + 1,
    channel_id: channelId,
    sender_id: 1,
    content,
    created_at: new Date().toISOString(),
    username: 'devuser',
  }
  mockMessages.push(newMessage)
  return newMessage
}

// Members
export async function getMembers(workspaceId: number): Promise<WorkspaceMember[]> {
  await delay(400)
  return mockMembers
}

export async function inviteMember(workspaceId: number, email: string, role: 'admin' | 'moderator' | 'member'): Promise<WorkspaceMember> {
  await delay(500)
  const newMember: WorkspaceMember = {
    user_id: Math.max(...mockMembers.map(m => m.user_id), 0) + 1,
    username: email.split('@')[0],
    email,
    role,
    created_at: new Date().toISOString(),
  }
  mockMembers.push(newMember)
  return newMember
}

export async function removeMember(workspaceId: number, userId: number): Promise<void> {
  await delay(300)
  const idx = mockMembers.findIndex(m => m.user_id === userId)
  if (idx >= 0) {
    mockMembers.splice(idx, 1)
  }
}

export async function updateMemberRole(
  workspaceId: number,
  userId: number,
  role: WorkspaceMember['role']
): Promise<WorkspaceMember> {
  await delay(300)
  const member = mockMembers.find(m => m.user_id === userId)
  if (!member) throw new Error('Member not found')
  member.role = role
  return member
}

export async function updateProfile(username: string): Promise<UserProfile> {
  return engineFetch<UserProfile>('/api/users/me', {
    method: 'PATCH',
    body: JSON.stringify({ username }),
  })
}

export async function updatePresence(status: 'online' | 'away' | 'offline'): Promise<void> {
  await engineFetch('/api/users/me/status', {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

// Notifications
export async function getNotifications(): Promise<Notification[]> {
  await delay(300)
  return mockNotifications
}

export async function markNotificationAsRead(notificationId: number): Promise<void> {
  await delay(200)
  const notif = mockNotifications.find(n => n.id === notificationId)
  if (notif) {
    notif.read = true
  }
}

export async function markAllNotificationsRead(): Promise<number> {
  await delay(300)
  let count = 0
  for (const n of mockNotifications) {
    if (!n.read) {
      n.read = true
      count++
    }
  }
  return count
}
