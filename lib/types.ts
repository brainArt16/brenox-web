export type PlatformRole = "user" | "support" | "admin"

export interface UserProfile {
  id: number
  email: string
  username: string
  platform_role: PlatformRole
  suspended: boolean
  created_at: string
}

export interface AdminOverview {
  users: number
  workspaces: number
  apps: number
}

export interface AdminUser {
  id: number
  email: string
  username: string
  platform_role: PlatformRole
  suspended: boolean
  created_at: string
  workspace_count?: number
  app_count?: number
}

export interface AdminWorkspace {
  id: number
  name: string
  slug: string
  owner_id: number
  created_at: string
  member_count?: number
  channel_count?: number
}

export interface AdminApp {
  id: number
  name: string
  slug: string
  workspace_id: number
  owner_id: number
  owner_email: string
  created_at: string
}

export interface AdminAuditLog {
  id: number
  user_id?: number
  app_id?: number
  action: string
  method: string
  path: string
  ip_address?: string
  status_code?: number
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
