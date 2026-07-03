"use client"

import { Suspense, useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Hash, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { StatusPill } from "@/components/shared/status-pill"
import { MessageInput } from "@/components/chat/message-input"
import { TypingIndicator } from "@/components/chat/typing-indicator"
import { getWorkspace, getChannels, getMessages, sendMessage, createChannel } from "@/lib/api"
import type { Channel, MessageListItem, WorkspaceListItem } from "@/lib/types"
import { toast } from "sonner"

export default function WorkspaceChatPage() {
  return (
    <Suspense fallback={<Skeleton className="h-full min-h-[480px] w-full rounded-xl" />}>
      <WorkspaceChatContent />
    </Suspense>
  )
}

function WorkspaceChatContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const wsId = Number(params.wsId)
  const [workspace, setWorkspace] = useState<WorkspaceListItem | null>(null)
  const [channels, setChannels] = useState<Channel[]>([])
  const [selectedChannelId, setSelectedChannelId] = useState<number | null>(null)
  const [messages, setMessages] = useState<MessageListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [newChannelName, setNewChannelName] = useState("")

  useEffect(() => {
    if (!wsId) return
    Promise.all([getWorkspace(wsId), getChannels(wsId)])
      .then(([ws, chs]) => {
        setWorkspace(ws)
        setChannels(chs)
        const fromQuery = searchParams.get("channel")
        const initial =
          fromQuery && chs.some((c) => c.ID === Number(fromQuery))
            ? Number(fromQuery)
            : chs[0]?.ID ?? null
        setSelectedChannelId(initial)
      })
      .finally(() => setLoading(false))
  }, [wsId, searchParams])

  useEffect(() => {
    if (!selectedChannelId || !wsId) return
    getMessages(wsId, selectedChannelId).then(setMessages)
  }, [selectedChannelId, wsId])

  async function handleSend(content: string) {
    if (!selectedChannelId || !wsId) return
    try {
      const msg = await sendMessage(wsId, selectedChannelId, content)
      setMessages((prev) => [...prev, msg])
    } catch {
      toast.error("Failed to send message")
    }
  }

  async function handleCreateChannel() {
    if (!newChannelName.trim()) return
    try {
      const ch = await createChannel(wsId, newChannelName.trim())
      setChannels((prev) => [...prev, ch])
      setSelectedChannelId(ch.ID)
      setCreateOpen(false)
      setNewChannelName("")
      toast.success(`Channel #${ch.Name} created`)
    } catch {
      toast.error("Failed to create channel")
    }
  }

  const selectedChannel = channels.find((c) => c.ID === selectedChannelId)

  if (loading) {
    return <Skeleton className="h-full min-h-[480px] w-full rounded-xl" />
  }

  if (!workspace) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">Workspace not found.</p>
        <Button asChild className="mt-4">
          <Link href="/workspaces">Back to workspaces</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-[480px] flex-col overflow-hidden rounded-xl border border-border bg-surface">
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="border-border bg-card">
          <DialogHeader>
            <DialogTitle>Create channel</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="ch-name">Name</Label>
            <Input
              id="ch-name"
              placeholder="general"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              className="font-mono bg-surface"
            />
          </div>
          <DialogFooter>
            <Button onClick={() => void handleCreateChannel()}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedChannel ? (
        <>
          <header className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">{selectedChannel.Name}</span>
              {selectedChannel.IsReadOnly && (
                <span className="rounded-md border border-border bg-card px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                  read-only
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={() => setCreateOpen(true)}>
                <Plus className="mr-1 h-4 w-4" />
                Channel
              </Button>
              <StatusPill state="connected" />
            </div>
          </header>

          <ScrollArea className="flex-1 scrollbar-thin">
            <div className="space-y-1 p-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="group flex gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-surface-elevated/80"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {msg.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold">{msg.username}</span>
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm leading-relaxed text-foreground">{msg.content}</p>
                  </div>
                </div>
              ))}
              <TypingIndicator />
            </div>
          </ScrollArea>

          <div className="border-t border-border bg-surface-elevated p-3">
            {!selectedChannel.IsReadOnly ? (
              <MessageInput
                channelName={selectedChannel.Name}
                onSend={(c) => void handleSend(c)}
              />
            ) : (
              <p className="py-3 text-center text-sm text-muted-foreground">
                This channel is read-only.
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
          <p className="text-muted-foreground">Select a channel from the sidebar or create one.</p>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create channel
          </Button>
        </div>
      )}
    </div>
  )
}
