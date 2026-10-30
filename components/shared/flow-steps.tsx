import Link from "next/link"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface FlowStep {
  number: number
  title: string
  description: string
  href?: string
  active?: boolean
  done?: boolean
}

export function FlowSteps({ steps }: { steps: FlowStep[] }) {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, index) => {
        const content = (
          <>
            <div className="flex items-center justify-between gap-2">
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  step.done && "bg-success/20 text-success",
                  step.active && !step.done && "bg-foreground text-background",
                  !step.active &&
                    !step.done &&
                    "border border-border bg-surface text-muted-foreground"
                )}
              >
                {step.done ? <Check className="h-3.5 w-3.5" /> : step.number}
              </span>
              {index < steps.length - 1 && (
                <span className="hidden h-px flex-1 bg-border lg:block" aria-hidden />
              )}
            </div>
            <div className="mt-3 min-w-0">
              <p
                className={cn(
                  "text-sm font-medium",
                  step.done ? "text-muted-foreground" : "text-foreground"
                )}
              >
                {step.title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          </>
        )

        const className = cn(
          "relative block h-full rounded-2xl border p-4 transition-all",
          step.active && !step.done && "border-foreground/30 bg-surface-elevated shadow-[var(--card-shadow)]",
          step.done && "border-border/80 bg-card/60",
          !step.active && !step.done && "border-border bg-card hover:border-foreground/20 hover:bg-surface-elevated"
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
