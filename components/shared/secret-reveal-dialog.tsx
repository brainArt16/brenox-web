"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { AlertTriangle } from "lucide-react"
import { CopyButton } from "@/components/shared/copy-button"

interface SecretRevealDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  secret: string
  onConfirm: () => void
}

export function SecretRevealDialog({
  open,
  onOpenChange,
  title,
  description,
  secret,
  onConfirm,
}: SecretRevealDialogProps) {
  const [confirmed, setConfirmed] = useState(false)

  function handleConfirm() {
    onConfirm()
    setConfirmed(false)
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && !confirmed) return
        onOpenChange(next)
        if (!next) setConfirmed(false)
      }}
    >
      <DialogContent
        className="border-border bg-card sm:max-w-lg"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Alert className="border-warning/30 bg-warning/10">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertDescription className="text-warning-foreground">
            This secret is shown only once. Store it securely before closing.
          </AlertDescription>
        </Alert>

        <div className="flex items-center gap-2 rounded-md border border-border bg-surface p-3">
          <code className="flex-1 break-all font-mono text-sm text-foreground">{secret}</code>
          <CopyButton value={secret} label="Secret copied" />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="secret-stored"
            checked={confirmed}
            onCheckedChange={(checked) => setConfirmed(checked === true)}
          />
          <Label htmlFor="secret-stored" className="cursor-pointer text-sm font-normal">
            I have stored this secret securely
          </Label>
        </div>

        <DialogFooter>
          <Button onClick={handleConfirm} disabled={!confirmed}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
