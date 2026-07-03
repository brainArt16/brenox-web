"use client"

import { useRef, useEffect, useState, memo } from "react"
import { m, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Smile, MoreHorizontal, Reply, Pin, Trash2, Edit2, Copy, MessageSquare } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

interface Message {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  timestamp: Date
  edited?: boolean
  reactions?: { emoji: string; count: number; reacted: boolean }[]
  replyTo?: {
    userName: string
    content: string
  }
}

// Quick reactions
const quickReactions = ["👍", "❤️", "😂", "😮", "😢", "🎉"]

const MessageItem = memo(function MessageItem({ 
  message, 
  isGrouped,
  onReact 
}: { 
  message: Message
  isGrouped: boolean
  onReact: (messageId: string, emoji: string) => void
}) {
  const [showActions, setShowActions] = useState(false)

  return (
    <m.div
      className={cn(
        "group relative flex gap-4 px-4 py-1 hover:bg-secondary/30 transition-colors",
        !isGrouped && "pt-4"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Avatar or Timestamp Spacer */}
      {isGrouped ? (
        <div className="w-10 flex items-center justify-center">
          <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      ) : (
        <Avatar className="w-10 h-10 mt-0.5">
          <AvatarImage src={message.userAvatar} />
          <AvatarFallback>{message.userName[0]}</AvatarFallback>
        </Avatar>
      )}

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        {/* Reply Preview */}
        {message.replyTo && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1 cursor-pointer hover:text-foreground">
            <Reply className="w-3 h-3" />
            <span className="font-medium">{message.replyTo.userName}</span>
            <span className="truncate max-w-[200px]">{message.replyTo.content}</span>
          </div>
        )}

        {/* User Info (only for first message in group) */}
        {!isGrouped && (
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm hover:underline cursor-pointer">
              {message.userName}
            </span>
            <span className="text-xs text-muted-foreground">
              {message.timestamp.toLocaleString([], { 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
            {message.edited && (
              <span className="text-xs text-muted-foreground">(edited)</span>
            )}
          </div>
        )}

        {/* Message Text */}
        <div className="text-sm leading-relaxed break-words">
          {message.content}
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {message.reactions.map((reaction) => (
              <button
                key={reaction.emoji}
                onClick={() => onReact(message.id, reaction.emoji)}
                className={cn(
                  "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-colors",
                  reaction.reacted
                    ? "bg-primary/20 border-primary/30 text-primary"
                    : "bg-secondary/50 border-border hover:border-primary/30"
                )}
              >
                <span>{reaction.emoji}</span>
                <span>{reaction.count}</span>
              </button>
            ))}
            <button
              className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary/50 border border-border hover:border-primary/30 transition-colors"
              onClick={() => {}}
            >
              <Smile className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <AnimatePresence>
        {showActions && (
          <m.div
            className="absolute -top-4 right-4 flex items-center bg-card border border-border rounded-lg shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.1 }}
          >
            <TooltipProvider delayDuration={0}>
              {/* Quick Reactions */}
              {quickReactions.slice(0, 3).map((emoji) => (
                <Tooltip key={emoji}>
                  <TooltipTrigger asChild>
                    <button
                      className="p-2 hover:bg-secondary transition-colors"
                      onClick={() => onReact(message.id, emoji)}
                    >
                      <span className="text-sm">{emoji}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Add reaction</TooltipContent>
                </Tooltip>
              ))}

              <div className="w-px h-6 bg-border" />

              {/* Reply */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-2 hover:bg-secondary transition-colors">
                    <Reply className="w-4 h-4 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Reply</TooltipContent>
              </Tooltip>

              {/* Thread */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-2 hover:bg-secondary transition-colors">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Start Thread</TooltipContent>
              </Tooltip>

              {/* More Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 hover:bg-secondary transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Message
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Pin className="w-4 h-4 mr-2" />
                    Pin Message
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Text
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Message
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipProvider>
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  )
})

interface MessageListProps {
  messages: Message[]
  onReact: (messageId: string, emoji: string) => void
}

export function MessageList({ messages, onReact }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isAtBottom && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages.length, isAtBottom])

  // Track scroll position
  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current
      setIsAtBottom(scrollHeight - scrollTop - clientHeight < 50)
    }
  }

  // Group messages from same user within 5 minutes
  const isGroupedWithPrevious = (index: number): boolean => {
    if (index === 0) return false
    const current = messages[index]
    const previous = messages[index - 1]
    
    if (current.userId !== previous.userId) return false
    if (current.replyTo) return false
    
    const timeDiff = current.timestamp.getTime() - previous.timestamp.getTime()
    return timeDiff < 5 * 60 * 1000 // 5 minutes
  }

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto scrollbar-thin"
      onScroll={handleScroll}
    >
      <div className="py-4">
        {messages.map((message, index) => (
          <MessageItem
            key={message.id}
            message={message}
            isGrouped={isGroupedWithPrevious(index)}
            onReact={onReact}
          />
        ))}
      </div>
    </div>
  )
}
