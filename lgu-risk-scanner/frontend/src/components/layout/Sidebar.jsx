<<<<<<< HEAD
import { Link, NavLink } from 'react-router-dom'
import logo from '../../assets/sidebar-risk-radar-logo.svg'
=======
import { NavLink } from 'react-router-dom'
>>>>>>> parent of 9ba0142 (FINAL UI CHANGES)

export const appLinks = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Analysis', path: '/analysis' },
  { name: 'LGU Ranking', path: '/lgu-ranking' },
  { name: 'Audit Explorer', path: '/audit-explorer' },
  { name: 'Compare LGUs', path: '/compare' },
  { name: 'What-If Simulator', path: '/simulator' },
  { name: 'Reports', path: '/reports' },
]

export default function Sidebar() {
  return (
    <aside className="h-screen w-64 shrink-0 border-r border-[#1E293B] bg-[#0F172A] p-4">
      <div className="mb-8 px-2">
        <h1 className="text-xl font-extrabold tracking-tight text-white">Bantay Bayan</h1>
      </div>

<<<<<<< HEAD
      <div
        className={`flex h-full flex-col transition-all duration-300 ${
          isOpen
            ? 'translate-y-0 opacity-100 delay-150'
            : 'pointer-events-none -translate-y-2 opacity-0'
        }`}
      >
        <div className="mb-7 border-b border-white/10 pb-5 pt-1">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Bantay Bayan logo"
              className="h-10 w-10 object-contain drop-shadow-md"
            />
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-white">Bantay Bayan</h1>
              <p className="mt-1 text-xs font-medium text-white/75">Risk Portal</p>
            </div>
          </div>
        </div>

        <nav className="space-y-1.5">
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
          className="mb-1 mt-auto rounded-full border border-white/20 px-3.5 py-3 text-center text-sm font-semibold text-white/90 transition hover:bg-white hover:text-[#0F172A]"
        >
          Return to landing page
        </Link>
      </div>
=======
      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-[#38BDF8] text-[#0F172A] shadow-sm shadow-[#38BDF8]/25'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
>>>>>>> parent of 9ba0142 (FINAL UI CHANGES)
    </aside>
  )
}
