import type { LucideIcon } from "lucide-react"
import {
  Bell,
  Globe,
  MessageSquare,
  Mic,
  Paperclip,
  Radio,
  Server,
  Shield,
  Smartphone,
  Video,
  Webhook,
  Zap,
} from "lucide-react"
import { ALL_DOC_SECTIONS, getSdkOrDefault } from "./sdk-registry"
import { getSnippetsForSdkSafe, BRENOX_API_URL_PRODUCTION } from "./sdk-snippets"

export {
  ALL_DOC_SECTIONS,
  DEFAULT_SDK_ID,
  SDK_CATEGORIES,
  SDK_FEATURE_LABELS,
  SDK_REGISTRY,
  getAvailableSdks,
  getDocSectionsForSdk,
  getSdkById,
  getSdkOrDefault,
  getSdksByCategory,
} from "./sdk-registry"
export type { DocSectionId, SdkDefinition, SdkFeatureKey, SdkStatus } from "./sdk-registry"
export { getSnippetsForSdk, getSnippetsForSdkSafe } from "./sdk-snippets"
export type { SdkSnippets } from "./sdk-snippets"
export {
  SDK_VERSION_CATALOG,
  buildDocsQuery,
  getDefaultVersion,
  getVersionDoc,
  getVersionOrDefault,
  getVersionsForSdk,
} from "./sdk-versions"

export type { SdkVersionDoc, SdkVersionStatus } from "./sdk-versions"
export {
  ENGINE_VERSION_CATALOG,
  getDefaultEngineVersion,
  getEngineVersion,
  getEngineVersionOrDefault,
  getEngineVersions,
} from "./engine-versions"
export type { EngineVersionDoc, EngineVersionStatus } from "./engine-versions"

export const DOC_SECTIONS = ALL_DOC_SECTIONS

export const DOC_QUICK_LINKS = [
  { id: "quickstart", label: "Quick start", href: "#quickstart" },
  { id: "browser-origins", label: "Browser origins", href: "#browser-origins" },
  { id: "sandbox", label: "Sandbox vs live", href: "#sandbox" },
  { id: "messaging", label: "Messaging", href: "#messaging" },
  { id: "calls", label: "Calls", href: "#calls" },
  { id: "react", label: "React", href: "#react" },
  { id: "webhooks", label: "Webhooks", href: "#webhooks" },
] as const

export interface DocCapability {
  icon: LucideIcon
  title: string
  description: string
  sdk: string
  status: "ready" | "signaling"
}

export const DOC_CAPABILITIES: DocCapability[] = [
  {
    icon: MessageSquare,
    title: "Messaging",
    description: "Send, list, edit messages with REST and live WebSocket delivery.",
    sdk: "BrenoxClient",
    status: "ready",
  },
  {
    icon: Radio,
    title: "Typing & presence",
    description: "Realtime typing indicators and online/away/offline status.",
    sdk: "BrenoxClient",
    status: "ready",
  },
  {
    icon: Paperclip,
    title: "Attachments",
    description: "Upload files and attach them to messages via presigned URLs.",
    sdk: "BrenoxClient",
    status: "ready",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "In-app notifications with mark-read and poll hooks.",
    sdk: "BrenoxClient",
    status: "ready",
  },
  {
    icon: Mic,
    title: "Voice calls",
    description: "Call lifecycle + WebRTC signaling. You wire RTCPeerConnection.",
    sdk: "CallSignaling",
    status: "signaling",
  },
  {
    icon: Video,
    title: "Video & screen",
    description: "Video mode, camera toggle, and screen-share signaling events.",
    sdk: "CallSignaling",
    status: "signaling",
  },
  {
    icon: Server,
    title: "Backend automation",
    description: "Provision users, create channels, send messages from your server.",
    sdk: "BrenoxServer",
    status: "ready",
  },
  {
    icon: Webhook,
    title: "Webhooks",
    description: "HTTPS callbacks for messages, users, and channels.",
    sdk: "Console",
    status: "ready",
  },
]

