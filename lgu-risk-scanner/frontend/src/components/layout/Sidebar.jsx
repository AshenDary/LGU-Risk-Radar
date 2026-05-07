import { NavLink } from 'react-router-dom'

const links = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Analysis', path: '/analysis' },
  { name: 'LGU Ranking', path: '/lgu-ranking' },
  { name: 'Audit Explorer', path: '/audit-explorer' },
  { name: 'Compare LGUs', path: '/compare' },
  { name: 'Reports', path: '/reports' },
]

export default function Sidebar() {
  return (
    <aside className="h-screen w-64 shrink-0 border-r border-cyan-200/10 bg-[#01111f] p-4">
      <div className="mb-8 px-2">
        <h1 className="text-xl font-extrabold tracking-tight text-white">Bantay Bayan</h1>
      </div>

      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-cyan-400 text-slate-950 shadow-sm shadow-cyan-400/20'
                  : 'text-cyan-100/60 hover:bg-cyan-100/10 hover:text-white'
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
