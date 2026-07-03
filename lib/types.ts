export interface UserProfile {
  id: number
  email: string
  username: string
  created_at: string
}

export interface App {
  id: number
  name: string
  slug: string
  workspace_id: number
  owner_id: number
  created_at: string
}

export interface ApiKey {
  id: number
  app_id: number
  name: string
  key_prefix: string
  is_sandbox: boolean
  created_at: string
  revoked_at?: string
  last_used_at?: string
}

export interface ApiKeyCreated extends ApiKey {
  secret: string
}

export interface Webhook {
  id: number
  app_id: number
  url: string
  events: string[]
  created_at: string
  secret?: string
}

export interface WorkspaceListItem {
  id: number
  name: string
  slug: string
  role: string
  created_at: string
}

export interface Channel {
  ID: number
  Name: string
  OwnerID: number
  WorkspaceID: number
  IsReadOnly: boolean
  CreatedAt?: string
}

export interface MessageListItem {
  id: number
  channel_id: number
  sender_id: number
  content: string
  created_at: string
  username: string
}

export interface WorkspaceMember {
  user_id: number
  username: string
  email: string
  role: 'owner' | 'admin' | 'moderator' | 'member'
  created_at: string
}

export interface Notification {
  id: number
  type: string
  title: string
  body: string
  read: boolean
  created_at: string
}

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting'
