"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateAllowedOriginsRequest } from "@/lib/engine/apps"
import type { App } from "@/lib/types"

interface AllowedOriginsEditorProps {
  app: App
  onSaved: (app: App) => void
}

export function AllowedOriginsEditor({ app, onSaved }: AllowedOriginsEditorProps) {
  const [origins, setOrigins] = useState<string[]>(app.allowed_origins ?? [])
  const [draft, setDraft] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  function addOrigin() {
    const value = draft.trim().replace(/\/$/, "")
    if (!value) return
    if (origins.includes(value)) {
      setDraft("")
      return
    }
    setOrigins((current) => [...current, value])
    setDraft("")
    setMessage(null)
  }

  function removeOrigin(origin: string) {
    setOrigins((current) => current.filter((item) => item !== origin))
    setMessage(null)
  }

  async function save() {
    setSaving(true)
    setError(null)
    setMessage(null)
    try {
      const updated = await updateAllowedOriginsRequest(app.id, origins)
      onSaved(updated)
      setOrigins(updated.allowed_origins ?? [])
      setMessage("Allowed origins saved.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save allowed origins")
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <div className="space-y-2">
        <h2 className="font-semibold">Allowed browser origins</h2>
        <p className="text-sm text-muted-foreground">
          Add each domain where your frontend calls Brenox from the browser, for example{" "}
          <code className="rounded bg-muted px-1 py-0.5">https://app.example.com</code>.
          Server-side <code className="rounded bg-muted px-1 py-0.5">/v1</code> calls do not need this.
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="https://app.example.com"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              addOrigin()
            }
          }}
        />
        <Button type="button" variant="secondary" onClick={addOrigin}>
          Add
        </Button>
      </div>

      <ul className="mt-4 space-y-2">
        {origins.length === 0 ? (
          <li className="text-sm text-muted-foreground">No origins configured yet.</li>
        ) : (
          origins.map((origin) => (
            <li
              key={origin}
              className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm"
            >
              <span className="font-mono break-all">{origin}</span>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeOrigin(origin)}>
                Remove
              </Button>
            </li>
          ))
        )}
      </ul>

      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
      {message ? <p className="mt-3 text-sm text-muted-foreground">{message}</p> : null}

      <Button className="mt-4" onClick={() => void save()} disabled={saving}>
        {saving ? "Saving…" : "Save origins"}
      </Button>
    </section>
  )
}
