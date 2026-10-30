import Link from "next/link"
import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuickLinkTileProps {
  href: string
  icon: LucideIcon
  label: string
  description?: string
  className?: string
}

export function QuickLinkTile({
  href,
  icon: Icon,
  label,
  description,
  className,
}: QuickLinkTileProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all",
        "hover:border-foreground/20 hover:bg-surface-elevated",
        className
      )}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-elevated text-muted-foreground transition-colors group-hover:text-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && (
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>
    </Link>
  )
}
