"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Loader2, Play, FlaskConical, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/layout/page-header"
import { DocLinkCard } from "@/components/shared/doc-link-card"
import { getApp } from "@/lib/api"
import type { App } from "@/lib/types"

interface SdkResult {
  call: string
  input: object
  output: object
  durationMs: number
  ok: boolean
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function mockSdkCall(call: string, input: object): Promise<SdkResult> {
  const start = Date.now()
  await delay(400 + Math.random() * 200)
  const output =
    call === "server.users.provision"
      ? { id: 42, external_id: (input as { external_id: string }).external_id, username: (input as { username?: string }).username }
      : call === "server.channels.create"
        ? { id: 1, name: (input as { name: string }).name, workspace_id: 10 }
        : call === "server.messages.send"
          ? { id: 99, channel_id: (input as { channel_id: number }).channel_id, content: (input as { content: string }).content }
          : call === "server.messages.list"
            ? { messages: [{ id: 1, content: "Hello from sandbox", channel_id: (input as { channel_id: number }).channel_id }] }
            : { messages: [] }
  return {
    call,
    input,
    output,
    durationMs: Date.now() - start,
    ok: true,
  }
}

function JsonPanel({ result }: { result: SdkResult | null }) {
  if (!result) {
    return (
      <div className="flex h-full min-h-[360px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface p-8 text-center">
        <FlaskConical className="mb-3 h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium">No request yet</p>
        <p className="mt-1 text-xs text-muted-foreground">Run a sandbox operation to preview SDK input and output</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <span className={`rounded-md px-2 py-0.5 font-mono text-sm ${result.ok ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"}`}>
          {result.ok ? "ok" : "error"}
        </span>
        <span className="text-sm text-muted-foreground">{result.durationMs}ms</span>
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <p className="border-b border-border px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">SDK call</p>
        <pre className="max-h-24 overflow-auto p-3 font-mono text-xs leading-relaxed">{result.call}</pre>
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <p className="border-b border-border px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Input</p>
        <pre className="max-h-40 overflow-auto p-3 font-mono text-xs leading-relaxed">{JSON.stringify(result.input, null, 2)}</pre>
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <p className="border-b border-border px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Output</p>
        <pre className="max-h-52 overflow-auto p-3 font-mono text-xs leading-relaxed">{JSON.stringify(result.output, null, 2)}</pre>
      </div>
    </div>
  )
}

export default function SandboxPage() {
  const params = useParams()
  const appId = Number(params.appId)
  const [app, setApp] = useState<App | null>(null)
  const [loading, setLoading] = useState(true)
  const [apiKey, setApiKey] = useState("")
  const [result, setResult] = useState<SdkResult | null>(null)
  const [running, setRunning] = useState(false)

  const [provision, setProvision] = useState({ external_id: "user-1", username: "sdk_user" })
  const [channel, setChannel] = useState({ name: "general" })
  const [message, setMessage] = useState({ channel_id: "1", external_id: "user-1", content: "Hello from sandbox" })
  const [listParams, setListParams] = useState({ channel_id: "1", limit: "50" })

  useEffect(() => {
    getApp(appId)
      .then(setApp)
      .finally(() => setLoading(false))
  }, [appId])

  async function run(call: string, input: object) {
    if (!apiKey.trim()) {
      setResult({
        call,
        input,
        output: { error: "Paste a sandbox API key first (bx_test_...)" },
        durationMs: 0,
        ok: false,
      })
      return
    }
    setRunning(true)
    try {
      setResult(await mockSdkCall(call, input))
    } finally {
      setRunning(false)
    }
  }

  if (loading) return <Skeleton className="h-64 w-full rounded-xl" />
  if (!app) return <Button asChild><Link href="/apps">Back</Link></Button>

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={app.name}
        title="Sandbox"
        description="Try BrenoxServer operations with mock responses before wiring your backend."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <div className="rounded-xl border border-border bg-card p-5">
          <Label htmlFor="sandbox-key" className="text-sm font-medium">Sandbox API key</Label>
          <Input
            id="sandbox-key"
            type="password"
            placeholder="bx_test_..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="mt-2 font-mono bg-surface"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Session only — not stored. Create a sandbox key on the API Keys tab.
          </p>
        </div>
        <DocLinkCard
          title="BrenoxServer docs"
          description="Server SDK — provision users, channels, and messages."
          href="/docs#sdk-server"
          icon={BookOpen}
          className="lg:w-72"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <Tabs defaultValue="provision" className="w-full">
            <TabsList className="w-full bg-surface">
              <TabsTrigger value="provision" className="flex-1">User</TabsTrigger>
              <TabsTrigger value="channel" className="flex-1">Channel</TabsTrigger>
              <TabsTrigger value="send" className="flex-1">Send</TabsTrigger>
              <TabsTrigger value="list" className="flex-1">List</TabsTrigger>
            </TabsList>

            <TabsContent value="provision" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>external_id</Label>
                <Input value={provision.external_id} onChange={(e) => setProvision({ ...provision, external_id: e.target.value })} className="bg-surface font-mono" />
              </div>
              <div className="space-y-2">
                <Label>username</Label>
                <Input value={provision.username} onChange={(e) => setProvision({ ...provision, username: e.target.value })} className="bg-surface" />
              </div>
              <Button disabled={running} onClick={() => void run("server.users.provision", provision)}>
                {running ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                Provision user
              </Button>
            </TabsContent>

            <TabsContent value="channel" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>name</Label>
                <Input value={channel.name} onChange={(e) => setChannel({ name: e.target.value })} className="bg-surface font-mono" />
              </div>
              <Button disabled={running} onClick={() => void run("server.channels.create", channel)}>
                {running ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                Create channel
              </Button>
            </TabsContent>

            <TabsContent value="send" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>channel_id</Label>
                <Input value={message.channel_id} onChange={(e) => setMessage({ ...message, channel_id: e.target.value })} className="bg-surface font-mono" />
              </div>
              <div className="space-y-2">
                <Label>external_id</Label>
                <Input value={message.external_id} onChange={(e) => setMessage({ ...message, external_id: e.target.value })} className="bg-surface font-mono" />
              </div>
              <div className="space-y-2">
                <Label>content</Label>
                <Textarea value={message.content} onChange={(e) => setMessage({ ...message, content: e.target.value })} className="bg-surface" />
              </div>
              <Button
                disabled={running}
                onClick={() =>
                  void run("server.messages.send", {
                    channel_id: Number(message.channel_id),
                    external_id: message.external_id,
                    content: message.content,
                  })
                }
              >
                {running ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                Send message
              </Button>
            </TabsContent>

            <TabsContent value="list" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>channel_id</Label>
                <Input value={listParams.channel_id} onChange={(e) => setListParams({ ...listParams, channel_id: e.target.value })} className="bg-surface font-mono" />
              </div>
              <div className="space-y-2">
                <Label>limit</Label>
                <Input value={listParams.limit} onChange={(e) => setListParams({ ...listParams, limit: e.target.value })} className="bg-surface font-mono" />
              </div>
              <Button
                disabled={running}
                onClick={() =>
                  void run("server.messages.list", {
                    channel_id: Number(listParams.channel_id),
                    limit: Number(listParams.limit),
                  })
                }
              >
                {running ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                List messages
              </Button>
            </TabsContent>
          </Tabs>
        </div>

        <JsonPanel result={result} />
      </div>
    </div>
  )
}
