import { Link } from 'react-router-dom'
import logo from '../../assets/bantay-bayan-logo.png'

const links = [
  { label: 'Home', target: 'home' },
  { label: 'Features', target: 'features' },
  { label: 'About', target: 'about' },
]

export default function Navbar() {
  const scrollToSection = (target) => {
    if (target === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      window.history.replaceState(null, '', '/')
      return
    }

    const element = document.getElementById(target)

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      window.history.replaceState(null, '', target === 'home' ? '/' : `#${target}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-transparent px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 rounded-full border border-[#38BDF8]/30 bg-gradient-to-r from-white/95 via-[#F8FAFC]/94 to-[#EFF6FF]/92 px-5 py-4 shadow-xl shadow-[#2563EB]/10 backdrop-blur-xl sm:px-7 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Bantay Bayan logo"
            className="h-12 w-12 object-contain drop-shadow-md"
          />
          <span>
            <span className="block text-xl font-extrabold tracking-tight text-[#0F172A]">Bantay Bayan</span>
            <span className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB] sm:block">
              Public Risk Portal
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => scrollToSection(link.target)}
              className="rounded-full px-4 py-2 text-base font-semibold text-[#1E293B]/75 transition-all duration-200 ease-out hover:bg-[#F8FAFC] hover:text-[#2563EB] hover:shadow-sm"
            >
              {link.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
