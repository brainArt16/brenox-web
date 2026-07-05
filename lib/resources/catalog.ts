import { CHAT_DEMO_STEPS } from "./demos/chat/content"

export interface DemoStep {
  id: string
  number: number
  title: string
  description: string
  prose: string
  snippetKey: string
  files?: string[]
}

export interface DemoResource {
  id: string
  title: string
  description: string
  tags: string[]
  status: "live" | "coming-soon"
  sdkPackages: string[]
  githubUrl: string
  steps: DemoStep[]
}

export const RESOURCES_HUB_URL = "https://www.breno-x.com/resources"
export const CHAT_TUTORIAL_URL = "https://www.breno-x.com/resources/demos/chat"
export const CHAT_GITHUB_URL = "https://github.com/brainArt16/brenox-demo-chat"

export const chatDemo: DemoResource = {
  id: "chat",
  title: "Live Chat",
  description:
    "Embed-first chat demo: backend provisions users with BrenoxServer, frontend chats with BrenoxClient — messaging, voice/video calls, Alice & Bob in two tabs.",
  tags: ["React", "Embed", "WebRTC", "Realtime"],
  status: "live",
  sdkPackages: ["@brenox/react@0.1.3", "@brenox/sdk@0.1.3"],
  githubUrl: CHAT_GITHUB_URL,
  steps: CHAT_DEMO_STEPS,
}

export const DEMO_CATALOG: DemoResource[] = [chatDemo]

export function getDemoById(id: string): DemoResource | undefined {
  return DEMO_CATALOG.find((demo) => demo.id === id)
}

export function getLiveDemos(): DemoResource[] {
  return DEMO_CATALOG.filter((demo) => demo.status === "live")
}
