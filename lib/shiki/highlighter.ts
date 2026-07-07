import { codeToHtml, getSingletonHighlighter } from "shiki/bundle/web"

const SHIKI_THEMES = {
  dark: "github-dark",
  light: "github-light",
} as const

export type HighlightTheme = keyof typeof SHIKI_THEMES

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
      themes: [SHIKI_THEMES.dark, SHIKI_THEMES.light],
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

export async function highlightCode(
  code: string,
  lang: string,
  theme: HighlightTheme = "dark",
): Promise<string> {
  await ensureHighlighter()
  const language = normalizeHighlightLang(lang)
  const shikiTheme = SHIKI_THEMES[theme]

  try {
    return await codeToHtml(code, { lang: language, theme: shikiTheme })
  } catch {
    return await codeToHtml(code, { lang: "text", theme: shikiTheme })
  }
}
