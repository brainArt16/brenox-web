import Link from "next/link"
import { cn } from "@/lib/utils"

export interface FlowStep {
  number: number
  title: string
  description: string
  href?: string
  active?: boolean
}

export function FlowSteps({ steps }: { steps: FlowStep[] }) {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step) => {
        const content = (
          <>
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                step.active
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-surface text-muted-foreground"
              )}
            >
              {step.number}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{step.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          </>
        )

        const className = cn(
          "flex gap-3 rounded-xl border p-4 transition-colors",
          step.active
            ? "border-primary/40 bg-surface-elevated"
            : "border-border bg-card hover:border-primary/20 hover:bg-surface-elevated"
        )

        return (
          <li key={step.number}>
            {step.href ? (
              <Link href={step.href} className={className}>
                {content}
              </Link>
            ) : (
              <div className={className}>{content}</div>
            )}
          </li>
        )
      })}
    </ol>
  )
}
