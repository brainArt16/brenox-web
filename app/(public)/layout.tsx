import type { ReactNode } from "react"
import { DocsPublicShell } from "@/components/docs/docs-public-shell"

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <DocsPublicShell>{children}</DocsPublicShell>
}
