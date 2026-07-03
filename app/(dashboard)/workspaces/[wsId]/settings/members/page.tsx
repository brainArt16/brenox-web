"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, UserPlus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { PageHeader } from "@/components/layout/page-header"
import { getWorkspace, getMembers, inviteMember, removeMember, updateMemberRole } from "@/lib/api"
import type { WorkspaceListItem, WorkspaceMember } from "@/lib/types"
import { toast } from "sonner"

export default function MembersPage() {
  const params = useParams()
  const wsId = Number(params.wsId)
  const [workspace, setWorkspace] = useState<WorkspaceListItem | null>(null)
  const [members, setMembers] = useState<WorkspaceMember[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"admin" | "moderator" | "member">("member")

  function load() {
    Promise.all([getWorkspace(wsId), getMembers(wsId)]).then(([ws, m]) => {
      setWorkspace(ws)
      setMembers(m)
    })
  }

  useEffect(() => {
    if (wsId) load()
  }, [wsId])

  async function handleInvite() {
    if (!email.trim()) return
    await inviteMember(wsId, email.trim(), role)
    toast.success("Member invited")
    setDialogOpen(false)
    setEmail("")
    load()
  }

  async function handleRemove(userId: number) {
    await removeMember(wsId, userId)
    toast.success("Member removed")
    load()
  }

  async function handleRoleChange(userId: number, role: WorkspaceMember["role"]) {
    await updateMemberRole(wsId, userId, role)
    toast.success("Role updated")
    load()
  }

  const canManage = workspace?.role === "owner" || workspace?.role === "admin"

  return (
    <div className="space-y-8">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href={`/workspaces/${wsId}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to workspace
        </Link>
      </Button>

      <PageHeader
        eyebrow={workspace?.name ?? "Workspace"}
        title="Members"
        description="Invite teammates and manage roles for this workspace."
        action={
          canManage ? (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite member
                </Button>
              </DialogTrigger>
              <DialogContent className="border-border bg-card">
                <DialogHeader>
                  <DialogTitle>Invite member</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => void handleInvite()}>Send invite</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : undefined
        }
      />

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              {canManage && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.user_id} className="border-border">
                <TableCell className="font-medium">{member.username}</TableCell>
                <TableCell className="text-muted-foreground">{member.email}</TableCell>
                <TableCell>
                  {canManage && member.role !== "owner" ? (
                    <Select
                      value={member.role}
                      onValueChange={(v) =>
                        void handleRoleChange(member.user_id, v as WorkspaceMember["role"])
                      }
                    >
                      <SelectTrigger className="h-8 w-[120px] bg-surface capitalize">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="capitalize">{member.role}</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(member.created_at).toLocaleDateString()}
                </TableCell>
                {canManage && (
                  <TableCell className="text-right">
                    {member.role === "owner" ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-xs text-muted-foreground">Owner</span>
                          </TooltipTrigger>
                          <TooltipContent>Owner cannot be modified</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => void handleRemove(member.user_id)}
                        aria-label="Remove member"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
