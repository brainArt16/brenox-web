"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Search, X, Crown, Shield, Circle } from "lucide-react"

interface Member {
  id: string
  name: string
  avatar: string
  status: "online" | "away" | "offline" | "dnd"
  role?: "owner" | "admin" | "member"
  activity?: string
}

const mockMembers: Member[] = [
  { id: "1", name: "Alex Kim", avatar: "alex", status: "online", role: "owner", activity: "Working on chat" },
  { id: "2", name: "Sarah Chen", avatar: "sarah", status: "online", role: "admin" },
  { id: "3", name: "Marcus Johnson", avatar: "marcus", status: "away", activity: "In a meeting" },
  { id: "4", name: "Emily Davis", avatar: "emily", status: "online" },
  { id: "5", name: "James Wilson", avatar: "james", status: "dnd", activity: "Do not disturb" },
  { id: "6", name: "Lisa Wang", avatar: "lisa", status: "offline" },
  { id: "7", name: "David Brown", avatar: "david", status: "online" },
  { id: "8", name: "Rachel Green", avatar: "rachel", status: "offline" },
]

interface MemberListProps {
  isOpen: boolean
  onClose: () => void
}

export function MemberList({ isOpen, onClose }: MemberListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  if (!isOpen) return null

  const filteredMembers = mockMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const onlineMembers = filteredMembers.filter(m => m.status === "online" || m.status === "away" || m.status === "dnd")
  const offlineMembers = filteredMembers.filter(m => m.status === "offline")

  const StatusIcon = ({ status }: { status: Member["status"] }) => {
    const statusColors = {
      online: "bg-online",
      away: "bg-away",
      dnd: "bg-destructive",
      offline: "bg-offline",
    }
    return <span className={cn("w-3 h-3 rounded-full border-2 border-surface-elevated", statusColors[status])} />
  }

  const RoleIcon = ({ role }: { role: Member["role"] }) => {
    if (role === "owner") return <Crown className="w-4 h-4 text-warning" />
    if (role === "admin") return <Shield className="w-4 h-4 text-primary" />
    return null
  }

  const MemberItem = ({ member }: { member: Member }) => (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors">
      <div className="relative">
        <Avatar className="w-8 h-8">
          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.avatar}`} />
          <AvatarFallback>{member.name[0]}</AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-0.5 -right-0.5">
          <StatusIcon status={member.status} />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className={cn(
            "text-sm font-medium truncate",
            member.status === "offline" && "text-muted-foreground"
          )}>
            {member.name}
          </span>
          <RoleIcon role={member.role} />
        </div>
        {member.activity && (
          <p className="text-xs text-muted-foreground truncate">{member.activity}</p>
        )}
      </div>
    </div>
  )

  return (
    <aside className="w-60 h-full border-l border-border bg-surface flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-border flex items-center justify-between">
        <span className="font-medium text-sm">Members - {mockMembers.length}</span>
        <Button variant="ghost" size="icon" className="h-7 w-7 md:hidden" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 bg-background"
          />
        </div>
      </div>

      {/* Member List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {/* Online Members */}
          {onlineMembers.length > 0 && (
            <div className="mb-4">
              <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Online - {onlineMembers.length}
              </div>
              {onlineMembers.map(member => (
                <MemberItem key={member.id} member={member} />
              ))}
            </div>
          )}

          {/* Offline Members */}
          {offlineMembers.length > 0 && (
            <div>
              <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Offline - {offlineMembers.length}
              </div>
              {offlineMembers.map(member => (
                <MemberItem key={member.id} member={member} />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  )
}
