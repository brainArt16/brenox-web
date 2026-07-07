/** Shared doc section ids — filter per SDK in the registry. */
export const ALL_DOC_SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "sdks", label: "Choose your SDK" },
  { id: "quickstart", label: "Quick start" },
  { id: "console", label: "Console setup" },
  { id: "browser-origins", label: "Browser origins" },
  { id: "auth", label: "Authentication" },
  { id: "messaging", label: "Messaging" },
  { id: "realtime", label: "Realtime" },
  { id: "calls", label: "Voice & video" },
  { id: "server", label: "Server SDK" },
  { id: "framework", label: "Framework hooks" },
  { id: "webhooks", label: "Webhooks" },
  { id: "best-practices", label: "Best practices" },
] as const

export type DocSectionId = (typeof ALL_DOC_SECTIONS)[number]["id"]

export type SdkCategory = "language" | "framework" | "mobile"
export type SdkStatus = "available" | "beta" | "coming_soon"
export type SdkRole = "client" | "server" | "fullstack" | "framework"

export interface SdkDefinition {
  id: string
  name: string
  /** e.g. TypeScript */
  language: string
  category: SdkCategory
  role: SdkRole
  status: SdkStatus
  packageName: string
  description: string
  installCommand?: string
  githubUrl?: string
  npmUrl?: string
  /** Path under /public/icons for SDK branding */
  icon?: string
  /** Human-readable: what this SDK is best for */
  bestFor: string[]
  /** Feature keys for the comparison matrix */
  features: SdkFeatureKey[]
  /** Which doc sections to render when this SDK is selected */
  sections: DocSectionId[]
  codeLanguage: string
  /** Optional note shown on the SDK card */
  note?: string
}

export type SdkFeatureKey =
  | "auth"
  | "messaging"
  | "realtime"
  | "presence"
  | "attachments"
  | "notifications"
  | "calls"
  | "server"
  | "hooks"

export const SDK_FEATURE_LABELS: Record<SdkFeatureKey, string> = {
  auth: "Auth",
  messaging: "Messaging",
  realtime: "Realtime",
  presence: "Presence",
  attachments: "Files",
  notifications: "Notifications",
  calls: "Calls",
  server: "Server SDK",
  hooks: "UI hooks",
}

export const SDK_CATEGORIES: { id: SdkCategory; label: string; description: string }[] = [
  {
    id: "language",
    label: "Languages",
    description: "Core client & server libraries",
  },
  {
    id: "framework",
    label: "Frameworks",
    description: "Opinionated wrappers for popular stacks",
  },
  {
    id: "mobile",
    label: "Mobile",
    description: "Native and cross-platform apps",
  },
]

const TS_SECTIONS: DocSectionId[] = [
  "overview",
  "sdks",
  "quickstart",
  "console",
  "browser-origins",
  "auth",
  "messaging",
  "realtime",
  "calls",
  "server",
  "webhooks",
  "best-practices",
]

const REACT_SECTIONS: DocSectionId[] = [
  "overview",
  "sdks",
  "quickstart",
  "console",
  "browser-origins",
  "auth",
  "messaging",
  "realtime",
  "calls",
  "framework",
  "webhooks",
  "best-practices",
]

const COMING_SOON_SECTIONS: DocSectionId[] = [
  "overview",
  "sdks",
  "quickstart",
  "console",
  "webhooks",
  "best-practices",
]

