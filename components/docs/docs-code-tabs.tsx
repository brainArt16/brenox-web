"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeSnippet } from "@/components/shared/code-snippet"

export interface DocsCodeTab {
  id: string
  label: string
  code: string
  language?: string
}

interface DocsCodeTabsProps {
  tabs: DocsCodeTab[]
  language?: string
}

export function DocsCodeTabs({ tabs, language = "typescript" }: DocsCodeTabsProps) {
  return (
    <Tabs defaultValue={tabs[0]?.id} className="w-full">
      <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-surface p-1">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="text-xs data-[state=active]:bg-card"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-3">
          <CodeSnippet code={tab.code} language={tab.language ?? language} />
        </TabsContent>
      ))}
    </Tabs>
  )
}
