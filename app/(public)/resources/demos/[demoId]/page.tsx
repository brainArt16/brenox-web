import { notFound } from "next/navigation"
import { DemoTutorialView } from "@/components/resources/demo-tutorial-view"
import { getDemoById } from "@/lib/resources/catalog"

interface DemoTutorialPageProps {
  params: Promise<{ demoId: string }>
}

export default async function DemoTutorialPage({ params }: DemoTutorialPageProps) {
  const { demoId } = await params
  const demo = getDemoById(demoId)

  if (!demo) {
    notFound()
  }

  return <DemoTutorialView demo={demo} />
}
