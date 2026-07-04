import dynamic from "next/dynamic"
import { Suspense } from "react"
import { LandingNav } from "@/components/landing/nav"
import { HeroSection } from "@/components/landing/hero-section"

const LandingBelowFold = dynamic(
  () => import("@/components/landing/below-fold").then((mod) => mod.LandingBelowFold),
  { loading: () => <div className="min-h-[40vh]" aria-hidden /> }
)

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <main>
        <HeroSection />
        <Suspense fallback={<div className="min-h-[40vh]" aria-hidden />}>
          <LandingBelowFold />
        </Suspense>
      </main>
    </div>
  )
}
