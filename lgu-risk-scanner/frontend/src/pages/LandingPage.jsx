import { useEffect } from 'react'
import AboutSection from '../components/landing/AboutSection'
import FeatureSection from '../components/landing/FeatureSection'
import HeroSection from '../components/landing/HeroSection'
import Navbar from '../components/landing/Navbar'

export default function LandingPage() {
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal-on-scroll')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          } else {
            entry.target.classList.remove('is-visible')
          }
        })
      },
      { rootMargin: '-8% 0px -8% 0px', threshold: 0.12 }
    )

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="landing-blue-spots min-h-screen scroll-smooth text-[#1E293B] antialiased">
      <Navbar />
      <main className="relative overflow-hidden">
        <div className="pointer-events-none fixed left-[-90px] top-12 h-72 w-72 rounded-full bg-[#38BDF8]/25 blur-3xl" />
        <div className="pointer-events-none fixed right-[-120px] top-28 h-96 w-96 rounded-full bg-[#2563EB]/15 blur-3xl" />
        <div className="pointer-events-none fixed inset-x-0 top-0 h-28 bg-gradient-to-b from-[#F8FAFC] to-transparent" />
        <HeroSection />
        <FeatureSection />
        <AboutSection />
      </main>
    </div>
  )
}
