import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type CalloutVariant = "info" | "tip" | "warning"

const variants: Record<CalloutVariant, { icon: string; className: string }> = {
  info: {
    icon: "text-primary",
    className: "border-primary/20 bg-primary/5",
  },
  tip: {
    icon: "text-success",
    className: "border-success/20 bg-success/5",
  },
  warning: {
    icon: "text-warning",
    className: "border-warning/20 bg-warning/5",
  },
}

interface DocsCalloutProps {
  icon: LucideIcon
  title: string
  children: React.ReactNode
  variant?: CalloutVariant
}

export function DocsCallout({
  icon: Icon,
  title,
  children,
  variant = "info",
}: DocsCalloutProps) {
  const style = variants[variant]
  return (
    <div className={cn("flex gap-3 rounded-xl border p-4", style.className)}>
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", style.icon)} />
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <div className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{children}</div>
      </div>
    </div>
  )
}
