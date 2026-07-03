import Link from "next/link"
import { cn } from "@/lib/utils"
import { ArrowUpRight, type LucideIcon } from "lucide-react"

interface DocLinkCardProps {
  title: string
  description: string
  href: string
  icon: LucideIcon
  external?: boolean
  className?: string
}

export function DocLinkCard({ title, description, href, icon: Icon, external, className }: DocLinkCardProps) {
  const Comp = external ? "a" : Link
  const props = external
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { href }

  return (
    <Comp
      {...props}
      className={cn(
        "group flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:bg-surface-elevated",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-elevated">
          <Icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </Comp>
  )
}
