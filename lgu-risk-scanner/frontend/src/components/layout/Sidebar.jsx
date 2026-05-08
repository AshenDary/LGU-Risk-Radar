import { Link, NavLink } from 'react-router-dom'
import logo from '../../assets/sidebar-risk-radar-logo.svg'

export const appLinks = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Analysis', path: '/analysis' },
  { name: 'LGU Ranking', path: '/lgu-ranking' },
  { name: 'Audit Explorer', path: '/audit-explorer' },
  { name: 'Compare LGUs', path: '/compare' },
  { name: 'What-If Simulator', path: '/simulator' },
  { name: 'Reports', path: '/reports' },
]

function MenuIcon() {
  return (
    <span className="flex h-6 w-6 flex-col items-center justify-center gap-1.5" aria-hidden="true">
      <span className="block h-0.5 w-5 shrink-0 rounded-full bg-current" />
      <span className="block h-0.5 w-5 shrink-0 rounded-full bg-current" />
      <span className="block h-0.5 w-5 shrink-0 rounded-full bg-current" />
    </span>
  )
}

export default function Sidebar({ isOpen, onToggle }) {
  return (
    <aside
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
      onClick={onToggle}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onToggle()
        }
      }}
      className={`fixed z-50 shrink-0 cursor-pointer overflow-hidden rounded-[2rem] border border-[#38BDF8]/25 bg-gradient-to-br from-[#102033] via-[#1D4ED8] to-[#0EA5E9] text-white shadow-2xl shadow-[#0F172A]/15 outline-none transition-[width,height,padding,box-shadow,transform,left,top] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-4 focus-visible:ring-[#38BDF8]/30 ${
        isOpen
          ? 'left-6 top-6 h-[calc(100vh-3rem)] w-64 max-w-[calc(100vw-3rem)] px-5 py-7 sm:left-8 sm:top-8 sm:h-[calc(100vh-4rem)]'
          : 'left-6 top-2 flex h-16 w-16 items-center justify-center p-0 hover:scale-[1.03] sm:left-8 sm:top-4'
      }`}
    >
      <div
        className={`pointer-events-none absolute left-1/2 top-1/2 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center text-white transition-all duration-300 ${
          isOpen ? 'scale-75 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <MenuIcon />
      </div>

      <div
        className={`flex h-full flex-col transition-all duration-300 ${
          isOpen
            ? 'translate-y-0 opacity-100 delay-150'
            : 'pointer-events-none -translate-y-2 opacity-0'
        }`}
      >
        <div className="mb-7 border-b border-white/10 px-1 pb-5 pt-1">
          <div className="flex items-center gap-3.5">
            <img
              src={logo}
              alt="Bantay Bayan logo"
              className="h-10 w-10 object-contain drop-shadow-md"
            />
            <div className="min-w-0 flex-1 text-center">
              <h1 className="text-[1.45rem] font-black leading-none tracking-tight text-white drop-shadow-sm">
                Bantay Bayan
              </h1>
              <p className="mt-1.5 whitespace-nowrap text-[0.62rem] font-bold uppercase tracking-[0.16em] text-sky-100/85">
                Public Risk Portal
              </p>
            </div>
          </div>
        </div>

        <nav className="space-y-1.5 px-1">
          {appLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={(event) => event.stopPropagation()}
              className={({ isActive }) =>
                `block rounded-full px-3.5 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                  isActive
                    ? 'bg-white text-[#0F172A] shadow-lg shadow-[#0F172A]/15'
                    : 'text-white/85 hover:bg-white/15 hover:text-white'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/"
          onClick={(event) => event.stopPropagation()}
          className="mx-1 mb-1 mt-auto rounded-full border border-white/20 px-3.5 py-3 text-center text-sm font-semibold text-white/90 transition hover:bg-white hover:text-[#0F172A]"
        >
          Return to landing page
        </Link>
      </div>
    </aside>
  )
}
