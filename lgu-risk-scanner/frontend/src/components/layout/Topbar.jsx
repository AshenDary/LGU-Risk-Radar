import { Link, NavLink } from 'react-router-dom'
import { appLinks } from './Sidebar'

function Topbar() {
  return (
    <header className="border-b border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6 lg:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="truncate text-xl font-extrabold tracking-tight text-[#0F172A] sm:text-2xl">Bantay Bayan</p>
          <p className="mt-1 text-sm font-medium leading-5 text-[#1E293B]/70">LGU Risk Intelligence Platform</p>
        </div>

        <Link
          to="/"
          className="hidden rounded-lg border border-[#2563EB]/20 px-4 py-2 text-sm font-bold text-[#2563EB] transition hover:border-[#2563EB]/40 hover:bg-[#EFF6FF] lg:inline-flex"
        >
          Landing page
        </Link>
      </div>

      <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
        <Link
          to="/"
          className="shrink-0 rounded-lg border border-[#2563EB]/20 px-3 py-2 text-sm font-bold text-[#2563EB]"
        >
          Landing
        </Link>
        {appLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `shrink-0 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                isActive
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-[#F8FAFC] text-[#1E293B]/75 hover:bg-[#EFF6FF] hover:text-[#2563EB]'
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

export default Topbar
