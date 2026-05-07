import { NavLink } from 'react-router-dom'

const links = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Analysis', path: '/analysis' },
  { name: 'LGU Ranking', path: '/lgu-ranking' },
  { name: 'Audit Explorer', path: '/audit-explorer' },
]

export default function Sidebar() {
  return (
    <aside className="h-screen w-64 shrink-0 border-r border-[#1E293B] bg-[#0F172A] p-4">
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
                  ? 'bg-[#38BDF8] text-[#0F172A] shadow-sm shadow-[#38BDF8]/25'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
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
