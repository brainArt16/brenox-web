export type ChatSnippetKey =
  | "projectSetup"
  | "embedBackend"
  | "sessionTokens"
  | "embedLauncher"
  | "sdkClient"
  | "realtimeMessaging"
  | "typingPresence"
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
# Add your bx_test_* key from www.breno-x.com/apps → API Keys`,
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
  const channel = await server.channels.create({ name: "general" });
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
// → open chat UI with workspace_id + channel_id`,
  },
  sdkClient: {
    title: "BrenoxClient + provider",
    language: "typescript",
    code: `import { BrenoxClient, localStorageTokenStore } from "@brenox/sdk";
import { BrenoxProvider } from "@brenox/react";

export const brenoxClient = new BrenoxClient({
  baseUrl: import.meta.env.VITE_BRENOX_API_URL ?? "https://api.breno-x.com",
  tokenStore: localStorageTokenStore("brenox_demo_chat_token"),
});

export default function App() {
  return (
    <BrenoxProvider client={brenoxClient}>
      <DemoApp />
    </BrenoxProvider>
  );
}`,
  },
  realtimeMessaging: {
    title: "Single WebSocket + REST history",
    language: "typescript",
    code: `const { connection, connectionState, connect } = useChannel(
  workspaceId,
  channelId,
);

useEffect(() => { void connect(); }, [connect]);

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
  startTyping();
  window.setTimeout(() => {
    if (connection?.connectionState === "connected") stopTyping();
  }, 1500);
}`,
  },
  notifications: {
    title: "useNotifications",
    language: "typescript",
    code: `const { notifications, markRead, markAllRead } = useNotifications({
  pollIntervalMs: 30_000,
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
    title: "Run locally (two users)",
    language: "bash",
    code: `# Terminal 1 — embed API (needs BRENOX_API_KEY in .env)
npm run dev:server

# Terminal 2 — chat UI
npm run dev
# Open http://localhost:5173/demos/chat/
# → Alice in one window, Bob in incognito`,
  },
}

export function getChatSnippet(key: string): DemoSnippet | undefined {
  return CHAT_SNIPPETS[key as ChatSnippetKey]
}