export const CONSOLE_STEPS = [
  {
    number: 1,
    title: "Create app",
    description: "Register an app — Brenox provisions live and sandbox workspaces.",
    href: "/apps/new",
  },
  {
    number: 2,
    title: "Get API key",
    description: "Create a sandbox key (bx_test_*) for BrenoxServer.",
    href: "/apps",
  },
  {
    number: 3,
    title: "Allow browser origins",
    description: "List every domain where your frontend calls Brenox (REST + WebSocket).",
    href: "/apps",
  },
  {
    number: 4,
    title: "Try sandbox",
    description: "Dry-run server SDK operations before wiring your backend.",
    href: "/apps",
  },
  {
    number: 5,
    title: "Install SDK",
    description: "Add @brenox/sdk to your frontend and backend.",
    href: "#quickstart",
  },
] as const

export const BROWSER_ORIGINS_STEPS = [
  {
    number: 1,
    title: "Open your app",
    description: "Developer console → Apps → select the app that owns your chat UI.",
  },
  {
    number: 2,
    title: "Add each origin",
    description:
      "Under Allowed browser origins, enter the full URL users load — e.g. https://app.example.com.",
  },
  {
    number: 3,
    title: "Save",
    description: "Changes apply within about a minute. Add localhost origins for local dev.",
  },
  {
    number: 4,
    title: "Issue embed sessions",
    description:
      "Use BrenoxServer.sessions on your backend. User JWTs include app_id so Brenox can match the origin.",
  },
] as const

export const BROWSER_ORIGINS_RULES = [
  {
    title: "HTTPS hostnames",
    body: "Use full HTTPS origins with hostnames — no paths, query strings, trailing slash, or IP addresses. Example: https://app.example.com",
  },
  {
    title: "Local development exception",
    body: "HTTP is accepted only for localhost and loopback IPs such as http://localhost:3000 or http://127.0.0.1:5173.",
  },
  {
    title: "Per-app allowlist",
    body: "Each app stores up to 20 origins. Customer domains are configured here — not in Brenox engine env vars.",
  },
  {
    title: "Platform vs customer",
    body: "The Brenox console (breno-x.com) uses platform CORS env vars. Your product domains use the per-app list.",
  },
  {
    title: "Server SDK exempt",
    body: "Backend /v1 calls with bx_* API keys are not subject to browser CORS. Only browser clients need allowed origins.",
  },
  {
    title: "Pass origin in the SDK",
    body: "Set origin: window.location.origin on channel and call-signaling connections so WebSocket upgrades are checked.",
  },
] as const

export const BROWSER_ORIGINS_EXAMPLE = `# Allowed browser origins (App → Overview)
https://app.example.com
https://staging.example.com
http://localhost:3000
http://127.0.0.1:3000

# Production demo chat
https://demo-chat.breno-x.com`

export const SANDBOX_LANES_STEPS = [
  {
    number: 1,
    title: "Create sandbox key",
    description: "Apps → API Keys → create with sandbox enabled (bx_test_* prefix).",
  },
  {
    number: 2,
    title: "Develop against production API",
    description: "Point BrenoxServer at https://api.breno-x.com — sandbox keys use the sandbox workspace automatically.",
  },
  {
    number: 3,
    title: "Issue embed sessions",
    description: "POST /v1/sessions returns workspace_id + environment. Pass workspace_id to the browser SDK.",
  },
  {
    number: 4,
    title: "Ship with live key",
    description: "Swap to bx_live_* in production backends. BrenoxServer throws if bx_test_* is used with NODE_ENV=production.",
  },
] as const

export const SANDBOX_LANES_RULES = [
  {
    title: "Same API host",
    body: "Sandbox and live keys both call api.breno-x.com. Isolation is per-app workspace — not separate deployments.",
  },
  {
    title: "Separate data",
    body: "Users, channels, and messages in sandbox never appear in live (and vice versa), even with the same external_id.",
  },
  {
    title: "Sandbox is free to test",
    body: "Sandbox traffic does not count toward plan message quotas and does not fire webhooks.",
  },
  {
    title: "JWT lane lock",
    body: "Embed session tokens include key_env. Browser clients cannot access the other workspace for that app.",
  },
] as const

