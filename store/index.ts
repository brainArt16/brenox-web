import { create } from 'zustand'

interface UIState {
  // Sidebar states
  isWorkspaceSidebarCollapsed: boolean
  isChannelSidebarCollapsed: boolean
  isMemberListVisible: boolean
  
  // Modal states
  isSettingsOpen: boolean
  isCreateWorkspaceOpen: boolean
  isCreateChannelOpen: boolean
  isSearchOpen: boolean
  
  // Active states
  activeWorkspaceId: string | null
  activeChannelId: string | null
  
  // Actions
  toggleWorkspaceSidebar: () => void
  toggleChannelSidebar: () => void
  toggleMemberList: () => void
  setSettingsOpen: (open: boolean) => void
  setCreateWorkspaceOpen: (open: boolean) => void
  setCreateChannelOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
  setActiveWorkspace: (id: string | null) => void
  setActiveChannel: (id: string | null) => void
}

export const useUIStore = create<UIState>((set) => ({
  // Initial states
  isWorkspaceSidebarCollapsed: false,
  isChannelSidebarCollapsed: false,
  isMemberListVisible: true,
  isSettingsOpen: false,
  isCreateWorkspaceOpen: false,
  isCreateChannelOpen: false,
  isSearchOpen: false,
  activeWorkspaceId: null,
  activeChannelId: null,
  
  // Actions
  toggleWorkspaceSidebar: () => 
    set((state) => ({ isWorkspaceSidebarCollapsed: !state.isWorkspaceSidebarCollapsed })),
  toggleChannelSidebar: () => 
    set((state) => ({ isChannelSidebarCollapsed: !state.isChannelSidebarCollapsed })),
  toggleMemberList: () => 
    set((state) => ({ isMemberListVisible: !state.isMemberListVisible })),
  setSettingsOpen: (open) => set({ isSettingsOpen: open }),
  setCreateWorkspaceOpen: (open) => set({ isCreateWorkspaceOpen: open }),
  setCreateChannelOpen: (open) => set({ isCreateChannelOpen: open }),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),
  setActiveChannel: (id) => set({ activeChannelId: id }),
}))

// Presence store for realtime presence state
interface PresenceState {
  onlineUsers: Set<string>
  typingUsers: Map<string, string[]> // channelId -> userIds
  
  setUserOnline: (userId: string) => void
  setUserOffline: (userId: string) => void
  setTyping: (channelId: string, userId: string) => void
  clearTyping: (channelId: string, userId: string) => void
}

export const usePresenceStore = create<PresenceState>((set) => ({
  onlineUsers: new Set(),
  typingUsers: new Map(),
  
  setUserOnline: (userId) => 
    set((state) => {
      const newSet = new Set(state.onlineUsers)
      newSet.add(userId)
      return { onlineUsers: newSet }
    }),
  setUserOffline: (userId) => 
    set((state) => {
      const newSet = new Set(state.onlineUsers)
      newSet.delete(userId)
      return { onlineUsers: newSet }
    }),
  setTyping: (channelId, userId) => 
    set((state) => {
      const newMap = new Map(state.typingUsers)
      const users = newMap.get(channelId) || []
      if (!users.includes(userId)) {
        newMap.set(channelId, [...users, userId])
      }
      return { typingUsers: newMap }
    }),
  clearTyping: (channelId, userId) => 
    set((state) => {
      const newMap = new Map(state.typingUsers)
      const users = newMap.get(channelId) || []
      newMap.set(channelId, users.filter(id => id !== userId))
      return { typingUsers: newMap }
    }),
}))
