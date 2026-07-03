"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Check, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface OnboardingStep {
  id: string
  label: string
  href?: string
  done: boolean
}

interface OnboardingChecklistProps {
  steps: OnboardingStep[]
  storageKey?: string
}

export function OnboardingChecklist({ steps, storageKey = "brenox-onboarding-dismissed" }: OnboardingChecklistProps) {
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    setDismissed(localStorage.getItem(storageKey) === "1")
  }, [storageKey])

  const completed = steps.filter((s) => s.done).length
  const allDone = completed === steps.length

  if (dismissed || allDone) return null

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-surface-elevated p-5">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Getting started</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {completed} of {steps.length} complete
          </p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => {
          localStorage.setItem(storageKey, "1")
          setDismissed(true)
        }} aria-label="Dismiss">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${(completed / steps.length) * 100}%` }}
        />
      </div>

      <ul className="mt-4 space-y-2">
        {steps.map((step) => (
          <li key={step.id}>
            {step.href && !step.done ? (
              <Link
                href={step.href}
                className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-secondary/50"
              >
                <StepIcon done={step.done} />
                <span className="flex-1 text-foreground">{step.label}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ) : (
              <div className="flex items-center gap-3 px-2 py-2 text-sm">
                <StepIcon done={step.done} />
                <span className={cn(step.done ? "text-muted-foreground line-through" : "text-foreground")}>
                  {step.label}
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function StepIcon({ done }: { done: boolean }) {
  return (
    <span
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold",
        done ? "border-success bg-success/20 text-success" : "border-border bg-surface text-muted-foreground"
      )}
    >
      {done ? <Check className="h-3 w-3" /> : ""}
    </span>
  )
}