/** Master catalog — add new SDKs here as they ship. */
export const SDK_REGISTRY: SdkDefinition[] = [
  {
    id: "typescript",
    name: "TypeScript",
    language: "TypeScript",
    category: "language",
    role: "fullstack",
    status: "available",
    packageName: "@brenox/sdk",
    icon: "/icons/TypeScript.svg",
    description: "Core SDK for browsers, Node.js, and server-side automation.",
    installCommand: "npm install @brenox/sdk",
    githubUrl: "https://github.com/brainArt16/brenox-sdk",
    npmUrl: "https://www.npmjs.com/package/@brenox/sdk",
    bestFor: ["Web apps", "Node backends", "Electron", "Any JS runtime"],
    features: [
      "auth",
      "messaging",
      "realtime",
      "presence",
      "attachments",
      "notifications",
      "calls",
      "server",
    ],
    sections: TS_SECTIONS,
    codeLanguage: "typescript",
  },
  {
    id: "react",
    name: "React",
    language: "React",
    category: "framework",
    role: "framework",
    status: "available",
    packageName: "@brenox/react",
    icon: "/icons/React.svg",
    description: "Hooks and provider for React — live messages, notifications, and call signaling.",
    installCommand: "npm install @brenox/react @brenox/sdk",
    githubUrl: "https://github.com/brainArt16/brenox-sdk/tree/main/react",
    npmUrl: "https://www.npmjs.com/package/@brenox/react",
    bestFor: ["Next.js", "Vite", "CRA", "React Native Web"],
    features: [
      "auth",
      "messaging",
      "realtime",
      "presence",
      "notifications",
      "calls",
      "hooks",
    ],
    sections: REACT_SECTIONS,
    codeLanguage: "tsx",
    note: "Built on @brenox/sdk",
  },
  {
    id: "python",
    name: "Python",
    language: "Python",
    category: "language",
    role: "fullstack",
    status: "coming_soon",
    packageName: "brenox-sdk",
    icon: "/icons/Python.svg",
    description: "Python client and server library for Django, FastAPI, Flask, and scripts.",
    installCommand: "pip install brenox-sdk",
    bestFor: ["FastAPI", "Django", "Backend services", "Data pipelines"],
    features: ["auth", "messaging", "server", "notifications"],
    sections: COMING_SOON_SECTIONS,
    codeLanguage: "python",
  },
  {
    id: "go",
    name: "Go",
    language: "Go",
    category: "language",
    role: "server",
    status: "coming_soon",
    packageName: "github.com/brenox/brenox-go",
    icon: "/icons/Go.svg",
    description: "Idiomatic Go SDK for high-throughput backend integrations.",
    installCommand: "go get github.com/brenox/brenox-go",
    bestFor: ["Microservices", "CLI tools", "Cloud functions"],
    features: ["server", "messaging", "notifications"],
    sections: COMING_SOON_SECTIONS,
    codeLanguage: "go",
  },
  {
    id: "flutter",
    name: "Flutter",
    language: "Dart",
    category: "mobile",
    role: "client",
    status: "coming_soon",
    packageName: "brenox_sdk",
    icon: "/icons/Dart.svg",
    description: "Cross-platform mobile SDK for iOS and Android chat apps.",
    installCommand: "flutter pub add brenox_sdk",
    bestFor: ["iOS", "Android", "Cross-platform mobile"],
    features: ["auth", "messaging", "realtime", "presence", "calls", "notifications"],
    sections: COMING_SOON_SECTIONS,
    codeLanguage: "dart",
  },
  {
    id: "vue",
    name: "Vue",
    language: "Vue 3",
    category: "framework",
    role: "framework",
    status: "coming_soon",
    packageName: "@brenox/vue",
    icon: "/icons/Vue.js.svg",
    description: "Composables and plugin for Vue 3 and Nuxt.",
    installCommand: "npm install @brenox/vue @brenox/sdk",
    bestFor: ["Vue 3", "Nuxt", "Vite"],
    features: ["auth", "messaging", "realtime", "calls", "hooks"],
    sections: COMING_SOON_SECTIONS,
    codeLanguage: "vue",
    note: "Will build on @brenox/sdk",
  },
  {
    id: "react-native",
    name: "React Native",
    language: "React Native",
    category: "mobile",
    role: "framework",
    status: "coming_soon",
    packageName: "@brenox/react-native",
    icon: "/icons/React.svg",
    description: "Native mobile hooks with secure token storage and background reconnect.",
    installCommand: "npm install @brenox/react-native @brenox/sdk",
    bestFor: ["iOS", "Android", "Expo"],
    features: ["auth", "messaging", "realtime", "presence", "calls", "hooks"],
    sections: COMING_SOON_SECTIONS,
    codeLanguage: "tsx",
    note: "Will build on @brenox/sdk",
  },
]

export const DEFAULT_SDK_ID = "typescript"

export function getSdkById(id: string): SdkDefinition | undefined {
  return SDK_REGISTRY.find((s) => s.id === id)
}

export function getSdkOrDefault(id: string | null): SdkDefinition {
  return getSdkById(id ?? "") ?? SDK_REGISTRY[0]
}

export function getDocSectionsForSdk(sdkId: string): typeof ALL_DOC_SECTIONS {
  const sdk = getSdkOrDefault(sdkId)
  return ALL_DOC_SECTIONS.filter((s) => sdk.sections.includes(s.id)) as unknown as typeof ALL_DOC_SECTIONS
}

export function getAvailableSdks(): SdkDefinition[] {
  return SDK_REGISTRY.filter((s) => s.status === "available" || s.status === "beta")
}

export function getSdksByCategory(category: SdkCategory): SdkDefinition[] {
  return SDK_REGISTRY.filter((s) => s.category === category)
}

/** @deprecated use getDocSectionsForSdk — kept for sidebar compat */
export const DOC_SECTIONS = ALL_DOC_SECTIONS
