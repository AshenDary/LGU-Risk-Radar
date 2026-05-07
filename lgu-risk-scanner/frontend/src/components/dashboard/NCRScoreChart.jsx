function NCRScoreChart({ data }) {
<<<<<<< HEAD
  const [showAllCities, setShowAllCities] = useState(false)
  const sortedData = [...data].sort((a, b) => b.score - a.score)
  const visibleData = showAllCities ? sortedData : sortedData.slice(0, 3)
  const maxScore = Math.max(1, ...sortedData.map((item) => item.score))

  const getRiskLevelGradient = (riskLevel) => {
    const gradients = {
      Critical: 'linear-gradient(180deg, #ef4444 0%, #dc2626 58%, #b91c1c 100%)',
      High: 'linear-gradient(180deg, #f97316 0%, #ea580c 58%, #c2410c 100%)',
      Medium: 'linear-gradient(180deg, #facc15 0%, #eab308 58%, #ca8a04 100%)',
      Low: 'linear-gradient(180deg, #22c55e 0%, #16a34a 58%, #15803d 100%)',
    }

    return gradients[riskLevel] || 'linear-gradient(180deg, #94a3b8 0%, #64748b 58%, #475569 100%)'
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
=======
  const maxScore = Math.max(1, ...data.map(d => d.score))
  const chartHeight = 300

  const getRiskLevelColor = (riskLevel) => {
    const colors = {
      Critical: '#dc2626',
      High: '#ea580c',
      Medium: '#eab308',
      Low: '#16a34a',
    }
    return colors[riskLevel] || '#666'
  }

  // Count cities by risk level
  const riskCounts = {
    Low: data.filter(d => d.riskLevel === 'Low').length,
    Medium: data.filter(d => d.riskLevel === 'Medium').length,
    High: data.filter(d => d.riskLevel === 'High').length,
    Critical: data.filter(d => d.riskLevel === 'Critical').length,
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Chart */}
      <div className="lg:col-span-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/80">
        <div className="border-b border-slate-200 bg-white px-6 py-4">
          <h3 className="text-lg font-semibold text-[#0F172A]">NCR Cities Risk Score Distribution</h3>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <div className="flex gap-4 pb-4" style={{ minWidth: 'max(100%, 800px)' }}>
              {data.map((item, idx) => {
                const barHeight = (item.score / maxScore) * chartHeight
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 flex-1 min-w-max">
                    {/* Bar */}
                    <div className="w-full flex flex-col items-center justify-end" style={{ height: chartHeight }}>
                      <div
                        className="w-12 rounded-t flex items-end justify-center text-white text-xs font-bold transition-all hover:opacity-80"
                        style={{
                          height: `${barHeight}px`,
                          backgroundColor: getRiskLevelColor(item.riskLevel),
                        }}
                      >
                        {barHeight > 30 && (
                          <span className="pb-1">{item.score}</span>
                        )}
                      </div>
                    </div>
                    {/* Label */}
                    <p className="max-w-12 whitespace-normal break-words text-center text-xs text-[#1E293B]/70">
                      {item.name}
                    </p>
>>>>>>> parent of 9ba0142 (FINAL UI CHANGES)
                  </div>
                )
              })}
            </div>
          </div>

          {/* Y-axis labels */}
          <div className="mt-4 flex justify-between px-4 text-xs text-[#1E293B]/60">
            <span>0</span>
            <span>{Math.round(maxScore / 2)}</span>
            <span>{maxScore}</span>
          </div>
          <p className="mt-2 text-center text-xs text-[#1E293B]/60">Risk Score (Higher = Riskier)</p>
        </div>
      </div>

<<<<<<< HEAD
      <div className="premium-card premium-hover reveal-on-scroll overflow-hidden rounded-3xl border border-[#38BDF8]/35 bg-white shadow-2xl shadow-[#2563EB]/12">
        <div className="border-b border-[#38BDF8]/20 bg-gradient-to-r from-[#F8FAFC] via-white to-[#EFF6FF] px-8 py-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">Overview</p>
          <h3 className="mt-2 text-3xl font-black text-[#0F172A]">Risk Summary</h3>
=======
      {/* Risk Level Summary */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/80">
        <div className="border-b border-slate-200 bg-white px-6 py-4">
          <h3 className="text-lg font-semibold text-[#0F172A]">Risk Summary</h3>
>>>>>>> parent of 9ba0142 (FINAL UI CHANGES)
        </div>

        <div className="p-6 space-y-4">
          {[
            { label: 'Low Risk', count: riskCounts.Low, color: '#16a34a' },
            { label: 'Medium Risk', count: riskCounts.Medium, color: '#eab308' },
            { label: 'High Risk', count: riskCounts.High, color: '#ea580c' },
            { label: 'Critical Risk', count: riskCounts.Critical, color: '#dc2626' },
          ].map((item) => (
<<<<<<< HEAD
            <div key={item.label} className="rounded-2xl border border-[#38BDF8]/20 bg-white px-5 py-4 shadow-lg shadow-slate-200/70">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                </div>
                <span className="text-lg font-bold text-[#0F172A]">{item.count}</span>
              </div>
=======
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-[#1E293B]/75">{item.label}</span>
              </div>
              <span className="text-lg font-bold text-[#0F172A]">{item.count}</span>
>>>>>>> parent of 9ba0142 (FINAL UI CHANGES)
            </div>
          ))}

          <div className="border-t border-slate-200 pt-4">
            <p className="text-xs text-[#1E293B]/60">
              Total LGUs: <span className="font-semibold text-[#0F172A]">{data.length}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NCRScoreChart
