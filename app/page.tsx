import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import Hero from "@/components/landing/Hero"
import Features from "@/components/landing/Features"
import Levels from "@/components/landing/Levels"
import HowItWorks from "@/components/landing/HowItWorks"
import Teachers from "@/components/landing/Teachers"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Levels />
        <HowItWorks />
        <Teachers />
      </main>
      <Footer />
    </div>
  )
}
