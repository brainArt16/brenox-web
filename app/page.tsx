import { LandingNav } from "@/components/landing/nav"
import {
  HeroSection,
  FeaturesSection,
  DeveloperSection,
  PricingSection,
  CTASection,
  Footer,
} from "@/components/landing/sections"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <main>
        <HeroSection />
        <FeaturesSection />
        <DeveloperSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
