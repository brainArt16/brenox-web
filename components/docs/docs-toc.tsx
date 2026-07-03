import { cn } from "@/lib/utils"
import { DOC_SECTIONS } from "@/lib/docs/content"

interface DocsTocProps {
  className?: string
}

export function DocsToc({ className }: DocsTocProps) {
  return (
    <nav className={cn("space-y-1", className)}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        On this page
      </p>
      {DOC_SECTIONS.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground"
        >
          {section.label}
        </a>
      ))}
    </nav>
  )
}
