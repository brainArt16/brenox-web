"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Hash,
  MessageSquare,
  Users,
  Settings,
  Bell,
  Code2,
  BarChart3,
  Shield,
  Video,
  Search,
  User,
  LogOut,
  Moon,
  Sun,
} from "lucide-react"

interface SearchCommandProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const [isOpen, setIsOpen] = useState(open ?? false)
  const router = useRouter()

  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((open) => !open)
        onOpenChange?.(!isOpen)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [isOpen, onOpenChange])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    onOpenChange?.(open)
  }

  const runCommand = (command: () => void) => {
    handleOpenChange(false)
    command()
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={handleOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => runCommand(() => router.push("/app"))}>
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Go to Messages</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/app/call"))}>
            <Video className="mr-2 h-4 w-4" />
            <span>Start a Call</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => {})}>
            <Search className="mr-2 h-4 w-4" />
            <span>Search Messages</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Channels">
          <CommandItem onSelect={() => runCommand(() => router.push("/app/channels/1"))}>
            <Hash className="mr-2 h-4 w-4" />
            <span>general</span>
            <span className="ml-auto text-xs text-muted-foreground">Text</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/app/channels/2"))}>
            <Hash className="mr-2 h-4 w-4" />
            <span>engineering</span>
            <span className="ml-auto text-xs text-muted-foreground">Text</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/app/channels/3"))}>
            <Hash className="mr-2 h-4 w-4" />
            <span>design</span>
            <span className="ml-auto text-xs text-muted-foreground">Text</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/app/channels/4"))}>
            <Hash className="mr-2 h-4 w-4" />
            <span>support</span>
            <span className="ml-auto text-xs text-muted-foreground">Text</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Direct Messages">
          <CommandItem onSelect={() => runCommand(() => {})}>
            <User className="mr-2 h-4 w-4" />
            <span>Sarah Chen</span>
            <span className="ml-auto h-2 w-2 rounded-full bg-emerald-500" />
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => {})}>
            <User className="mr-2 h-4 w-4" />
            <span>Mike Johnson</span>
            <span className="ml-auto h-2 w-2 rounded-full bg-emerald-500" />
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => {})}>
            <User className="mr-2 h-4 w-4" />
            <span>Emily Zhang</span>
            <span className="ml-auto h-2 w-2 rounded-full bg-zinc-500" />
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => router.push("/app/notifications"))}>
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/app/developers"))}>
            <Code2 className="mr-2 h-4 w-4" />
            <span>Developer Console</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/app/analytics"))}>
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Analytics</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/app/admin"))}>
            <Shield className="mr-2 h-4 w-4" />
            <span>Admin Panel</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/app/settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Account">
          <CommandItem onSelect={() => runCommand(() => {})}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => {})}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Toggle Theme</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/login"))}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
