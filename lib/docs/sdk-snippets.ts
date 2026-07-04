import type { SdkDefinition } from "./sdk-registry"
import { getSdkById } from "./sdk-registry"
import type { SdkVersionDoc } from "./sdk-versions"

export const BRENOX_API_URL_PLACEHOLDER = "https://api.brenox.io"

/** Install lines for any Node package manager — pass pinned packages e.g. @brenox/sdk@0.4.0 */
export function formatInstallCommand(installPackages: string): string {
  return `# npm
npm install ${installPackages}

# pnpm
pnpm add ${installPackages}

# yarn
yarn add ${installPackages}`
}

export interface SdkSnippets {
  install: string
  env: string
  quickStart: string
  messaging: string
  attachments: string
  realtime: string
  calls: string
  callsNote: string
  server: string
  framework: string
  webhookVerify: string
}

function applyVersionInstall(
  snippets: SdkSnippets,
  version?: SdkVersionDoc,
): SdkSnippets {
  if (!version?.installPackages) return snippets
  return { ...snippets, install: formatInstallCommand(version.installPackages) }
}

function typescriptSnippets(apiUrl: string, version?: SdkVersionDoc): SdkSnippets {
  const base: SdkSnippets = {
    install: formatInstallCommand("@brenox/sdk"),
    env: `# Server-side (BrenoxServer)
BRENOX_API_KEY=bx_test_your_sandbox_key

# Optional
BRENOX_API_URL=${apiUrl}
NEXT_PUBLIC_BRENOX_API_URL=${apiUrl}`,
    quickStart: `import { BrenoxClient, localStorageTokenStore } from "@brenox/sdk";

const client = new BrenoxClient({
  baseUrl: process.env.NEXT_PUBLIC_BRENOX_API_URL ?? "${apiUrl}",
  tokenStore: localStorageTokenStore(),
});

await client.auth.login({ email: "user@example.com", password: "secret" });

const [workspace] = await client.workspaces.list();
const channel = await client.channels.create(workspace.id, { name: "general" });

await client.messages.send(workspace.id, channel.ID, {
  content: "Hello from my app!",
});`,
    messaging: `const messages = await client.messages.list(workspaceId, channelId, { limit: 50 });

await client.messages.send(workspaceId, channelId, {
  content: "Check this out",
  attachments: [uploadedFile],
});

await client.users.updateStatus({ status: "away" });`,
    attachments: `const uploaded = await client.attachments.uploadFile(file, {
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

await conn.connect();
conn.sendMessage("Hello realtime!");`,
    calls: `const signaling = client.callSignaling(workspaceId, channelId, {
  origin: window.location.origin,
});

await signaling.connect();
const call = await signaling.initiate("video");
signaling.sendOffer({ call_id: call.id, to_user_id: 2, sdp: localSdp });`,
    callsNote: `// SDK: signaling (SDP, ICE, join/leave)
// You: RTCPeerConnection, getUserMedia, STUN/TURN, call UI`,
    server: `import { BrenoxServer } from "@brenox/sdk/server";

const server = new BrenoxServer({
  baseUrl: process.env.BRENOX_API_URL ?? "${apiUrl}",
  apiKey: process.env.BRENOX_API_KEY!,
});

await server.users.provision({ external_id: "user-123", username: "alice" });
await server.messages.send({
  channel_id: 1,
  external_id: "user-123",
  content: "Ticket opened",
});`,
    framework: "",
    webhookVerify: `import crypto from "crypto";

export function verifyBrenoxWebhook(rawBody: string, signature: string, secret: string) {
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}`,
  }
  return applyVersionInstall(base, version)
}

function reactSnippets(apiUrl: string, version?: SdkVersionDoc): SdkSnippets {
  const base = typescriptSnippets(apiUrl, version)
  const merged: SdkSnippets = {
    ...base,
    install: formatInstallCommand("@brenox/react @brenox/sdk"),
    quickStart: `import { BrenoxClient } from "@brenox/sdk";
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
      <span>{connectionState}</span>
      {messages.map((m) => <p key={m.id}>{m.content}</p>)}
      <button onClick={() => sendMessage("Hi!")}>Send</button>
    </div>
  );
}`,
    messaging: `const { messages, sendMessage, loading } = useMessages(
  workspaceId,
  channelId,
  { channel: { origin: window.location.origin } },
);

await sendMessage("Hello from React!");`,
    realtime: `const { connectionState } = useMessages(workspaceId, channelId);

// Or low-level:
const { channel, sendMessage, startTyping } = useChannel(workspaceId, channelId);`,
    calls: `const { signaling, initiate, join, leave } = useCallSignaling(
  workspaceId,
  channelId,
);

const call = await initiate("video");
signaling?.on("call.offer", (e) => { /* WebRTC */ });`,
    framework: base.quickStart,
    server: "",
  }
  return applyVersionInstall(merged, version)
}

function comingSoonSnippets(sdk: SdkDefinition): Partial<SdkSnippets> {
  return {
    install: sdk.installCommand ?? `# ${sdk.packageName} — coming soon`,
    quickStart: `# ${sdk.name} SDK is on the roadmap.
# Planned package: ${sdk.packageName}
#
# ${sdk.description}
#
# Follow development: ${sdk.githubUrl ?? "https://github.com/brainArt16/brenox-sdk"}`,
  }
}

export function getSnippetsForSdk(
  sdkId: string,
  apiUrl = BRENOX_API_URL_PLACEHOLDER,
): SdkSnippets | Partial<SdkSnippets> {
  const sdk = getSdkById(sdkId)
  if (!sdk) return typescriptSnippets(apiUrl)
  return getSnippetsForSdkSafe(sdk, apiUrl)
}

export function getSnippetsForSdkSafe(
  sdk: SdkDefinition,
  apiUrl = BRENOX_API_URL_PLACEHOLDER,
  version?: SdkVersionDoc,
): SdkSnippets | Partial<SdkSnippets> {
  if (sdk.status === "coming_soon") return comingSoonSnippets(sdk)
  if (sdk.id === "react") return reactSnippets(apiUrl, version)
  return typescriptSnippets(apiUrl, version)
}