export const SANDBOX_LANES_EXAMPLE = `# Sandbox (local / CI)
BRENOX_API_KEY=bx_test_...
BRENOX_API_URL=https://api.breno-x.com

# Production backend
BRENOX_API_KEY=bx_live_...
BRENOX_API_URL=https://api.breno-x.com

# Session response (sandbox key)
{
  "token": "eyJ...",
  "workspace_id": 12,
  "environment": "sandbox",
  "user": { "external_id": "user-1" }
}`

export const REACT_HOOKS = [
  {
    name: "useMessages",
    description: "History + live messages, send, connection state.",
    snippet: "useMessages(workspaceId, channelId, { channel: { origin } })",
  },
  {
    name: "useChannel",
    description: "Low-level WebSocket — typing, custom events.",
    snippet: "useChannel(workspaceId, channelId, options)",
  },
  {
    name: "useNotifications",
    description: "Poll notifications, mark read, mark all read.",
    snippet: "useNotifications({ pollIntervalMs: 30_000 })",
  },
  {
    name: "useCallSignaling",
    description: "Voice/video call signaling with initiate, join, leave.",
    snippet: "useCallSignaling(workspaceId, channelId)",
  },
] as const

export const WEBSOCKET_EVENTS = {
  messaging: ["message.new", "message.updated", "typing.start", "typing.stop"] as const,
  presence: ["presence.online", "presence.offline", "presence.status"] as const,
  calls: [
    "call.join",
    "call.leave",
    "call.end",
    "call.offer",
    "call.answer",
    "call.ice",
    "call.video.on",
    "call.video.off",
    "call.screen.start",
    "call.screen.stop",
  ] as const,
  other: ["notification.new"] as const,
}

export interface RealtimeEventDef {
  name: string
  description: string
  payload?: string
}

export interface RealtimeEventGroup {
  id: keyof typeof WEBSOCKET_EVENTS
  label: string
  description: string
  icon: LucideIcon
  events: RealtimeEventDef[]
}

export const REALTIME_FLOW_STEPS = [
  {
    step: 1,
    title: "Authenticate",
    description: "User JWT from SDK login — attached when the socket opens.",
  },
  {
    step: 2,
    title: "Connect",
    description:
      "Open a channel-scoped WebSocket with origin: window.location.origin — must be on your app's allowed origins list.",
  },
  {
    step: 3,
    title: "Subscribe",
    description: "Register handlers before or after connect — events buffer until ready.",
  },
  {
    step: 4,
    title: "React",
    description: "Update UI from payloads; SDK hooks wrap this for React apps.",
  },
] as const

export const REALTIME_CONNECTION_STATES = [
  { id: "idle", label: "Idle", description: "Not connected yet" },
  { id: "connecting", label: "Connecting", description: "Handshake in progress" },
  { id: "connected", label: "Connected", description: "Receiving live events" },
  { id: "reconnecting", label: "Reconnecting", description: "Auto-retry with backoff" },
] as const

export const REALTIME_EVENT_GROUPS: RealtimeEventGroup[] = [
  {
    id: "messaging",
    label: "Messaging",
    description: "Live delivery, edits, and typing indicators in a channel.",
    icon: MessageSquare,
    events: [
      {
        name: "message.new",
        description: "A message was posted to the channel.",
        payload: "{ id, content, user_id, created_at }",
      },
      {
        name: "message.updated",
        description: "An existing message was edited.",
        payload: "{ id, content, updated_at }",
      },
      {
        name: "typing.start",
        description: "A member started typing.",
        payload: "{ user_id, channel_id }",
      },
      {
        name: "typing.stop",
        description: "Typing indicator cleared for a member.",
        payload: "{ user_id, channel_id }",
      },
    ],
  },
  {
    id: "presence",
    label: "Presence",
    description: "Who is online and their status across the workspace.",
    icon: Radio,
    events: [
      {
        name: "presence.online",
        description: "User came online.",
        payload: "{ user_id, last_seen_at }",
      },
      {
        name: "presence.offline",
        description: "User went offline.",
        payload: "{ user_id, last_seen_at }",
      },
      {
        name: "presence.status",
        description: "Custom status changed (away, busy, etc.).",
        payload: "{ user_id, status, message? }",
      },
    ],
  },
  {
    id: "calls",
    label: "Calls",
    description: "WebRTC signaling — SDP, ICE, and call lifecycle (not media streams).",
    icon: Video,
    events: [
      { name: "call.join", description: "Participant joined the call room." },
      { name: "call.leave", description: "Participant left the call." },
      {
        name: "call.end",
        description: "Call ended for everyone — fired when one or fewer participants remain after a leave.",
      },
      { name: "call.offer", description: "SDP offer from a peer.", payload: "{ call_id, sdp, to_user_id }" },
      { name: "call.answer", description: "SDP answer from a peer.", payload: "{ call_id, sdp }" },
      { name: "call.ice", description: "ICE candidate exchange.", payload: "{ call_id, candidate }" },
      { name: "call.video.on", description: "Remote peer enabled camera." },
      { name: "call.video.off", description: "Remote peer disabled camera." },
      { name: "call.screen.start", description: "Screen share started." },
      { name: "call.screen.stop", description: "Screen share stopped." },
    ],
  },
  {
    id: "other",
    label: "Notifications",
    description: "In-app alerts pushed over the same connection.",
    icon: Bell,
    events: [
      {
        name: "notification.new",
        description: "New notification for the signed-in user.",
        payload: "{ id, type, title, body, read }",
      },
    ],
  },
]

