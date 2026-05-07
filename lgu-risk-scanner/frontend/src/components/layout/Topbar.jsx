const titleIcons = {
  Dashboard: (
    <>
      <path d="M3 13h6v8H3z" />
      <path d="M15 3h6v18h-6z" />
      <path d="M9 8h6v13H9z" />
    </>
  ),
  Analysis: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m16 16 5 5" />
      <path d="M8 12h6" />
      <path d="M11 9v6" />
    </>
  ),
  'LGU Ranking': (
    <>
      <path d="M6 21h12" />
      <path d="M8 21V10h8v11" />
      <path d="M10 10V5h4v5" />
      <path d="M4 14h4" />
      <path d="M16 14h4" />
    </>
  ),
  'Audit Explorer': (
    <>
      <path d="M7 3h10l3 3v15H7z" />
      <path d="M17 3v4h4" />
      <path d="M10 12h7" />
      <path d="M10 16h5" />
    </>
  ),
  'Compare LGUs': (
    <>
      <path d="M12 3v18" />
      <path d="M5 7h14" />
      <path d="M6 7 3 14h6z" />
      <path d="M18 7l-3 7h6z" />
    </>
  ),
  Reports: (
    <>
      <path d="M6 3h9l3 3v15H6z" />
      <path d="M15 3v4h4" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
    </>
  ),
  'Map View': (
    <>
      <path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3z" />
      <path d="M9 3v15" />
      <path d="M15 6v15" />
    </>
  ),
  'What-If Simulator': (
    <>
      <path d="M10 3v6l-5 9a3 3 0 0 0 2.6 4h8.8A3 3 0 0 0 19 18l-5-9V3" />
      <path d="M8 3h8" />
      <path d="M8 15h8" />
    </>
  ),
  About: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6" />
      <path d="M12 7h.01" />
    </>
  ),
}

function Topbar({ title = 'Dashboard', description, isSidebarOpen }) {
  const icon = titleIcons[title] ?? (
    <>
      <path d="M12 21s7-5.2 7-11a7 7 0 0 0-14 0c0 5.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  )

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[#38BDF8]/55 bg-gradient-to-r from-white/96 via-[#EFF6FF]/96 to-[#DBEAFE]/94 py-4 shadow-2xl shadow-[#2563EB]/18 backdrop-blur-xl">
      <div
        className={`flex min-h-16 items-center justify-between gap-4 pl-24 pr-6 transition-[padding] duration-300 ease-out lg:pr-6 ${
          isSidebarOpen ? 'lg:pl-72' : 'lg:pl-24'
        }`}
      >
        <div className="flex min-w-0 items-center gap-4">
          <svg
            aria-hidden="true"
            className="h-10 w-10 shrink-0 text-[#2563EB] drop-shadow-[0_8px_14px_rgba(37,99,235,0.18)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="url(#topbar-icon-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <defs>
              <linearGradient id="topbar-icon-gradient" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1D4ED8" />
                <stop offset="0.55" stopColor="#2563EB" />
                <stop offset="1" stopColor="#38BDF8" />
              </linearGradient>
            </defs>
            {icon}
          </svg>
          <div className="min-w-0 pt-1">
            <p className="truncate text-3xl font-extrabold tracking-tight text-[#0F172A]">{title}</p>
            {description ? (
              <p className="mt-1 max-w-3xl text-sm leading-6 text-[#2563EB]">{description}</p>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Topbar
