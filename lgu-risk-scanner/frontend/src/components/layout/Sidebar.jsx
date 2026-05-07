import { Link, NavLink } from 'react-router-dom'

export const appLinks = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Map View', path: '/map-view' },
  { name: 'Analysis', path: '/analysis' },
  { name: 'LGU Ranking', path: '/lgu-ranking' },
  { name: 'Audit Explorer', path: '/audit-explorer' },
  { name: 'Compare LGUs', path: '/compare' },
  { name: 'Reports', path: '/reports' },
]

export default function Sidebar() {
  return (
    <aside className="hidden h-screen w-64 shrink-0 border-r border-[#1E293B] bg-[#0F172A] p-4 lg:block">
      <div className="mb-6 px-2">
        <h1 className="text-xl font-extrabold tracking-tight text-white">Bantay Bayan</h1>
        <p className="mt-1 text-xs font-medium text-cyan-50/55">LGU Risk Intelligence</p>
      </div>

      <nav className="space-y-1">
        {appLinks.map((link) => (
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

      <div className="mt-8 border-t border-white/10 pt-4">
        <Link
          to="/"
          className="block rounded-lg border border-cyan-200/15 px-3 py-2.5 text-sm font-semibold text-cyan-50/75 transition hover:bg-white/10 hover:text-white"
        >
          Landing page
        </Link>
      </div>
    </aside>
  )
}