export const REALTIME_HANDLER_EXAMPLE = `// Register handlers before connect — none are missed
conn.on("message.new", (event) => {
  appendMessage(event.payload);
});

conn.on("typing.start", (event) => {
  showTypingIndicator(event.payload.user_id);
});

conn.on("typing.stop", (event) => {
  hideTypingIndicator(event.payload.user_id);
});

conn.on("presence.online", (event) => {
  setMemberStatus(event.payload.user_id, "online");
});

await conn.connect();`


export const WEBHOOK_EVENTS = [
  {
    name: "message.created",
    description: "A new message was sent in your app's workspace.",
  },
  {
    name: "user.provisioned",
    description: "A user was provisioned via BrenoxServer.",
  },
  {
    name: "channel.created",
    description: "A new channel was created.",
  },
] as const

export const SDK_PACKAGES = [
  {
    name: "@brenox/sdk",
    export: "BrenoxClient",
    install: "npm install @brenox/sdk",
    use: "End-user chat in browsers, mobile, and Node",
    features: [
      "auth",
      "workspaces",
      "channels",
      "messages",
      "presence",
      "WebSocket",
      "notifications",
      "attachments",
      "callSignaling",
    ],
  },
  {
    name: "@brenox/sdk/server",
    export: "BrenoxServer",
    install: "npm install @brenox/sdk",
    use: "Trusted backend — provision users, send messages, manage channels",
    features: ["users.provision", "channels.create", "messages.send", "messages.list"],
  },
  {
    name: "@brenox/react",
    export: "BrenoxProvider + hooks",
    install: "npm install @brenox/react @brenox/sdk",
    use: "React apps — live messages, notifications, call signaling",
    features: ["useMessages", "useChannel", "useNotifications", "useCallSignaling"],
  },
] as const

export const BEST_PRACTICES = [
  {
    icon: Globe,
    title: "Allowlist browser origins",
    body: "Before shipping a web client, add every production and staging domain under App → Allowed browser origins. Missing origins block REST and WebSocket from the browser.",
  },
  {
    icon: Shield,
    title: "Never expose API keys",
    body: "Use BrenoxClient + JWT in browsers. BrenoxServer + bx_* keys only on your server.",
  },
  {
    icon: Smartphone,
    title: "Token storage",
    body: "Browsers: localStorageTokenStore(). Mobile: platform secure storage. SDK auto-refreshes on expiry.",
  },
  {
    icon: Zap,
    title: "Sandbox first",
    body: "Use bx_test_* keys in development. Switch to bx_live_* only in production.",
  },
] as const

/** @deprecated use getSnippetsForSdkSafe(sdk) — kept for app overview snippet */
export function getDocSnippets(apiUrl = BRENOX_API_URL_PRODUCTION) {
  const s = getSnippetsForSdkSafe(getSdkOrDefault("typescript"), apiUrl)
  return {
    ...s,
    serverIntegration: s.server,
    react: s.framework || (s as { react?: string }).react,
  }
}
