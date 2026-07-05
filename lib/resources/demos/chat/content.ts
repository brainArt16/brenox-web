import type { DemoStep } from "../../catalog"

export const CHAT_DEMO_STEPS: DemoStep[] = [
  {
    id: "project-setup",
    number: 1,
    title: "Project setup",
    description: "Scaffold Vite + React and install Brenox packages.",
    prose: `Start with a fresh Vite React TypeScript app. Install \`@brenox/sdk@0.1.2\` and \`@brenox/react@0.1.2\` — the same versions used in the live demo.

Add a \`.env\` file with \`VITE_BRENOX_API_URL\`. For production demos this defaults to \`https://api.breno-x.com\`. When running against a local Brenox engine, set \`VITE_BRENOX_API_URL=http://localhost:8080\`.

The finished app lives in the [brenox-demo-chat](https://github.com/brainArt16/brenox-demo-chat) repo on GitHub. This tutorial walks through the same code step by step.`,
    snippetKey: "projectSetup",
    files: ["package.json", ".env.example", "vite.config.ts"],
  },
  {
    id: "sdk-client",
    number: 2,
    title: "SDK client",
    description: "Configure BrenoxClient and wrap the app with BrenoxProvider.",
    prose: `Create a single shared \`BrenoxClient\` instance with \`localStorageTokenStore\` so user sessions persist across page reloads. Use a custom storage key (e.g. \`brenox_demo_chat_token\`) if you run multiple Brenox apps on the same origin.

Wrap your React tree in \`BrenoxProvider\` and access the client anywhere with \`useBrenoxClient()\`. No prop drilling required.`,
    snippetKey: "sdkClient",
    files: ["src/brenox/client.ts", "src/App.tsx"],
  },
  {
    id: "authentication",
    number: 3,
    title: "Authentication",
    description: "Register, login, restore sessions, and handle BrenoxError.",
    prose: `Build a login/register form that calls \`client.auth.register\` and \`client.auth.login\`. On app boot, check \`client.getToken()\` — if a token exists, call \`client.users.me()\` to restore the session.

Always catch \`BrenoxError\` for API failures. The SDK exposes \`error.body?.error\` for server messages. Clear stale tokens with \`client.auth.logout()\` when session restore fails.`,
    snippetKey: "authentication",
    files: ["src/components/AuthForm.tsx", "src/utils/errors.ts", "src/App.tsx"],
  },
  {
    id: "workspaces",
    number: 4,
    title: "Workspaces",
    description: "List and create workspaces for the signed-in user.",
    prose: `Workspaces are the top-level container for channels and messages. Call \`client.workspaces.list()\` on load to populate a sidebar picker. Let users create new workspaces with \`client.workspaces.create({ name })\`.

Use \`client.workspaces.get(id)\` when you need full workspace metadata (slug, owner, etc.).`,
    snippetKey: "workspaces",
    files: ["src/components/WorkspaceSidebar.tsx"],
  },
  {
    id: "channels",
    number: 5,
    title: "Channels",
    description: "Create channels and join before messaging.",
    prose: `Within a workspace, list channels with \`client.channels.list(workspaceId)\`. Create new ones via \`client.channels.create(workspaceId, { name })\`.

Some flows require explicitly joining a channel with \`client.channels.join(workspaceId, channelId)\` before sending messages. Track the selected workspace and channel in React state and pass IDs down to chat components.`,
    snippetKey: "channels",
    files: ["src/components/WorkspaceSidebar.tsx"],
  },
  {
    id: "realtime-messaging",
    number: 6,
    title: "Realtime messaging",
    description: "History, send, and live message.new delivery via useMessages.",
    prose: `\`useMessages(workspaceId, channelId)\` loads message history over REST and subscribes to live \`message.new\` events over WebSocket. Use \`sendMessage(text)\` to publish and \`refresh()\` to re-fetch history.

The hook exposes \`connectionState\` so you can show connected / reconnecting status in the UI header.`,
    snippetKey: "realtimeMessaging",
    files: ["src/components/ChatPanel.tsx"],
  },
  {
    id: "typing-presence",
    number: 7,
    title: "Typing & presence",
    description: "Typing indicators and presence/member events via useChannel.",
    prose: `\`useChannel(workspaceId, channelId)\` returns a channel \`connection\` plus \`startTyping\` / \`stopTyping\` helpers. Subscribe to \`typing.start\`, \`typing.stop\`, \`presence.*\`, and \`member.*\` events for live activity feeds.

Debounce \`stopTyping\` (e.g. 1.5s after the last keystroke) to avoid flooding the server while the user is composing.`,
    snippetKey: "typingPresence",
    files: ["src/components/ChatPanel.tsx"],
  },
  {
    id: "notifications",
    number: 8,
    title: "Notifications",
    description: "Poll and mark notifications read with useNotifications.",
    prose: `\`useNotifications({ pollIntervalMs: 30_000 })\` fetches the user's notification inbox and optionally polls for updates. Call \`markRead(id)\` or \`markAllRead()\` to clear unread items.

The demo renders a side panel; in production you might combine this with \`notification.new\` channel events for instant delivery.`,
    snippetKey: "notifications",
    files: ["src/components/NotificationsPanel.tsx"],
  },
  {
    id: "attachments",
    number: 9,
    title: "Attachments",
    description: "Upload files and attach them to messages.",
    prose: `Upload with \`client.attachments.uploadFile(file, { fileName, mimeType })\` before or after sending a message. Link files to a message via \`client.attachments.attachToMessage(workspaceId, channelId, messageId, [uploaded])\`.

List attachments for display with \`client.attachments.listByMessage(...)\`. The demo supports optional file picks in the composer alongside text.`,
    snippetKey: "attachments",
    files: ["src/components/ChatPanel.tsx"],
  },
  {
    id: "run-deploy",
    number: 10,
    title: "Run & deploy",
    description: "Local dev, production build, and subpath deployment.",
    prose: `**Local development**

| Surface | URL |
|---------|-----|
| Tutorial (this page) | \`http://localhost:3000/resources/demos/chat\` |
| Live demo app | \`http://localhost:5173\` with \`VITE_BRENOX_API_URL=http://localhost:8080\` |

**Production**

| Surface | URL |
|---------|-----|
| Resources hub | [breno-x.com/resources](https://www.breno-x.com/resources) |
| This tutorial | [breno-x.com/resources/demos/chat](https://www.breno-x.com/resources/demos/chat) |
| Live demo | [breno-x.com/demos/chat](https://www.breno-x.com/demos/chat) |
| Source on GitHub | [github.com/brainArt16/brenox-demo-chat](https://github.com/brainArt16/brenox-demo-chat) |

Set \`base: "/demos/chat/"\` in \`vite.config.ts\` so asset paths resolve when the app is served under a subpath. Build with \`npm run build\` and deploy \`dist/\` behind your reverse proxy.`,
    snippetKey: "runDeploy",
    files: ["vite.config.ts", "README.md"],
  },
]
