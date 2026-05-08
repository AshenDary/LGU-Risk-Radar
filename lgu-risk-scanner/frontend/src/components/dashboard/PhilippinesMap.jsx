import Card from '../ui/Card'
import { getNCRScoresForChart } from '../../data/mockData'
import { philippinesCountryPaths, philippinesMapViewBox } from '../../data/philippinesMapPaths'
import { useRiskData } from '../../hooks/useRiskData'

const mapPositions = {
  Manila: { x: 278.5, y: 354 },
  'Quezon City': { x: 281.7, y: 349.9 },
  Caloocan: { x: 277.6, y: 351.3 },
  'Las Pinas': { x: 279, y: 362.2 },
  'Las Piñas': { x: 279, y: 362.2 },
  'Las PiÃ±as': { x: 279, y: 362.2 },
  Makati: { x: 280.6, y: 356.4 },
  Malabon: { x: 277, y: 350.3 },
  Mandaluyong: { x: 281.2, y: 355.1 },
  Marikina: { x: 284.8, y: 351.3 },
  Muntinlupa: { x: 282, y: 364.1 },
  Navotas: { x: 276.6, y: 350.4 },
  Paranaque: { x: 280.3, y: 360.4 },
  'Parañaque': { x: 280.3, y: 360.4 },
  'ParaÃ±aque': { x: 280.3, y: 360.4 },
  Pasay: { x: 279.4, y: 357.3 },
  Pasig: { x: 283.8, y: 355.2 },
  'San Juan': { x: 281.7, y: 353.7 },
  Taguig: { x: 282, y: 358.3 },
  Valenzuela: { x: 278.4, y: 348.6 },
}

const riskStyles = {
  Critical: 'border-red-500 bg-red-500 text-white shadow-red-500/30',
  High: 'border-orange-500 bg-orange-500 text-white shadow-orange-500/30',
  Medium: 'border-amber-400 bg-amber-300 text-[#78350F] shadow-amber-400/25',
  Low: 'border-emerald-500 bg-emerald-500 text-white shadow-emerald-500/30',
}

function normalizeName(name) {
  return name.replace(/^City of /, '').replace(/^Municipality of /, '')
}

function normalizeRiskLevel(level, score) {
  if (level) return level
  if (score >= 85) return 'Critical'
  if (score >= 75) return 'High'
  if (score >= 40) return 'Medium'
  return 'Low'
}

function PhilippinesMap() {
  const { chartRows, loading, error } = useRiskData()
  const fallbackRows = getNCRScoresForChart()
  const rows = (chartRows.length ? chartRows : fallbackRows)
    .map((row) => ({
      ...row,
      name: normalizeName(row.name),
      riskLevel: normalizeRiskLevel(row.riskLevel, row.score),
    }))
    .filter((row) => mapPositions[row.name])
    .sort((a, b) => b.score - a.score)
  const topRows = rows.slice(0, 5)

  return (
    <Card>
      <div className="mb-7">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">Map view</p>
        <h2 className="mt-2 text-3xl font-black leading-tight text-[#0F172A]">NCR Risk Map</h2>
        <p className="mt-2 text-sm font-medium leading-6 text-[#475569]">
          {chartRows.length ? 'Latest city-level risk scores.' : 'Sample city-level risk scores for preview.'}
        </p>
      </div>

      {error ? (
        <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
          Backend data unavailable, showing bundled sample data.
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="relative min-h-[32rem] overflow-hidden rounded-2xl border border-[#38BDF8]/30 bg-[#E0F2FE] p-4 shadow-inner shadow-[#2563EB]/10">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox={philippinesMapViewBox}
            role="img"
            aria-label="Map outline of the Philippines with NCR risk markers"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="philippines-map-fill" x1="0" x2="1" y1="0" y2="1">
                <stop stopColor="#FFFFFF" />
                <stop offset="0.55" stopColor="#DBEAFE" />
                <stop offset="1" stopColor="#BAE6FD" />
              </linearGradient>
              <filter id="map-shadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#1D4ED8" floodOpacity="0.14" />
              </filter>
            </defs>

            <rect width="640" height="900" fill="#E0F2FE" />
            <g filter="url(#map-shadow)">
              {philippinesCountryPaths.map((path) => (
                <path
                  key={path}
                  d={path}
                  fill="url(#philippines-map-fill)"
                  stroke="#2563EB"
                  strokeOpacity="0.42"
                  strokeWidth="1.2"
                />
              ))}
            </g>

            <circle cx="280.5" cy="355.2" r="22" fill="#2563EB" opacity="0.12" />
            <circle cx="280.5" cy="355.2" r="10" fill="#2563EB" opacity="0.18" />
            <text x="304" y="350" fill="#0F172A" fontSize="18" fontWeight="800">
              Metro Manila
            </text>
            <text x="304" y="371" fill="#2563EB" fontSize="12" fontWeight="700">
              NCR sample risk points
            </text>

            {rows.map((row) => {
              const position = mapPositions[row.name]
              const color = row.riskLevel === 'Critical'
                ? '#EF4444'
                : row.riskLevel === 'High'
                  ? '#F97316'
                  : row.riskLevel === 'Medium'
                    ? '#FBBF24'
                    : '#10B981'

              return (
                <g key={row.name}>
                  <title>{`${row.name}: ${row.score} (${row.riskLevel})`}</title>
                  <circle cx={position.x} cy={position.y} r="4.8" fill={color} stroke="#FFFFFF" strokeWidth="1.6" />
                </g>
              )
            })}
          </svg>

          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 rounded-2xl border border-white/70 bg-white/85 p-3 text-xs font-bold text-[#0F172A] shadow-sm">
            {Object.entries(riskStyles).map(([level, classes]) => (
              <span key={level} className="inline-flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full border ${classes}`} />
                {level}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#38BDF8]/25 bg-white p-5 shadow-sm shadow-slate-200/70">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#2563EB]">Highest risk</p>
              <h3 className="mt-1 text-xl font-black text-[#0F172A]">Priority LGUs</h3>
            </div>
            {loading ? <span className="text-xs font-bold text-[#64748B]">Loading</span> : null}
          </div>

          <div className="space-y-3">
            {topRows.map((row, index) => (
              <div key={row.name} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-[#0F172A]">
                      {index + 1}. {row.name}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[#64748B]">{row.riskLevel} risk</p>
                  </div>
                  <span className="shrink-0 text-2xl font-black text-[#2563EB]">{Math.round(row.score)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default PhilippinesMap
