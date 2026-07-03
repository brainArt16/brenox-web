import type { UserProfile, App, ApiKey, ApiKeyCreated, Webhook, WorkspaceListItem, Channel, MessageListItem, WorkspaceMember, Notification } from './types'
import { mockUser, mockApps, mockApiKeys, mockWebhooks, mockWorkspaces, mockChannels, mockMessages, mockMembers, mockNotifications } from './mock-data'
import { engineFetch } from './engine/client'
import { fetchCurrentUser } from './engine/auth'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// User — backed by Brenox engine when authenticated
export async function getUser(): Promise<UserProfile> {
  return fetchCurrentUser()
}

// Apps
export async function getApps(): Promise<App[]> {
  await delay(400)
  return mockApps
}

export async function getApp(appId: number): Promise<App | null> {
  await delay(300)
  return mockApps.find(app => app.id === appId) || null
}

export async function createApp(name: string, slug?: string): Promise<App> {
  await delay(500)
  const appSlug = slug || name.toLowerCase().replace(/\s+/g, '-')
  const workspaceId = Math.max(...mockApps.map(a => a.workspace_id), 0) + 1
  const newApp: App = {
    id: Math.max(...mockApps.map(a => a.id), 0) + 1,
    name,
    slug: appSlug,
    workspace_id: workspaceId,
    owner_id: 1,
    created_at: new Date().toISOString(),
  }
  mockApps.push(newApp)
  return newApp
}

// API Keys
export async function getApiKeys(appId: number): Promise<ApiKey[]> {
  await delay(400)
  return mockApiKeys.filter(key => key.app_id === appId)
}

export async function createApiKey(appId: number, name: string, isSandbox: boolean): Promise<ApiKeyCreated> {
  await delay(500)
  const secret = `bx_${isSandbox ? 'test' : 'live'}_${Math.random().toString(36).slice(2, 26)}`
  const keyPrefix = `${secret.slice(0, 16)}...`
  const newKey: ApiKeyCreated = {
    id: Math.max(...mockApiKeys.map(k => k.id), 0) + 1,
    app_id: appId,
    name,
    key_prefix: keyPrefix,
    is_sandbox: isSandbox,
    created_at: new Date().toISOString(),
    secret,
  }
  mockApiKeys.push(newKey)
  return newKey
}

export async function revokeApiKey(keyId: number): Promise<void> {
  await delay(300)
  const key = mockApiKeys.find(k => k.id === keyId)
  if (key) {
    key.revoked_at = new Date().toISOString()
  }
}

// Webhooks
export async function getWebhooks(appId: number): Promise<Webhook[]> {
  await delay(400)
  return mockWebhooks.filter(wh => wh.app_id === appId)
}

export async function createWebhook(appId: number, url: string, events: string[]): Promise<Webhook> {
  await delay(500)
  const newWebhook: Webhook = {
    id: Math.max(...mockWebhooks.map(w => w.id), 0) + 1,
    app_id: appId,
    url,
    events,
    created_at: new Date().toISOString(),
    secret: `whsec_${Math.random().toString(36).substr(2, 24)}`,
  }
  mockWebhooks.push(newWebhook)
  return newWebhook
}

export async function deleteWebhook(webhookId: number): Promise<void> {
  await delay(300)
  const idx = mockWebhooks.findIndex(w => w.id === webhookId)
  if (idx >= 0) {
    mockWebhooks.splice(idx, 1)
  }
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
