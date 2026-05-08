import { useEffect, useRef, useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

function DashboardLayout({ children, title, description }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const mainRef = useRef(null)

  useEffect(() => {
    const root = mainRef.current
    if (!root) return undefined

    const elements = root.querySelectorAll('.reveal-on-scroll')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '-6% 0px -6% 0px', threshold: 0.08 }
    )

    elements.forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(index * 70, 280)}ms`
      observer.observe(element)
    })

    return () => observer.disconnect()
  }, [children])

  return (
    <div className="landing-blue-spots min-h-screen overflow-x-hidden text-[#1E293B]">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen((current) => !current)} />

      <div className="pointer-events-none fixed left-[220px] top-12 h-72 w-72 rounded-full bg-[#38BDF8]/25 blur-3xl" />
      <div className="pointer-events-none fixed right-[-120px] top-28 h-96 w-96 rounded-full bg-[#2563EB]/15 blur-3xl" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-28 bg-gradient-to-b from-[#F8FAFC] to-transparent" />

      <div
        className={`flex min-h-screen min-w-0 flex-col transition-[margin] duration-300 ease-out ${
          isSidebarOpen ? 'lg:ml-80' : 'lg:ml-24'
        }`}
      >
        <Topbar title={title} description={description} isSidebarOpen={isSidebarOpen} />

        <main ref={mainRef} className="relative min-w-0 flex-1 bg-transparent px-3 py-4 pt-32 sm:px-5 sm:py-6 sm:pt-36 lg:px-6 lg:pt-32">
          <div className="relative mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
