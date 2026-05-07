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
        <HeroSection />
        <FeatureSection />
        <AboutSection />
      </main>
    </div>
  )
}
