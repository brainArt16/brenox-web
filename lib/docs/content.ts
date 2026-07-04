import type { LucideIcon } from "lucide-react"
import {
  Bell,
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

export const DOC_SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "quickstart", label: "Quick start" },
  { id: "console", label: "Console setup" },
  { id: "auth", label: "Authentication" },
  { id: "messaging", label: "Messaging" },
  { id: "realtime", label: "Realtime" },
  { id: "calls", label: "Voice & video" },
  { id: "server", label: "BrenoxServer" },
  { id: "react", label: "React hooks" },
  { id: "webhooks", label: "Webhooks" },
  { id: "best-practices", label: "Best practices" },
] as const

export type DocSectionId = (typeof DOC_SECTIONS)[number]["id"]

export const BRENOX_API_URL_PLACEHOLDER = "https://api.brenox.io"

export const DOC_QUICK_LINKS = [
  { id: "quickstart", label: "Quick start", href: "#quickstart" },
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
    description: "Register an integration — each app gets an isolated workspace.",
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
    title: "Try sandbox",
    description: "Dry-run server SDK operations before wiring your backend.",
    href: "/apps",
  },
  {
    number: 4,
    title: "Install SDK",
    description: "Add @brenox/sdk to your frontend and backend.",
    href: "#quickstart",
  },
] as const

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

export function getDocSnippets(apiUrl = BRENOX_API_URL_PLACEHOLDER) {
  return {
    install: `npm install @brenox/sdk
npm install @brenox/react   # optional, for React hooks`,

    env: `# Server-side (BrenoxServer)
BRENOX_API_KEY=bx_test_your_sandbox_key

# Optional — SDK defaults work out of the box
BRENOX_API_URL=${apiUrl}
NEXT_PUBLIC_BRENOX_API_URL=${apiUrl}   # browser / React`,

    quickStart: `import { BrenoxClient, localStorageTokenStore } from "@brenox/sdk";

const client = new BrenoxClient({
  baseUrl: process.env.NEXT_PUBLIC_BRENOX_API_URL ?? "${apiUrl}",
  tokenStore: localStorageTokenStore(),
});

// 1. Sign in your user
await client.auth.login({ email: "user@example.com", password: "secret" });

// 2. Open or create a channel
const [workspace] = await client.workspaces.list();
const channel = await client.channels.create(workspace.id, { name: "general" });

// 3. Send a message
await client.messages.send(workspace.id, channel.ID, {
  content: "Hello from my app!",
});`,

    messaging: `// List history
const messages = await client.messages.list(workspaceId, channelId, { limit: 50 });

// Send with optional attachments
await client.messages.send(workspaceId, channelId, {
  content: "Check this out",
  attachments: [uploadedFile],
});

// Presence
await client.users.updateStatus({ status: "away" });`,

    attachments: `const file = new File(["content"], "report.pdf", { type: "application/pdf" });

const uploaded = await client.attachments.uploadFile(file, {
  fileName: file.name,
  mimeType: file.type,
});

await client.messages.send(workspaceId, channelId, {
  content: "See attached",
  attachments: [uploaded],
});`,

    realtime: `const conn = client.channel(workspaceId, channelId, {
  origin: window.location.origin,
});

conn.on("message.new", (e) => appendMessage(e.payload));
conn.on("typing.start", (e) => showTyping(e.payload.user_id));
conn.on("presence.status", (e) => updatePresence(e.payload));

await conn.connect();
conn.sendMessage("Hello realtime!");
conn.sendTyping(true);`,

    calls: `const signaling = client.callSignaling(workspaceId, channelId, {
  origin: window.location.origin,
});

signaling.on("call.offer", async (event) => {
  // Your WebRTC: create RTCPeerConnection, setRemoteDescription, etc.
  const pc = new RTCPeerConnection({ iceServers: [...] });
  await pc.setRemoteDescription(JSON.parse(event.payload.sdp));
  // ... answer and send back via signaling.sendAnswer()
});

await signaling.connect();

// Voice or video
const call = await signaling.initiate("video");
signaling.sendOffer({ call_id: call.id, to_user_id: 2, sdp: localSdp });

// In-call controls
signaling.videoOn(call.id);
signaling.screenStart(call.id);`,

    callsNote: `// Brenox SDK provides signaling only:
// ✓ initiate / join / leave
// ✓ SDP offer/answer + ICE exchange
// ✓ video on/off, screen share events
//
// You implement:
// • RTCPeerConnection
// • getUserMedia / getDisplayMedia
// • STUN/TURN servers
// • Call UI (mute, hang up, tiles)`,

    server: `import { BrenoxServer } from "@brenox/sdk/server";

const server = new BrenoxServer({
  baseUrl: process.env.BRENOX_API_URL ?? "${apiUrl}",
  apiKey: process.env.BRENOX_API_KEY!,
});

await server.users.provision({
  external_id: "your-auth-user-123",
  username: "alice",
});

const channel = await server.channels.create({ name: "support" });

await server.messages.send({
  channel_id: channel.id,
  external_id: "your-auth-user-123",
  content: "Your ticket has been opened.",
});`,

    react: `import { BrenoxClient } from "@brenox/sdk";
import {
  BrenoxProvider,
  useMessages,
  useNotifications,
  useCallSignaling,
} from "@brenox/react";

const client = new BrenoxClient({
  baseUrl: process.env.NEXT_PUBLIC_BRENOX_API_URL!,
});

function App() {
  return (
    <BrenoxProvider client={client}>
      <Chat workspaceId={1} channelId={1} />
    </BrenoxProvider>
  );
}

function Chat({ workspaceId, channelId }) {
  const { messages, sendMessage, connectionState } = useMessages(
    workspaceId,
    channelId,
    { channel: { origin: window.location.origin } },
  );

  return (
    <div>
      <span>{connectionState}</span>
      {messages.map((m) => <p key={m.id}>{m.content}</p>)}
      <button onClick={() => sendMessage("Hi!")}>Send</button>
    </div>
  );
}`,

    webhookVerify: `import crypto from "crypto";

export function verifyBrenoxWebhook(rawBody: string, signature: string, secret: string) {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected),
  );
}`,
  }
}
