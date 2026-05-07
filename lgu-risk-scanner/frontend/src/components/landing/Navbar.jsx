import { Link } from 'react-router-dom'
import logo from '../../assets/bantay-bayan-logo.svg'

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
    <header className="sticky top-0 z-50 bg-white/90 px-3 py-3 shadow-sm shadow-slate-200/70 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 rounded-xl border border-[#38BDF8]/25 bg-white/95 px-3 py-3 sm:gap-6 sm:px-5">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img
            src={logo}
            alt="Bantay Bayan logo"
            className="h-10 w-10 shrink-0 rounded-full object-cover shadow-md shadow-[#0F172A]/15 sm:h-11 sm:w-11"
          />
          <span className="min-w-0">
            <span className="block truncate text-lg font-extrabold tracking-tight text-[#0F172A] sm:text-xl">Bantay Bayan</span>
            <span className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB] sm:block">
              Public Risk Portal
            </span>
          </span>
        </Link>

        <nav className="order-3 flex w-full items-center gap-1 overflow-x-auto md:order-none md:w-auto md:overflow-visible">
          {links.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => scrollToSection(link.target)}
              className="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-[#1E293B]/75 transition-all duration-200 ease-out hover:bg-[#F8FAFC] hover:text-[#2563EB] hover:shadow-sm sm:px-4 md:text-base"
            >
              {link.label}
            </button>
          ))}
          <Link
            to="/dashboard"
            className="ml-auto shrink-0 rounded-lg bg-[#2563EB] px-3 py-2 text-sm font-black text-white transition hover:bg-[#0F172A] sm:px-4"
          >
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  )
}
