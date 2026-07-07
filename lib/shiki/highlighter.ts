import { codeToHtml, getSingletonHighlighter } from "shiki/bundle/web"

const DUAL_THEMES = {
  light: "vitesse-light",
  dark: "vitesse-dark",
} as const

const SUPPORTED_LANGS = [
  "typescript",
  "tsx",
  "javascript",
  "python",
  "bash",
  "shell",
  "vue",
  "json",
  "text",
] as const

const LANG_ALIASES: Record<string, string> = {
  guide: "typescript",
  ts: "typescript",
  js: "javascript",
  jsx: "javascript",
  py: "python",
  sh: "bash",
  zsh: "bash",
  shellscript: "bash",
  vue: "vue",
  dart: "text",
  go: "text",
}

let highlighterReady: Promise<void> | null = null

function ensureHighlighter() {
  if (!highlighterReady) {
    highlighterReady = getSingletonHighlighter({
      themes: [DUAL_THEMES.light, DUAL_THEMES.dark],
      langs: [...SUPPORTED_LANGS],
    }).then(() => undefined)
  }
  return highlighterReady
}

export function normalizeHighlightLang(lang: string): string {
  const key = lang.trim().toLowerCase()
  const mapped = LANG_ALIASES[key] ?? key
  if ((SUPPORTED_LANGS as readonly string[]).includes(mapped)) return mapped
  return "typescript"
}

export async function highlightCode(code: string, lang: string): Promise<string> {
  await ensureHighlighter()
  const language = normalizeHighlightLang(lang)

  try {
    return await codeToHtml(code, {
      lang: language,
      themes: DUAL_THEMES,
      defaultColor: "light",
    })
  } catch {
    return await codeToHtml(code, {
      lang: "text",
      themes: DUAL_THEMES,
      defaultColor: "light",
    })
  }
}
