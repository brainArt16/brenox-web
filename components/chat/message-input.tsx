"use client"

import { useState, useRef, useEffect } from "react"
import { m, AnimatePresence } from "framer-motion"
import { 
  Send, 
  Smile, 
  Paperclip, 
  AtSign, 
  Hash, 
  Code, 
  Bold, 
  Italic, 
  Link2,
  Image,
  Gift,
  Mic,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Common emojis for picker
const emojiCategories = {
  "Smileys": ["😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘"],
  "Gestures": ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👋", "🤚", "🖐️", "✋", "🖖", "👏", "🙌", "🤲"],
  "Symbols": ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "💯", "✅", "❌", "⭐", "🔥", "💥", "✨", "🎉"],
}

interface MessageInputProps {
  channelName: string
  onSend: (content: string) => void
  onTyping?: () => void
  replyTo?: { userName: string; content: string } | null
  onCancelReply?: () => void
}

export function MessageInput({ 
  channelName, 
  onSend, 
  onTyping,
  replyTo,
  onCancelReply 
}: MessageInputProps) {
  const [content, setContent] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px"
    }
  }, [content])

  // Handle typing indicator
  useEffect(() => {
    if (content && onTyping) {
      const timeout = setTimeout(onTyping, 300)
      return () => clearTimeout(timeout)
    }
  }, [content, onTyping])

  const handleSubmit = () => {
    if (!content.trim()) return
    onSend(content)
    setContent("")
    onCancelReply?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const insertEmoji = (emoji: string) => {
    setContent(prev => prev + emoji)
    textareaRef.current?.focus()
  }

  const formatTools = [
    { icon: Bold, label: "Bold", action: () => {} },
    { icon: Italic, label: "Italic", action: () => {} },
    { icon: Code, label: "Code", action: () => {} },
    { icon: Link2, label: "Link", action: () => {} },
  ]

  return (
    <div className="p-4 border-t border-border bg-surface">
      {/* Reply Preview */}
      <AnimatePresence>
        {replyTo && (
          <m.div
            className="flex items-center justify-between mb-2 p-2 rounded-lg bg-secondary/50 border border-border"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Replying to</span>
              <span className="font-medium">{replyTo.userName}</span>
              <span className="text-muted-foreground truncate max-w-[200px]">
                {replyTo.content}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onCancelReply}
            >
              <X className="w-4 h-4" />
            </Button>
          </m.div>
        )}
      </AnimatePresence>

      {/* Input Container */}
      <div className="flex items-end gap-2">
        <div className="flex-1 flex flex-col bg-card rounded-lg border border-border focus-within:border-primary/50 transition-colors">
          {/* Formatting Toolbar (optional) */}
          <div className="hidden md:flex items-center gap-1 px-3 pt-2 border-b border-border/50">
            {formatTools.map((tool) => (
              <Button
                key={tool.label}
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={tool.action}
              >
                <tool.icon className="w-4 h-4 text-muted-foreground" />
              </Button>
            ))}
          </div>

          {/* Text Area */}
          <div className="flex items-end p-3 gap-2">
            {/* Attachment Button */}
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
              <Paperclip className="w-4 h-4 text-muted-foreground" />
            </Button>

            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message #${channelName}`}
              className="flex-1 resize-none bg-transparent text-sm focus:outline-none min-h-[24px] max-h-[200px] py-1"
              rows={1}
            />

            {/* Action Buttons */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* GIF */}
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Gift className="w-4 h-4 text-muted-foreground" />
              </Button>

              {/* Emoji Picker */}
              <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Smile className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-3">
                    <input
                      type="text"
                      placeholder="Search emoji..."
                      className="w-full px-3 py-2 bg-secondary rounded-md text-sm focus:outline-none"
                    />
                  </div>
                  <div className="max-h-64 overflow-y-auto scrollbar-thin p-2">
                    {Object.entries(emojiCategories).map(([category, emojis]) => (
                      <div key={category} className="mb-3">
                        <div className="text-xs font-medium text-muted-foreground px-1 mb-2">
                          {category}
                        </div>
                        <div className="grid grid-cols-8 gap-1">
                          {emojis.map((emoji) => (
                            <button
                              key={emoji}
                              className="w-8 h-8 flex items-center justify-center rounded hover:bg-secondary transition-colors"
                              onClick={() => {
                                insertEmoji(emoji)
                                setShowEmojiPicker(false)
                              }}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Send Button */}
        <Button 
          onClick={handleSubmit}
          disabled={!content.trim()}
          className="h-10 w-10 p-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Typing Indicators Slot */}
      <div className="h-5 mt-1 text-xs text-muted-foreground">
        {/* This will be populated by the parent component */}
      </div>
    </div>
  )
}
