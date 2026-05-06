import { getNCRScoresForChart } from '../../data/mockData'

function NCRScoreChart() {
  const data = getNCRScoresForChart()
  const maxScore = Math.max(...data.map(d => d.score))
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
      <div className="lg:col-span-2 bg-[#0f2e47] rounded-lg shadow overflow-hidden border border-[#1a3a52]">
        <div className="px-6 py-4 bg-[#0a2240] border-b border-[#1a3a52]">
          <h3 className="text-lg font-semibold text-white">NCR Cities Risk Score Distribution</h3>
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
                    <p className="text-xs text-gray-300 text-center max-w-12 whitespace-normal break-words">
                      {item.name}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Y-axis labels */}
          <div className="flex justify-between text-xs text-gray-400 mt-4 px-4">
            <span>0</span>
            <span>{Math.round(maxScore / 2)}</span>
            <span>{maxScore}</span>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">Risk Score (Higher = Riskier)</p>
        </div>
      </div>

      {/* Risk Level Summary */}
      <div className="bg-[#0f2e47] rounded-lg shadow overflow-hidden border border-[#1a3a52]">
        <div className="px-6 py-4 bg-[#0a2240] border-b border-[#1a3a52]">
          <h3 className="text-lg font-semibold text-white">Risk Summary</h3>
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
                <span className="text-sm text-gray-300">{item.label}</span>
              </div>
              <span className="text-lg font-bold text-white">{item.count}</span>
            </div>
          ))}

          <div className="pt-4 border-t border-[#1a3a52]">
            <p className="text-xs text-gray-400">
              Total Cities: <span className="text-white font-semibold">{data.length}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NCRScoreChart
