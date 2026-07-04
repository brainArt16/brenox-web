/** Maps stack/framework labels to icons under /public/icons */
export const FRAMEWORK_ICONS: Record<string, string> = {
  "Next.js": "/icons/React.svg",
  Vite: "/icons/JavaScript.svg",
  CRA: "/icons/React.svg",
  "React Native Web": "/icons/React.svg",
  FastAPI: "/icons/FastAPI.svg",
  Django: "/icons/Django.svg",
  Flask: "/icons/Python.svg",
  "Vue 3": "/icons/Vue.js.svg",
  Nuxt: "/icons/Vue.js.svg",
  Vue: "/icons/Vue.js.svg",
  Expo: "/icons/React.svg",
  iOS: "/icons/Flutter.svg",
  Android: "/icons/Flutter.svg",
}

export function getFrameworkIcon(label: string): string | undefined {
  return FRAMEWORK_ICONS[label]
}
