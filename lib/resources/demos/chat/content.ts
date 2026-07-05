import type { DemoStep } from "../../catalog"

export const CHAT_DEMO_STEPS: DemoStep[] = [
  {
    id: "project-setup",
    number: 1,
    title: "Project setup",
    description: "Scaffold the app plus a small embed API server.",
    prose: `This demo mirrors how **your product** embeds Brenox: a **trusted backend** (API key) provisions users and issues session tokens; your **frontend** uses \`BrenoxClient\` with those tokens — end users never see a Brenox signup screen.

The repo has two surfaces:

- **\`server/\`** — Node embed API (\`BrenoxServer\`, sandbox API key)
- **\`src/\`** — Vite + React chat UI (\`BrenoxClient\` + \`@brenox/react\`)

Install packages and copy \`.env.example\`. You need a sandbox key (\`bx_test_*\`) from the [Brenox console](https://www.breno-x.com/apps).`,
    snippetKey: "projectSetup",
    files: ["package.json", ".env.example", "server/index.mjs"],
  },
  {
    id: "embed-backend",
    number: 2,
    title: "Embed backend",
    description: "Provision users and create a shared room with BrenoxServer.",
    prose: `Your backend uses \`BrenoxServer\` with an API key — **never** expose the key in the browser.

On first request, the demo server:

1. Provisions **Alice** and **Bob** via \`POST /v1/users\` (\`external_id\`)
2. Creates a shared channel \`general\` in your app's workspace
3. Caches \`workspace_id\` and \`channel_id\` for session handoff

This is the same flow you'd run when a customer signs up in your SaaS product.`,
    snippetKey: "embedBackend",
    files: ["server/index.mjs"],
  },
  {
    id: "session-tokens",
    number: 3,
    title: "Session tokens",
    description: "Issue user JWTs from your backend via POST /v1/sessions.",
    prose: `Provisioned users don't have passwords your app knows. Instead, your backend calls \`POST /v1/sessions\` with the user's \`external_id\` and optional \`channel_id\`.

Brenox returns a **user JWT** plus workspace/channel context. The SDK exposes this as \`server.sessions.create()\`.

Your frontend stores the token (e.g. \`localStorageTokenStore\`) and uses all realtime features — WebSocket, typing, presence — without Brenox login forms.`,
    snippetKey: "sessionTokens",
    files: ["server/index.mjs"],
  },
  {
    id: "embed-launcher",
    number: 4,
    title: "Embed launcher UI",
    description: "Open chat as Alice or Bob — simulating two end users.",
    prose: `The launcher calls your backend \`POST /api/session\` with \`{ persona: "alice" | "bob" }\`. Your server maps personas to \`external_id\`, calls Brenox \`/v1/sessions\`, and returns the token.

Open **Alice** in one browser and **Bob** in another (or incognito) to try realtime chat — no manual invites or curl commands.

Vite proxies \`/api\` to the embed server during local dev.`,
    snippetKey: "embedLauncher",
    files: ["src/components/EmbedLauncher.tsx", "src/lib/embed-api.ts", "vite.config.ts"],
  },
  {
    id: "sdk-client",
    number: 5,
    title: "SDK client",
    description: "BrenoxClient + BrenoxProvider with the issued token.",
    prose: `Create a shared \`BrenoxClient\` with \`localStorageTokenStore\`. After your embed API returns a token, call \`client.setToken(token)\` then \`client.users.me()\` to load the end-user profile.

Wrap the tree in \`BrenoxProvider\`. The chat UI reads \`workspace_id\` and \`channel_id\` from the session response — no workspace picker needed in an embed flow.`,
    snippetKey: "sdkClient",
    files: ["src/brenox/client.ts", "src/App.tsx"],
  },
  {
    id: "realtime-messaging",
    number: 6,
    title: "Realtime messaging",
    description: "REST history + WebSocket live delivery on one channel connection.",
    prose: `Use a single \`useChannel\` connection (call \`connect()\` on mount). Load history with \`client.messages.list\` and subscribe to \`message.new\` / \`message.updated\` on the same connection.

Send with \`connection.sendMessage(text)\` when connected, or fall back to REST \`client.messages.send\`. Show \`connectionState\` in the header so users know when live delivery is active.`,
    snippetKey: "realtimeMessaging",
    files: ["src/components/ChatPanel.tsx"],
  },
  {
    id: "typing-presence",
    number: 7,
    title: "Typing & presence",
    description: "Typing indicators and live channel events.",
    prose: `Call \`startTyping()\` / \`stopTyping()\` only when \`connectionState === "connected"\` — the SDK throws if the WebSocket is not open.

Subscribe to \`typing.start\`, \`presence.*\`, and \`member.*\` on the same \`connection\` for a live activity feed. Debounce \`stopTyping\` ~1.5s after the last keystroke.`,
    snippetKey: "typingPresence",
    files: ["src/components/ChatPanel.tsx"],
  },
  {
    id: "notifications",
    number: 8,
    title: "Notifications",
    description: "In-app notifications with useNotifications.",
    prose: `\`useNotifications({ pollIntervalMs: 30_000 })\` loads the user's inbox. Combine with \`notification.new\` channel events for instant delivery when someone mentions them.

Mark items read with \`markRead(id)\` or \`markAllRead()\`.`,
    snippetKey: "notifications",
    files: ["src/components/NotificationsPanel.tsx"],
  },
  {
    id: "attachments",
    number: 9,
    title: "Attachments",
    description: "Upload files and attach to messages.",
    prose: `Upload via \`client.attachments.uploadFile\`, send the message over REST, then \`attachToMessage\`. List files with \`listByMessage\` for download links.

Presigned URLs are handled by Brenox — your app only uploads the file bytes.`,
    snippetKey: "attachments",
    files: ["src/components/ChatPanel.tsx"],
  },
  {
    id: "run-deploy",
    number: 10,
    title: "Run & deploy",
    description: "Local two-user test and production deployment.",
    prose: `**Local development (two terminals)**

| Terminal | Command | URL |
|----------|---------|-----|
| Embed API | \`npm run dev:server\` | \`http://localhost:3001\` |
| Chat UI | \`npm run dev\` | \`http://localhost:5173/demos/chat/\` |

Set \`BRENOX_API_KEY\` and \`BRENOX_API_URL=http://localhost:8080\` in \`.env\`.

**Try two users:** open Alice in one window, Bob in incognito — both land in \`#general\` automatically.

**Production:** deploy the embed API on your backend; sync the static UI to \`breno-x.com/demos/chat\` with \`npm run sync:web-static\`.`,
    snippetKey: "runDeploy",
    files: ["README.md", "vite.config.ts"],
  },
]
