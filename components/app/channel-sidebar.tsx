"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { 
  Hash, 
  Volume2, 
  ChevronDown, 
  Plus, 
  Settings, 
  Search,
  Lock,
  Bell
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

// Mock data
const channels = {
  text: [
    { id: "general", name: "general", unread: 2, mentions: 1 },
    { id: "engineering", name: "engineering", unread: 0, mentions: 0 },
    { id: "design", name: "design", unread: 5, mentions: 0 },
    { id: "announcements", name: "announcements", unread: 1, mentions: 0, isPrivate: true },
    { id: "random", name: "random", unread: 0, mentions: 0 },
  ],
  voice: [
    { id: "voice-general", name: "General Voice", participants: 3 },
    { id: "voice-standup", name: "Daily Standup", participants: 0 },
  ],
}

const directMessages = [
  { id: "dm1", name: "Sarah Chen", avatar: "sarah", status: "online", unread: 2 },
  { id: "dm2", name: "Marcus Johnson", avatar: "marcus", status: "away", unread: 0 },
  { id: "dm3", name: "Emily Davis", avatar: "emily", status: "offline", unread: 0 },
  { id: "dm4", name: "James Wilson", avatar: "james", status: "online", unread: 0 },
]

interface ChannelSidebarProps {
  workspaceName?: string
}

export function ChannelSidebar({ workspaceName = "Brenox Team" }: ChannelSidebarProps) {
  const pathname = usePathname()
  const [textChannelsOpen, setTextChannelsOpen] = useState(true)
  const [voiceChannelsOpen, setVoiceChannelsOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const activeChannelId = pathname.split("/").pop()

  return (
    <aside className="hidden md:flex w-60 h-screen flex-col bg-surface border-r border-border">
      {/* Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-border">
        <button className="flex items-center gap-2 hover:text-muted-foreground transition-colors">
          <span className="font-semibold truncate">{workspaceName}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        <button className="p-1 hover:bg-secondary rounded-md transition-colors">
          <Bell className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 bg-background"
          />
        </div>
      </div>

      {/* Channels List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-2">
        {/* Text Channels */}
        <Collapsible open={textChannelsOpen} onOpenChange={setTextChannelsOpen}>
          <div className="group flex items-center gap-1 px-2 py-1.5">
            <CollapsibleTrigger className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground uppercase tracking-wide">
              <ChevronDown className={cn("w-3 h-3 transition-transform", !textChannelsOpen && "-rotate-90")} />
              Text Channels
            </CollapsibleTrigger>
            <button 
              className="ml-auto p-1 hover:bg-secondary rounded-sm opacity-0 group-hover:opacity-100"
              onClick={() => {
                // Open create channel modal
              }}
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <CollapsibleContent>
            <div className="space-y-0.5">
              {channels.text.map((channel) => (
                <Link
                  key={channel.id}
                  href={`/app/channels/${channel.id}`}
                  className={cn(
                    "group flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors",
                    activeChannelId === channel.id
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  )}
                >
                  {channel.isPrivate ? (
                    <Lock className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <Hash className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span className="truncate flex-1">{channel.name}</span>
                  
                  {channel.mentions > 0 && (
                    <span className="w-5 h-5 bg-destructive text-destructive-foreground text-xs font-medium rounded-full flex items-center justify-center">
                      {channel.mentions}
                    </span>
                  )}
                  
                  {channel.unread > 0 && channel.mentions === 0 && (
                    <span className="w-2 h-2 bg-foreground rounded-full" />
                  )}
                  
                  <button className="p-1 hover:bg-secondary rounded-sm opacity-0 group-hover:opacity-100">
                    <Settings className="w-3 h-3" />
                  </button>
                </Link>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Voice Channels */}
        <Collapsible open={voiceChannelsOpen} onOpenChange={setVoiceChannelsOpen} className="mt-4">
          <CollapsibleTrigger className="w-full flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground uppercase tracking-wide">
            <ChevronDown className={cn("w-3 h-3 transition-transform", !voiceChannelsOpen && "-rotate-90")} />
            Voice Channels
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-0.5">
              {channels.voice.map((channel) => (
                <button
                  key={channel.id}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
                >
                  <Volume2 className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate flex-1 text-left">{channel.name}</span>
                  {channel.participants > 0 && (
                    <span className="text-xs text-muted-foreground">{channel.participants}</span>
                  )}
                </button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Direct Messages */}
        <div className="mt-4">
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Direct Messages
            </span>
            <button className="p-1 hover:bg-secondary rounded-sm">
              <Plus className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
          <div className="space-y-0.5">
            {directMessages.map((dm) => (
              <Link
                key={dm.id}
                href={`/app/dm/${dm.id}`}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors",
                  activeChannelId === dm.id
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <div className="relative">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${dm.avatar}`} />
                    <AvatarFallback>{dm.name[0]}</AvatarFallback>
                  </Avatar>
                  <span 
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-2 border-surface rounded-full",
                      dm.status === "online" && "bg-online",
                      dm.status === "away" && "bg-away",
                      dm.status === "offline" && "bg-offline"
                    )} 
                  />
                </div>
                <span className="truncate flex-1">{dm.name}</span>
                {dm.unread > 0 && (
                  <span className="w-5 h-5 bg-destructive text-destructive-foreground text-xs font-medium rounded-full flex items-center justify-center">
                    {dm.unread}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* User Panel */}
      <div className="p-2 border-t border-border bg-surface-elevated">
        <div className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary/50 transition-colors">
          <div className="relative">
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123" />
              <AvatarFallback>AK</AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-online border-2 border-surface-elevated rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Alex Kim</p>
            <p className="text-xs text-muted-foreground truncate">Online</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </aside>
  )
}
