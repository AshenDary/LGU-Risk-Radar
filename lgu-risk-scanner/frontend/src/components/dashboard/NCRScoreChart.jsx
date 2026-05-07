function NCRScoreChart({ data }) {
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
            <div className="flex gap-3 pb-4 sm:gap-4" style={{ minWidth: 'max(100%, min(800px, 240vw))' }}>
              {data.map((item, idx) => {
                const barHeight = (item.score / maxScore) * chartHeight
                return (
                  <div key={idx} className="flex min-w-12 flex-1 flex-col items-center gap-2">
                    {/* Bar */}
                    <div className="w-full flex flex-col items-center justify-end" style={{ height: chartHeight }}>
                      <div
                        className="flex w-9 items-end justify-center rounded-t text-xs font-bold text-white transition-all hover:opacity-80 sm:w-12"
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
                    <p className="max-w-14 whitespace-normal break-words text-center text-[11px] leading-4 text-[#1E293B]/70 sm:text-xs">
                      {item.name}
                    </p>
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

      {/* Risk Level Summary */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/80">
        <div className="border-b border-slate-200 bg-white px-6 py-4">
          <h3 className="text-lg font-semibold text-[#0F172A]">Risk Summary</h3>
        </div>

        <div className="p-6 space-y-4">
          {[
            { label: 'Low Risk', count: riskCounts.Low, color: '#16a34a' },
            { label: 'Medium Risk', count: riskCounts.Medium, color: '#eab308' },
            { label: 'High Risk', count: riskCounts.High, color: '#ea580c' },
            { label: 'Critical Risk', count: riskCounts.Critical, color: '#dc2626' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-[#1E293B]/75">{item.label}</span>
              </div>
              <span className="text-lg font-bold text-[#0F172A]">{item.count}</span>
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
