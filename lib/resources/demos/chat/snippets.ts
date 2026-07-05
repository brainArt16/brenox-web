export type ChatSnippetKey =
  | "projectSetup"
  | "sdkClient"
  | "authentication"
  | "workspaces"
  | "channels"
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
    code: `# Create the app
npm create vite@latest brenox-demo-chat -- --template react-ts
cd brenox-demo-chat

# Install Brenox packages (pinned to 0.1.2)
npm install @brenox/sdk@0.1.2 @brenox/react@0.1.2

# Tailwind (optional — demo uses Tailwind v4)
npm install tailwindcss @tailwindcss/vite

# .env.example
echo 'VITE_BRENOX_API_URL=https://api.breno-x.com' > .env.example
cp .env.example .env`,
  },
  sdkClient: {
    title: "BrenoxClient + provider",
    language: "typescript",
    code: `// src/brenox/client.ts
import { BrenoxClient, localStorageTokenStore } from "@brenox/sdk";

export const DEMO_TOKEN_KEY = "brenox_demo_chat_token";

export const brenoxClient = new BrenoxClient({
  baseUrl: import.meta.env.VITE_BRENOX_API_URL ?? "https://api.breno-x.com",
  tokenStore: localStorageTokenStore(DEMO_TOKEN_KEY),
});

// src/App.tsx
import { BrenoxProvider } from "@brenox/react";
import { brenoxClient } from "./brenox/client";

export default function App() {
  return (
    <BrenoxProvider client={brenoxClient}>
      <DemoApp />
    </BrenoxProvider>
  );
}`,
  },
  authentication: {
    title: "Register, login, and session restore",
    language: "typescript",
    code: `import { BrenoxError } from "@brenox/sdk";
import { useBrenoxClient } from "@brenox/react";

function formatError(error: unknown): string {
  if (error instanceof BrenoxError) {
    return error.body?.error ?? error.message;
  }
  if (error instanceof Error) return error.message;
  return String(error);
}

// AuthForm — register then login, or login directly
async function handleSubmit() {
  try {
    if (mode === "register") {
      await client.auth.register({ email, username, password });
      await client.auth.login({ email, password });
    } else {
      await client.auth.login({ email, password });
    }
    onAuthenticated();
  } catch (err) {
    setError(formatError(err));
  }
}

// App boot — restore session from token store
const token = await client.getToken();
if (token) {
  const profile = await client.users.me();
  setUser(profile);
}`,
  },
  workspaces: {
    title: "List and create workspaces",
    language: "typescript",
    code: `import { useBrenoxClient } from "@brenox/react";

const client = useBrenoxClient();

// List workspaces the user belongs to
const workspaces = await client.workspaces.list();
setWorkspaces(workspaces);

// Create a new workspace
const workspace = await client.workspaces.create({
  name: workspaceName.trim(),
});
onWorkspaceChange(workspace.id);

// Fetch full workspace details
const details = await client.workspaces.get(workspaceId);`,
  },
  channels: {
    title: "Create and join channels",
    language: "typescript",
    code: `const client = useBrenoxClient();

// List channels in a workspace
const channels = await client.channels.list(workspaceId);
setChannels(channels);

// Create a channel
const channel = await client.channels.create(workspaceId, {
  name: channelName.trim(),
});
onChannelChange(channel.ID);

// Join an existing channel (required before messaging in some setups)
await client.channels.join(workspaceId, channelId);`,
  },
  realtimeMessaging: {
    title: "useMessages — history, send, live delivery",
    language: "typescript",
    code: `import { useMessages } from "@brenox/react";

function ChatPanel({ workspaceId, channelId }: Props) {
  const {
    messages,
    loading,
    error,
    connectionState,
    sendMessage,
    refresh,
  } = useMessages(workspaceId, channelId);

  async function handleSend(text: string) {
    await sendMessage(text);
  }

  return (
    <div>
      <p>WebSocket: {connectionState}</p>
      {messages.map((message) => (
        <div key={message.id}>
          <strong>{message.username}</strong>: {message.content}
        </div>
      ))}
      <button type="button" onClick={() => void refresh()}>
        Refresh
      </button>
    </div>
  );
}`,
  },
  typingPresence: {
    title: "useChannel — typing & presence events",
    language: "typescript",
    code: `import { useChannel } from "@brenox/react";

const { connection, startTyping, stopTyping } = useChannel(
  workspaceId,
  channelId,
);

useEffect(() => {
  if (!connection) return;

  const unsubs = [
    connection.on("typing.start", (event) => {
      const userId = (event.payload as { user_id: number }).user_id;
      setTypingUsers((prev) => new Set(prev).add(userId));
    }),
    connection.on("typing.stop", (event) => {
      const userId = (event.payload as { user_id: number }).user_id;
      setTypingUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }),
    connection.on("presence.online", (event) => {
      console.log("presence online", event.payload);
    }),
    connection.on("member.joined", (event) => {
      console.log("member joined", event.payload);
    }),
  ];

  return () => unsubs.forEach((off) => off());
}, [connection]);

function handleDraftChange(value: string) {
  setDraft(value);
  startTyping();
  window.setTimeout(() => stopTyping(), 1500);
}`,
  },
  notifications: {
    title: "useNotifications — list and mark read",
    language: "typescript",
    code: `import { useNotifications } from "@brenox/react";

function NotificationsPanel() {
  const {
    notifications,
    loading,
    error,
    refresh,
    markRead,
    markAllRead,
  } = useNotifications({ pollIntervalMs: 30_000 });

  return (
    <aside>
      <button type="button" onClick={() => void refresh()}>Refresh</button>
      <button type="button" onClick={() => void markAllRead()}>
        Mark all read
      </button>
      <ul>
        {notifications.map((item) => (
          <li key={item.id} className={item.read ? "opacity-70" : ""}>
            <p>{item.title}</p>
            {!item.read && (
              <button type="button" onClick={() => void markRead(item.id)}>
                Read
              </button>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}`,
  },
  attachments: {
    title: "Upload, attach, and list files",
    language: "typescript",
    code: `const client = useBrenoxClient();

// Upload a file before sending
const uploaded = await client.attachments.uploadFile(pendingFile, {
  fileName: pendingFile.name,
  mimeType: pendingFile.type || "application/octet-stream",
});

// Send message then attach
const message = await client.messages.send(workspaceId, channelId, {
  content: text || \`(attachment: \${uploaded.file_name})\`,
});

const attached = await client.attachments.attachToMessage(
  workspaceId,
  channelId,
  message.id,
  [uploaded],
);

// Load attachments for existing messages
const items = await client.attachments.listByMessage(
  workspaceId,
  channelId,
  messageId,
);`,
  },
  runDeploy: {
    title: "Dev, build, and deploy",
    language: "bash",
    code: `# Local development (demo app)
npm run dev
# → http://localhost:5173
# Point at local API: VITE_BRENOX_API_URL=http://localhost:8080

# Production build (subpath deploy)
# vite.config.ts → base: "/demos/chat/"
npm run build

# Deploy dist/ to www.breno-x.com/demos/chat/
# Tutorial lives at www.breno-x.com/resources/demos/chat`,
  },
}

export function getChatSnippet(key: string): DemoSnippet | undefined {
  return CHAT_SNIPPETS[key as ChatSnippetKey]
}
