import { engineFetch } from "./client"
import { EngineApiError } from "./errors"
import { fetchCurrentUser } from "./auth"
import type { Channel, MessageListItem, WorkspaceListItem, WorkspaceMember } from "@/lib/types"

interface EngineWorkspace {
  id: number
  name: string
  slug: string
  owner_id: number
  role?: string
  created_at: string
}

interface EngineChannel {
  ID: number
  Name: string
  OwnerID: number
  WorkspaceID: number
  IsReadOnly: boolean
  CreatedAt?: unknown
}

interface EngineMember {
  user_id: number
  username: string
  email: string
  role: string
  created_at: string
}

interface MessageResponse {
  id: number
  channel_id: number
  sender_id: number
  content: string
  created_at: string
}

function mapWorkspace(raw: EngineWorkspace): WorkspaceListItem {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    role: raw.role ?? "member",
    created_at: raw.created_at,
  }
}

function mapChannel(raw: EngineChannel): Channel {
  return {
    ID: raw.ID,
    Name: raw.Name,
    OwnerID: raw.OwnerID,
    WorkspaceID: raw.WorkspaceID,
    IsReadOnly: raw.IsReadOnly,
  }
}

function mapMember(raw: EngineMember): WorkspaceMember {
  return {
    user_id: raw.user_id,
    username: raw.username,
    email: raw.email,
    role: raw.role as WorkspaceMember["role"],
    created_at: raw.created_at,
  }
}

export async function listWorkspaces(): Promise<WorkspaceListItem[]> {
  const data = await engineFetch<{ workspaces: EngineWorkspace[] }>("/api/workspaces")
  return (data.workspaces ?? []).map(mapWorkspace)
}

export async function fetchWorkspace(wsId: number): Promise<WorkspaceListItem> {
  const raw = await engineFetch<EngineWorkspace>(`/api/workspaces/${wsId}`)
  return mapWorkspace(raw)
}

export async function getWorkspaceById(wsId: number): Promise<WorkspaceListItem | null> {
  try {
    return await fetchWorkspace(wsId)
  } catch (error) {
    if (error instanceof EngineApiError && error.status === 404) {
      return null
    }
    throw error
  }
}

export async function listChannels(workspaceId: number): Promise<Channel[]> {
  const data = await engineFetch<EngineChannel[]>(
    `/api/workspaces/${workspaceId}/channels`
  )
  const rows = Array.isArray(data) ? data : []
  return rows.map(mapChannel)
}

export async function createChannelRequest(
  workspaceId: number,
  name: string,
  isReadOnly = false
): Promise<Channel> {
  const raw = await engineFetch<EngineChannel>(
    `/api/workspaces/${workspaceId}/channels`,
    {
      method: "POST",
      body: JSON.stringify({ name, is_read_only: isReadOnly }),
    }
  )
  return mapChannel(raw)
}

export async function listMessages(
  workspaceId: number,
  channelId: number
): Promise<MessageListItem[]> {
  const data = await engineFetch<{ messages: MessageListItem[] }>(
    `/api/workspaces/${workspaceId}/channels/${channelId}/messages`
  )
  return data.messages ?? []
}

export async function sendMessageRequest(
  workspaceId: number,
  channelId: number,
  content: string
): Promise<MessageListItem> {
  const resp = await engineFetch<MessageResponse>(
    `/api/workspaces/${workspaceId}/channels/${channelId}/messages`,
    {
      method: "POST",
      body: JSON.stringify({ content }),
    }
  )
  const user = await fetchCurrentUser()
  return {
    id: resp.id,
    channel_id: resp.channel_id,
    sender_id: resp.sender_id,
    content: resp.content,
    created_at: resp.created_at,
    username: user.username,
  }
}

export async function listMembers(workspaceId: number): Promise<WorkspaceMember[]> {
  const data = await engineFetch<{ members: EngineMember[] }>(
    `/api/workspaces/${workspaceId}/members`
  )
  return (data.members ?? []).map(mapMember)
}

export async function inviteMemberRequest(
  workspaceId: number,
  email: string,
  role: WorkspaceMember["role"]
): Promise<WorkspaceMember> {
  const raw = await engineFetch<EngineMember>(
    `/api/workspaces/${workspaceId}/members`,
    {
      method: "POST",
      body: JSON.stringify({ email, role }),
    }
  )
  return mapMember(raw)
}

export async function removeMemberRequest(
  workspaceId: number,
  userId: number
): Promise<void> {
  await engineFetch(`/api/workspaces/${workspaceId}/members/${userId}`, {
    method: "DELETE",
  })
}

export async function updateMemberRoleRequest(
  workspaceId: number,
  userId: number,
  role: WorkspaceMember["role"]
): Promise<WorkspaceMember> {
  const raw = await engineFetch<EngineMember>(
    `/api/workspaces/${workspaceId}/members/${userId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }
  )
  return mapMember(raw)
}
