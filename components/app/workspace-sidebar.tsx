"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { m } from "framer-motion"
import { 
  Plus, 
  Settings, 
  MessageSquare, 
  Users,
  Bell,
  Code2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock workspaces data
const workspaces = [
  { id: "1", name: "Brenox Team", icon: "P", unread: 3, color: "bg-primary" },
  { id: "2", name: "Engineering", icon: "E", unread: 0, color: "bg-accent" },
  { id: "3", name: "Design", icon: "D", unread: 7, color: "bg-success" },
]

export function WorkspaceSidebar() {
  const [activeWorkspace, setActiveWorkspace] = useState(workspaces[0].id)
  const pathname = usePathname()

  return (
    <TooltipProvider delayDuration={0}>
      <aside className="hidden md:flex w-[72px] h-screen flex-col items-center py-3 bg-sidebar border-r border-sidebar-border">
        {/* Workspace List */}
        <div className="flex-1 flex flex-col items-center gap-2 w-full px-3">
          {/* Home / DMs */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/app"
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                  pathname === "/app" 
                    ? "bg-primary text-primary-foreground rounded-2xl" 
                    : "bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground hover:rounded-xl"
                )}
              >
                <MessageSquare className="w-5 h-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Direct Messages</TooltipContent>
          </Tooltip>

          <div className="w-8 h-px bg-sidebar-border my-1" />

          {/* Workspaces */}
          {workspaces.map((workspace) => (
            <Tooltip key={workspace.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveWorkspace(workspace.id)}
                  className="relative"
                >
                  <m.div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center font-semibold text-sm transition-all",
                      activeWorkspace === workspace.id 
                        ? `${workspace.color} text-primary-foreground rounded-2xl` 
                        : "bg-secondary hover:bg-secondary/80 text-muted-foreground hover:rounded-xl"
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {workspace.icon}
                  </m.div>
                  
                  {/* Active indicator */}
                  {activeWorkspace === workspace.id && (
                    <m.div
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[10px] w-1 h-8 bg-foreground rounded-r-full"
                      layoutId="workspace-indicator"
                    />
                  )}
                  
                  {/* Unread badge */}
                  {workspace.unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-medium rounded-full flex items-center justify-center">
                      {workspace.unread > 9 ? "9+" : workspace.unread}
                    </span>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">{workspace.name}</TooltipContent>
            </Tooltip>
          ))}

          {/* Add Workspace */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="w-12 h-12 rounded-xl flex items-center justify-center bg-secondary hover:bg-success/20 text-muted-foreground hover:text-success transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Create Workspace</TooltipContent>
          </Tooltip>

          {/* Developer Console */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/apps"
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                  pathname.startsWith("/apps") || pathname.startsWith("/workspaces") || pathname.startsWith("/settings")
                    ? "bg-primary text-primary-foreground rounded-2xl"
                    : "bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground hover:rounded-xl"
                )}
              >
                <Code2 className="w-5 h-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Developer Console</TooltipContent>
          </Tooltip>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col items-center gap-2 px-3">
          <div className="w-8 h-px bg-sidebar-border my-1" />
          
          {/* Notifications */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="relative w-12 h-12 rounded-xl flex items-center justify-center bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Notifications</TooltipContent>
          </Tooltip>

          {/* User Menu */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <button className="relative">
                    <Avatar className="w-12 h-12 rounded-xl border-2 border-transparent hover:border-primary transition-colors">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-online border-2 border-sidebar rounded-full" />
                  </button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="right">User Settings</TooltipContent>
            </Tooltip>
            
            <DropdownMenuContent side="right" align="end" className="w-56">
              <div className="px-2 py-2">
                <p className="font-medium">Alex Kim</p>
                <p className="text-sm text-muted-foreground">alex@brenox.dev</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Users className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </TooltipProvider>
  )
}
