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

Install packages and copy \`.env.example\`. You need a sandbox key (\`bx_test_*\`) from the [Brenox console](https://www.breno-x.com/apps).

Run the embed API with \`npm run dev:server\` (loads \`.env\` via \`--env-file\`).`,
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
2. Creates a shared channel \`general\` in your app's workspace (idempotent on restart)
3. Persists \`workspace_id\` / \`channel_id\` to \`server/.demo-room.json\` so restarts reuse the same room

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

Your frontend stores the token in **\`sessionStorage\`** (one session per browser tab) and uses all realtime features — WebSocket, typing, presence, calls — without Brenox login forms.`,
    snippetKey: "sessionTokens",
    files: ["server/index.mjs"],
  },
  {
    id: "embed-launcher",
    number: 4,
    title: "Embed launcher UI",
    description: "Open chat as Alice or Bob — simulating two end users.",
    prose: `The launcher calls your backend \`POST /api/session\` with \`{ persona: "alice" | "bob" }\`. Your server maps personas to \`external_id\`, calls Brenox \`/v1/sessions\`, and returns the token.

Open **Alice** in one browser tab and **Bob** in another to try realtime chat — each tab keeps its own session via \`sessionStorage\`.

Vite proxies \`/api\` to the embed server during local dev. Keep \`npm run dev:server\` running in a second terminal.`,
    snippetKey: "embedLauncher",
    files: ["src/components/EmbedLauncher.tsx", "src/lib/embed-api.ts", "vite.config.ts"],
  },
  {
    id: "sdk-client",
    number: 5,
    title: "SDK client",
    description: "BrenoxClient + BrenoxProvider with the issued token.",
    prose: `Create a shared \`BrenoxClient\` with a per-tab \`sessionStorage\` token store. After your embed API returns a token, call \`client.setToken(token)\` then \`client.users.me()\` to load the end-user profile.

Wrap the tree in \`BrenoxProvider\`. The chat UI reads \`workspace_id\` and \`channel_id\` from the session response — no workspace picker needed in an embed flow.`,
    snippetKey: "sdkClient",
    files: ["src/brenox/client.ts", "src/App.tsx"],
  },
  {
    id: "channel-session",
    number: 6,
    title: "Shared channel session",
    description: "One WebSocket for chat, typing, and call signaling.",
    prose: `\`ChannelSessionProvider\` wraps the in-channel UI and uses \`useCallSignaling\` under the hood. Chat and calls share a **single** \`ChannelConnection\` — no duplicate WebSockets to the same room.

\`ChatPanel\` reads the connection via \`useChannelSession()\`. \`CallPanel\` uses the same signaling instance for \`call.offer\`, \`call.answer\`, and \`call.ice\` events.`,
    snippetKey: "channelSession",
    files: ["src/context/channel-session.tsx", "src/App.tsx"],
  },
  {
    id: "realtime-messaging",
    number: 7,
    title: "Realtime messaging",
    description: "REST history + WebSocket live delivery on one channel connection.",
    prose: `Load history with \`client.messages.list\` and subscribe to \`message.new\` / \`message.updated\` on the shared \`connection\`.

Send with \`connection.sendMessage(text)\` when connected, or fall back to REST \`client.messages.send\`. Show \`connectionState\` in the header so users know when live delivery is active.

Attachment metadata is fetched once per message (cached) to avoid rate-limit spikes during dev.`,
    snippetKey: "realtimeMessaging",
    files: ["src/components/ChatPanel.tsx"],
  },
  {
    id: "typing-presence",
    number: 8,
    title: "Typing & presence",
    description: "Typing indicators and live channel events.",
    prose: `Call \`connection.startTyping()\` / \`connection.stopTyping()\` only when \`connectionState === "connected"\` — the SDK throws if the WebSocket is not open.

Subscribe to \`typing.start\`, \`presence.*\`, and \`member.*\` on the same \`connection\` for a live activity feed. Debounce \`stopTyping\` ~1.5s after the last keystroke.`,
    snippetKey: "typingPresence",
    files: ["src/components/ChatPanel.tsx"],
  },
  {
    id: "voice-video-calls",
    number: 9,
    title: "Voice & video calls",
    description: "Call signaling + WebRTC mesh for Alice ↔ Bob.",
    prose: `Brenox provides **signaling only** (\`useCallSignaling\` + REST \`/calls\`). Your app owns \`RTCPeerConnection\`, \`getUserMedia\`, and STUN/TURN.

**Flow:**

1. Alice clicks **Start video** → \`initiate("video")\` via REST
2. Bob sees an incoming call banner → \`join(callId)\`
3. Peers exchange SDP/ICE over the channel WebSocket (\`call.offer\`, \`call.answer\`, \`call.ice\`)
4. Media flows P2P — configure \`VITE_ICE_SERVERS\` for TURN in production

\`useWebRtcCall\` in the demo wires signaling events to a 1:1 mesh. Allow mic/camera when prompted.`,
    snippetKey: "voiceVideoCalls",
    files: [
      "src/components/CallPanel.tsx",
      "src/hooks/useWebRtcCall.ts",
      "src/webrtc/peer-connection.ts",
    ],
  },
  {
    id: "notifications",
    number: 10,
    title: "Notifications",
    description: "In-app notifications with useNotifications.",
    prose: `\`useNotifications({ pollIntervalMs: 60_000 })\` loads the user's inbox. Combine with \`notification.new\` channel events for instant delivery (including \`call_invite\`).

Mark items read with \`markRead(id)\` or \`markAllRead()\`.`,
    snippetKey: "notifications",
    files: ["src/components/NotificationsPanel.tsx"],
  },
  {
    id: "attachments",
    number: 11,
    title: "Attachments",
    description: "Upload files and attach them to messages.",
    prose: `Upload via \`client.attachments.uploadFile\`, send the message over REST, then \`attachToMessage\`. List files with \`listByMessage\` for download links.

Presigned URLs are handled by Brenox — your app only uploads the file bytes.`,
    snippetKey: "attachments",
    files: ["src/components/ChatPanel.tsx"],
  },
  {
    id: "run-deploy",
    number: 12,
    title: "Run & deploy",
    description: "Local two-user test, troubleshooting, and production deployment.",
    prose: `**Local development (two terminals)**

| Terminal | Command | URL |
|----------|---------|-----|
| Embed API | \`npm run dev:server\` | \`http://localhost:3001\` |
| Chat UI | \`npm run dev\` | \`http://localhost:5173/demos/chat/\` |

Set \`BRENOX_API_KEY\` and \`BRENOX_API_URL=http://localhost:8080\` in \`.env\`.

**Try two users:** Alice in one tab, Bob in another — both land in \`#general\`. Try a video call: Alice starts, Bob joins.

**Engine dev settings** — add to \`brenox-engine/.env\` and restart the engine:

- \`WS_ALLOWED_ORIGINS\` must include **both** \`localhost:5173\` and \`127.0.0.1:5173\`
- Raise \`API_RATE_LIMIT_PER_MINUTE\` / \`HTTP_RATE_LIMIT_PER_IP\` if you hit 429 during dev

**Production:** host the static UI on your own domain and deploy the embed API (\`server/index.mjs\`) on your backend — it holds the API key and issues session tokens. This tutorial is not a hosted playground; clone the repo and run it locally.`,
    snippetKey: "runDeploy",
    files: ["README.md", "vite.config.ts", ".env.example"],
  },
]
