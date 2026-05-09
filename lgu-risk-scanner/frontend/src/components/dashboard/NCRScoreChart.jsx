import { useState } from 'react'
import { RISK_LEVEL_ORDER, getRiskLevelColor } from '../../utils/riskLevels'

function NCRScoreChart({ data }) {
  const [showAllCities, setShowAllCities] = useState(false)
  const sortedData = [...data].sort((a, b) => b.score - a.score)
  const visibleData = showAllCities ? sortedData : sortedData.slice(0, 3)
  const maxScore = Math.max(1, ...sortedData.map((item) => item.score))

  const getRiskLevelGradient = (riskLevel) => {
    const color = getRiskLevelColor(riskLevel)
    return `linear-gradient(180deg, ${color} 0%, ${color} 100%)`
  }

  const riskCounts = {
    Low: sortedData.filter((item) => item.riskLevel === 'Low').length,
    Medium: sortedData.filter((item) => item.riskLevel === 'Medium').length,
    High: sortedData.filter((item) => item.riskLevel === 'High').length,
    Critical: sortedData.filter((item) => item.riskLevel === 'Critical').length,
  }

  return (
    <div className="grid gap-8">
      <div className="premium-card premium-hover reveal-on-scroll overflow-hidden rounded-3xl border border-[#38BDF8]/35 bg-white shadow-2xl shadow-[#2563EB]/12">
        <div className="border-b border-[#38BDF8]/20 bg-gradient-to-r from-[#F8FAFC] via-white to-[#EFF6FF] px-8 py-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">Risk trend</p>
          <h3 className="mt-2 text-3xl font-black text-[#0F172A]">NCR Cities Risk Score Distribution</h3>
        </div>

        <div className="p-6 sm:p-8">
          <div className="rounded-3xl bg-[#EFF6FF] p-4 sm:p-5">
            <div className="space-y-3">
              {visibleData.map((item, index) => {
                const barWidth = (item.score / maxScore) * 100

                return (
                  <div
                    key={item.name ?? index}
                    className="rounded-2xl bg-white/70 px-3 py-3 shadow-sm shadow-[#2563EB]/5 sm:px-4"
                  >
                    <p
                      className="mb-2 min-w-0 text-sm font-black uppercase tracking-[0.04em] text-[#1D4ED8]"
                      title={item.name}
                    >
                      {item.name}
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="h-7 min-w-0 flex-1 overflow-hidden rounded-full bg-[#DBEAFE] shadow-inner shadow-[#2563EB]/10">
                        <div
                          className="animated-progress h-full rounded-full shadow-md shadow-slate-300/50 transition-all duration-300 ease-out hover:brightness-105"
                          style={{
                            '--progress-delay': `${index * 55}ms`,
                            width: `${barWidth}%`,
                            background: getRiskLevelGradient(item.riskLevel),
                          }}
                        />
                      </div>

                      <span className="grid h-8 min-w-12 place-items-center rounded-full bg-[#F8FAFC] px-3 text-xs font-black text-[#0F172A] shadow-sm">
                        {item.score}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {sortedData.length > 3 ? (
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAllCities((current) => !current)}
                className="rounded-full border border-[#38BDF8]/45 bg-white px-5 py-2 text-sm font-bold text-[#2563EB] shadow-sm shadow-[#2563EB]/10 transition hover:border-[#2563EB]/55 hover:bg-[#EFF6FF]"
              >
                {showAllCities ? 'Show less' : `See more (${sortedData.length - 3})`}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="premium-card premium-hover reveal-on-scroll overflow-hidden rounded-3xl border border-[#38BDF8]/35 bg-white shadow-2xl shadow-[#2563EB]/12">
        <div className="border-b border-[#38BDF8]/20 bg-gradient-to-r from-[#F8FAFC] via-white to-[#EFF6FF] px-8 py-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">Overview</p>
          <h3 className="mt-2 text-3xl font-black text-[#0F172A]">Risk Summary</h3>
        </div>

        <div className="grid gap-5 p-8 sm:grid-cols-2 xl:grid-cols-4">
          {RISK_LEVEL_ORDER.map((level) => (
            <div key={level.label} className="rounded-2xl border border-[#38BDF8]/20 bg-white px-5 py-4 shadow-lg shadow-slate-200/70">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: level.color }} />
                  <span className="text-sm font-semibold text-slate-700">{level.label} Risk</span>
                </div>
                <span className="text-lg font-bold text-[#0F172A]">{riskCounts[level.label]}</span>
              </div>
            </div>
          ))}

          <div className="rounded-2xl border border-[#38BDF8]/35 bg-[#EFF6FF] px-5 py-4 text-[#2563EB] shadow-sm sm:col-span-2 xl:col-span-4">
            <p className="flex items-center justify-center gap-2 text-sm font-semibold">
              <span className="grid h-5 w-5 place-items-center rounded-full border border-[#38BDF8]/60 text-xs font-black">
                i
              </span>
              Total LGUs: <span className="font-black">{sortedData.length}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NCRScoreChart
