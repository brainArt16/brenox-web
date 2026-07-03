// User types
export interface User {
  id: string
  username: string
  displayName: string
  avatar?: string
  email: string
  status: 'online' | 'away' | 'offline' | 'dnd'
  createdAt: Date
}

// Workspace types
export interface Workspace {
  id: string
  name: string
  icon?: string
  ownerId: string
  createdAt: Date
}

// Channel types
export type ChannelType = 'text' | 'voice' | 'announcement'

export interface Channel {
  id: string
  workspaceId: string
  name: string
  description?: string
  type: ChannelType
  categoryId?: string
  isPrivate: boolean
  createdAt: Date
}

export interface ChannelCategory {
  id: string
  workspaceId: string
  name: string
  position: number
}

// Message types
export interface Message {
  id: string
  channelId: string
  userId: string
  content: string
  attachments?: Attachment[]
  reactions?: Reaction[]
  replyToId?: string
  editedAt?: Date
  createdAt: Date
}

export interface Attachment {
  id: string
  url: string
  name: string
  type: 'image' | 'video' | 'file'
  size: number
}

export interface Reaction {
  emoji: string
  count: number
  userIds: string[]
}

// Presence types
export interface PresenceState {
  userId: string
  status: 'online' | 'away' | 'offline' | 'dnd'
  lastSeen: Date
}

export interface TypingState {
  userId: string
  channelId: string
  timestamp: Date
}

// Call types
export interface Call {
  id: string
  channelId: string
  participants: CallParticipant[]
  type: 'audio' | 'video'
  startedAt: Date
}

export interface CallParticipant {
  userId: string
  isMuted: boolean
  isVideoOn: boolean
  isScreenSharing: boolean
  isSpeaking: boolean
}

// Notification types
export type NotificationType = 'message' | 'mention' | 'call' | 'invite' | 'system'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  body: string
  channelId?: string
  read: boolean
  createdAt: Date
}

// API Key types
export interface ApiKey {
  id: string
  name: string
  key: string
  scopes: string[]
  environment: 'development' | 'production'
  createdAt: Date
  lastUsedAt?: Date
}
