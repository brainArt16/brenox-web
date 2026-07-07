export type ChatSnippetKey =
  | "projectSetup"
  | "embedBackend"
  | "sessionTokens"
  | "embedLauncher"
  | "sdkClient"
  | "channelSession"
  | "realtimeMessaging"
  | "typingPresence"
  | "voiceVideoCalls"
  | "notifications"
  | "attachments"
  | "runDeploy"

export interface DemoSnippet {
  code: string
  language: string
  title?: string
}

export const CHAT_SNIPPETS: Record<ChatSnippetKey, DemoSnippet> = {
  projectSetup: {
    title: "Scaffold & install",
    language: "bash",
    code: `git clone https://github.com/brainArt16/brenox-demo-chat.git
cd brenox-demo-chat
npm install
cp .env.example .env
# Add bx_test_* key from www.breno-x.com/apps → API Keys

# Terminal 1 — embed API (loads .env automatically)
npm run dev:server

# Terminal 2 — chat UI
npm run dev`,
  },
  embedBackend: {
    title: "Bootstrap room with BrenoxServer",
    language: "typescript",
    code: `import { BrenoxServer } from "@brenox/sdk/server";

const server = new BrenoxServer({
  baseUrl: process.env.BRENOX_API_URL!,
  apiKey: process.env.BRENOX_API_KEY!,
});

async function ensureRoom() {
  await server.users.provision({ external_id: "demo-alice", username: "Alice" });
  await server.users.provision({ external_id: "demo-bob", username: "Bob" });
  const channel = await server.channels.create(
    { name: "general" },
    "demo-channel-general", // idempotency key
  );
  // Persist workspaceId + channelId to server/.demo-room.json
  return { workspaceId: channel.workspace_id, channelId: channel.id };
}`,
  },
  sessionTokens: {
    title: "Issue embed session (POST /v1/sessions)",
    language: "typescript",
    code: `// Your backend — never expose BRENOX_API_KEY to the browser
const session = await server.sessions.create({
  external_id: "demo-alice",
  channel_id: room.channelId,
});

// Return to your frontend:
// { token: session.token, workspace_id, channel_id, user: session.user }`,
  },
  embedLauncher: {
    title: "Frontend — open chat as an end user",
    language: "typescript",
    code: `// POST /api/session { persona: "alice" | "bob" }
const response = await fetch("/api/session", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ persona: "alice" }),
});
const { token, workspace_id, channel_id } = await response.json();

await client.setToken(token);
// → open chat UI with workspace_id + channel_id
// Use sessionStorage so Alice and Bob can run in separate tabs`,
  },
  sdkClient: {
    title: "BrenoxClient + per-tab session storage",
    language: "typescript",
    code: `import { BrenoxClient, type TokenStore } from "@brenox/sdk";
import { BrenoxProvider } from "@brenox/react";

function sessionStorageTokenStore(key: string): TokenStore {
  return {
    getToken: () => sessionStorage.getItem(key),
    setToken: (value) =>
      value ? sessionStorage.setItem(key, value) : sessionStorage.removeItem(key),
  };
}

export const brenoxClient = new BrenoxClient({
  baseUrl: import.meta.env.VITE_BRENOX_API_URL ?? "https://api.breno-x.com",
  tokenStore: sessionStorageTokenStore("brenox_demo_chat_token"),
});

export default function App() {
  return (
    <BrenoxProvider client={brenoxClient}>
      <DemoApp />
    </BrenoxProvider>
  );
}`,
  },
  channelSession: {
    title: "One WebSocket for chat + calls",
    language: "typescript",
    code: `import { useCallSignaling } from "@brenox/react";

export function ChannelSessionProvider({ workspaceId, channelId, children }) {
  const { signaling, connectionState, initiate, join, leave } = useCallSignaling(
    workspaceId,
    channelId,
    { autoConnect: true },
  );

  const connection = signaling?.channel ?? null;
  // ChatPanel + CallPanel share this connection
  return (
    <ChannelSessionContext.Provider
      value={{ connection, signaling, connectionState, initiate, join, leave }}
    >
      {children}
    </ChannelSessionContext.Provider>
  );
}`,
  },
  realtimeMessaging: {
    title: "Shared connection + REST history",
    language: "typescript",
    code: `const { connection, connectionState } = useChannelSession();

useEffect(() => {
  if (!connection) return;
  const off = connection.on("message.new", (event) => {
    setMessages((prev) => [...prev, toListItem(event.payload, channelId)]);
  });
  return () => off();
}, [connection, channelId]);

// Send when connected
if (connectionState === "connected") {
  connection.sendMessage(text);
}`,
  },
  typingPresence: {
    title: "Typing only when connected",
    language: "typescript",
    code: `function handleDraftChange(value: string) {
  setDraft(value);
  if (connectionState !== "connected") return;
  connection?.startTyping();
  window.setTimeout(() => {
    if (connection?.connectionState === "connected") connection.stopTyping();
  }, 1500);
}`,
  },
  voiceVideoCalls: {
    title: "Signaling + WebRTC mesh",
    language: "typescript",
    code: `const { signaling, initiate, join, leave } = useChannelSession();

// Alice starts a video call
const call = await initiate("video");
const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

// Bob joins when he receives call.join on the WebSocket
await join(call.id);

// Exchange SDP/ICE via signaling (you implement RTCPeerConnection)
signaling?.on("call.offer", async (event) => {
  // setRemoteDescription → createAnswer → sendAnswer
});
signaling?.sendOffer({ call_id: call.id, to_user_id: bobId, sdp: localSdp });

// Optional STUN/TURN — VITE_ICE_SERVERS in .env
const pc = new RTCPeerConnection({
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
});`,
  },
  notifications: {
    title: "useNotifications",
    language: "typescript",
    code: `const { notifications, markRead, markAllRead } = useNotifications({
  pollIntervalMs: 60_000,
});`,
  },
  attachments: {
    title: "Upload and attach",
    language: "typescript",
    code: `const uploaded = await client.attachments.uploadFile(file, {
  fileName: file.name,
  mimeType: file.type || "application/octet-stream",
});
const message = await client.messages.send(workspaceId, channelId, { content: text });
await client.attachments.attachToMessage(workspaceId, channelId, message.id, [uploaded]);`,
  },
  runDeploy: {
    title: "Run locally + allowed origins",
    language: "bash",
    code: `# Terminal 1 — embed API
npm run dev:server

# Terminal 2 — chat UI
npm run dev
# http://localhost:5173/demos/chat/
# Alice in tab 1, Bob in tab 2

# Developer console → Apps → your app → Allowed browser origins
http://localhost:5173
http://127.0.0.1:5173

# Optional: brenox-engine/.env rate limits during dev
API_RATE_LIMIT_PER_MINUTE=1000
HTTP_RATE_LIMIT_PER_IP=2000`,
  },
}

export function getChatSnippet(key: string): DemoSnippet | undefined {
  return CHAT_SNIPPETS[key as ChatSnippetKey]
}
