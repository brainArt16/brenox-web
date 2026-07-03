import type { UserProfile, App, ApiKey, Webhook, WorkspaceListItem, Channel, MessageListItem, WorkspaceMember, Notification } from './types'

export const mockUser: UserProfile = {
  id: 1,
  email: 'dev@example.com',
  username: 'devuser',
  created_at: '2024-01-15T10:00:00Z',
}

export const WEBHOOK_EVENTS = [
  'message.created',
  'user.provisioned',
  'channel.created',
] as const

export const mockApps: App[] = [
  {
    id: 1,
    name: 'My Chat App',
    slug: 'my-chat-app',
    workspace_id: 1,
    owner_id: 1,
    created_at: '2024-02-01T10:00:00Z',
  },
  {
    id: 2,
    name: 'Team Collab',
    slug: 'team-collab',
    workspace_id: 2,
    owner_id: 1,
    created_at: '2024-02-15T14:30:00Z',
  },
]

export const mockApiKeys: ApiKey[] = [
  {
    id: 1,
    app_id: 1,
    name: 'Live Production Key',
    key_prefix: 'bx_live_abc123...',
    is_sandbox: false,
    created_at: '2024-02-05T10:00:00Z',
    last_used_at: '2024-07-03T08:15:00Z',
  },
  {
    id: 2,
    app_id: 1,
    name: 'Sandbox Testing',
    key_prefix: 'bx_sandbox_def456...',
    is_sandbox: true,
    created_at: '2024-02-01T10:00:00Z',
    last_used_at: '2024-07-03T06:30:00Z',
  },
  {
    id: 3,
    app_id: 2,
    name: 'CI/CD Pipeline',
    key_prefix: 'bx_live_ghi789...',
    is_sandbox: false,
    created_at: '2024-02-20T09:00:00Z',
    revoked_at: '2024-06-15T12:00:00Z',
  },
]

export const mockWebhooks: Webhook[] = [
  {
    id: 1,
    app_id: 1,
    url: 'https://yourapp.com/webhooks/brenox',
    events: ['message.created', 'user.provisioned'],
    created_at: '2024-02-10T11:00:00Z',
  },
  {
    id: 2,
    app_id: 1,
    url: 'https://yourapp.com/webhooks/channels',
    events: ['channel.created'],
    created_at: '2024-02-18T09:30:00Z',
  },
]

export const mockWorkspaces: WorkspaceListItem[] = [
  {
    id: 1,
    name: 'My Chat App',
    slug: 'app-my-chat-app',
    role: 'owner',
    created_at: '2024-02-01T10:00:00Z',
  },
  {
    id: 2,
    name: 'Team Collab',
    slug: 'app-team-collab',
    role: 'owner',
    created_at: '2024-02-15T14:30:00Z',
  },
  {
    id: 3,
    name: 'Personal Team',
    slug: 'personal-team',
    role: 'admin',
    created_at: '2024-01-15T10:00:00Z',
  },
]

export const mockChannels: Channel[] = [
  {
    ID: 1,
    Name: 'general',
    OwnerID: 1,
    WorkspaceID: 1,
    IsReadOnly: false,
    CreatedAt: '2024-02-01T10:00:00Z',
  },
  {
    ID: 2,
    Name: 'announcements',
    OwnerID: 1,
    WorkspaceID: 1,
    IsReadOnly: true,
    CreatedAt: '2024-02-01T10:05:00Z',
  },
  {
    ID: 3,
    Name: 'engineering',
    OwnerID: 1,
    WorkspaceID: 1,
    IsReadOnly: false,
    CreatedAt: '2024-02-05T09:00:00Z',
  },
  {
    ID: 4,
    Name: 'general',
    OwnerID: 1,
    WorkspaceID: 2,
    IsReadOnly: false,
    CreatedAt: '2024-02-15T14:00:00Z',
  },
]

export const mockMessages: MessageListItem[] = [
  {
    id: 1,
    channel_id: 1,
    sender_id: 1,
    content: 'Hey team! Just deployed the latest API update.',
    created_at: '2024-07-03T07:15:00Z',
    username: 'devuser',
  },
  {
    id: 2,
    channel_id: 1,
    sender_id: 2,
    content: 'Great! Testing it now with sandbox keys.',
    created_at: '2024-07-03T07:20:00Z',
    username: 'anotherdev',
  },
  {
    id: 3,
    channel_id: 1,
    sender_id: 1,
    content: 'Let me know if you find any issues. Full docs are at /api/docs',
    created_at: '2024-07-03T07:25:00Z',
    username: 'devuser',
  },
]

export const mockMembers: WorkspaceMember[] = [
  {
    user_id: 1,
    username: 'devuser',
    email: 'dev@example.com',
    role: 'owner',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    user_id: 2,
    username: 'anotherdev',
    email: 'another@example.com',
    role: 'admin',
    created_at: '2024-02-01T14:00:00Z',
  },
  {
    user_id: 3,
    username: 'testuser',
    email: 'test@example.com',
    role: 'member',
    created_at: '2024-02-15T10:00:00Z',
  },
]

export const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'api_key_created',
    title: 'New API Key Created',
    body: 'Live Production Key was created',
    read: true,
    created_at: '2024-07-02T15:00:00Z',
  },
  {
    id: 2,
    type: 'webhook_event',
    title: 'Webhook Event Failed',
    body: 'Webhook to https://yourapp.com/webhooks/brenox failed with status 500',
    read: false,
    created_at: '2024-07-03T08:00:00Z',
  },
  {
    id: 3,
    type: 'member_invited',
    title: 'New Member Joined',
    body: 'testuser@example.com joined My Workspace',
    read: false,
    created_at: '2024-07-03T08:10:00Z',
  },
]
