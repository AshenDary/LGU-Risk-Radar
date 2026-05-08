import Card from '../ui/Card'
import { getNCRScoresForChart } from '../../data/mockData'
import { useRiskData } from '../../hooks/useRiskData'

const mapPositions = {
  Manila: { left: '39%', top: '50%' },
  'Quezon City': { left: '46%', top: '26%' },
  Caloocan: { left: '39%', top: '20%' },
  'Las Pinas': { left: '37%', top: '78%' },
  'Las PiÃ±as': { left: '37%', top: '78%' },
  Makati: { left: '50%', top: '58%' },
  Malabon: { left: '34%', top: '25%' },
  Mandaluyong: { left: '51%', top: '49%' },
  Marikina: { left: '66%', top: '38%' },
  Muntinlupa: { left: '52%', top: '86%' },
  Navotas: { left: '29%', top: '31%' },
  Paranaque: { left: '40%', top: '70%' },
  'ParaÃ±aque': { left: '40%', top: '70%' },
  Pasay: { left: '42%', top: '61%' },
  Pasig: { left: '61%', top: '51%' },
  'San Juan': { left: '50%', top: '42%' },
  Taguig: { left: '58%', top: '68%' },
  Valenzuela: { left: '41%', top: '12%' },
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
        <div className="relative min-h-[28rem] overflow-hidden rounded-2xl border border-[#38BDF8]/30 bg-[#EFF6FF] p-5 shadow-inner shadow-[#2563EB]/10">
          <div className="absolute inset-5 rounded-[2rem] border border-[#38BDF8]/25 bg-white/55" />
          <div className="absolute left-[24%] top-[8%] h-[84%] w-[52%] rounded-[48%_40%_45%_42%] border-2 border-[#2563EB]/25 bg-gradient-to-b from-[#DBEAFE] via-white to-[#F8FAFC]" />
          <div className="absolute left-[31%] top-[16%] h-[68%] w-[36%] rounded-[45%] border border-[#38BDF8]/35" />
          <div className="absolute left-[38%] top-[28%] h-[48%] w-[24%] rounded-[42%] border border-[#2563EB]/20 bg-[#DBEAFE]/40" />

          {rows.map((row) => {
            const position = mapPositions[row.name]
            const style = riskStyles[row.riskLevel] || riskStyles.Low

            return (
              <div
                key={row.name}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: position.left, top: position.top }}
                title={`${row.name}: ${row.score} (${row.riskLevel})`}
              >
                <div className={`grid h-10 w-10 place-items-center rounded-full border-2 text-xs font-black shadow-lg ${style}`}>
                  {Math.round(row.score)}
                </div>
                <div className="mt-1 hidden max-w-24 rounded-full bg-white/90 px-2 py-1 text-center text-[0.62rem] font-bold leading-3 text-[#0F172A] shadow-sm sm:block">
                  {row.name}
                </div>
              </div>
            )
          })}

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
