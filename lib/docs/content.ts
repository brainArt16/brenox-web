export const DOC_SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "setup", label: "Setup" },
  { id: "console", label: "Console workflow" },
  { id: "auth", label: "Authentication" },
  { id: "sdk-client", label: "SDK — Client" },
  { id: "sdk-server", label: "SDK — Server" },
  { id: "sdk-react", label: "SDK — React" },
  { id: "webhooks", label: "Webhooks" },
  { id: "realtime", label: "Realtime events" },
  { id: "packages", label: "SDK packages" },
] as const

export type DocSectionId = (typeof DOC_SECTIONS)[number]["id"]

/** Public Brenox API URL — configure in your app via env, not by calling the platform directly. */
export const BRENOX_API_URL_PLACEHOLDER = "https://api.brenox.io"

export function getDocSnippets(apiUrl = BRENOX_API_URL_PLACEHOLDER) {
  return {
    sdkInstall: `# User-facing chat (browser, mobile, Node)
npm install @brenox/sdk

# Optional React hooks
npm install @brenox/react`,

    envExample: `# Your app — server-side (BrenoxServer)
BRENOX_API_KEY=bx_test_your_sandbox_key

# Your app — optional explicit API URL (defaults are provided by the SDK)
BRENOX_API_URL=${apiUrl}`,

    clientQuickStart: `import { BrenoxClient, localStorageTokenStore } from "@brenox/sdk";

const client = new BrenoxClient({
  baseUrl: process.env.BRENOX_API_URL ?? "${apiUrl}",
  tokenStore: localStorageTokenStore(),
});

await client.auth.login({
  email: "user@example.com",
  password: "secret",
});

const workspaces = await client.workspaces.list();
const channel = await client.channels.create(workspaces[0].id, {
  name: "general",
});

await client.messages.send(workspaces[0].id, channel.ID, {
  content: "Hello from my app!",
});`,

    clientRealtime: `const conn = client.channel(workspaceId, channelId, {
  origin: window.location.origin,
});

conn.on("message.new", (event) => {
  console.log(event.payload.content);
});

conn.on("typing.start", (event) => {
  console.log(\`\${event.payload.user_id} is typing\`);
});

await conn.connect();
conn.sendMessage("Hello realtime!");
conn.sendTyping(true);`,

    serverIntegration: `import { BrenoxServer } from "@brenox/sdk/server";

const server = new BrenoxServer({
  baseUrl: process.env.BRENOX_API_URL ?? "${apiUrl}",
  apiKey: process.env.BRENOX_API_KEY!,
});

// Map your auth user → Brenox app user
await server.users.provision({
  external_id: "your-user-id-123",
  username: "alice",
});

const channel = await server.channels.create({ name: "support" });

await server.messages.send({
  channel_id: channel.id,
  external_id: "your-user-id-123",
  content: "Ticket opened",
});`,

    reactSetup: `import { BrenoxClient } from "@brenox/sdk";
import { BrenoxProvider, useMessages } from "@brenox/react";

const client = new BrenoxClient({
  baseUrl: process.env.NEXT_PUBLIC_BRENOX_API_URL ?? "${apiUrl}",
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
      <p>Status: {connectionState}</p>
      {messages.map((m) => <p key={m.id}>{m.content}</p>)}
      <button onClick={() => sendMessage("Hi!")}>Send</button>
    </div>
  );
}`,

    webhookVerify: `// Verify webhook signatures on your server
import crypto from "crypto";

function verifyBrenoxWebhook(rawBody, signature, secret) {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}`,
  }
}

export const WEBSOCKET_EVENTS = [
  "message.new",
  "message.updated",
  "typing.start",
  "typing.stop",
  "presence.online",
  "presence.offline",
  "presence.status",
  "notification.new",
  "call.offer",
  "call.answer",
  "call.ice",
] as const

export const WEBHOOK_EVENTS = [
  "message.created",
  "user.provisioned",
  "channel.created",
] as const

export const SDK_PACKAGES = [
  {
    name: "@brenox/sdk",
    export: "BrenoxClient",
    use: "End-user chat in browsers, mobile, and Node",
    features: ["auth", "workspaces", "channels", "messages", "presence", "WebSocket", "notifications", "attachments"],
  },
  {
    name: "@brenox/sdk/server",
    export: "BrenoxServer",
    use: "Trusted backend — provision users, send messages, manage channels",
    features: ["users.provision", "channels.create", "messages.send", "messages.list"],
  },
  {
    name: "@brenox/react",
    export: "BrenoxProvider + hooks",
    use: "React apps — live messages, notifications, call signaling",
    features: ["useMessages", "useChannel", "useNotifications", "useCallSignaling"],
  },
] as const
