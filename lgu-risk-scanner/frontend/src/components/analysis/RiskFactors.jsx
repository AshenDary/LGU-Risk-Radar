function RiskFactors() {
  const riskFactors = [
    {
      category: 'Procurement Anomalies',
      impactPercentage: 35,
      insight: 'High volatility in supplier selection and contract values detected. Consider implementing stricter supplier vetting procedures and centralizing procurement approvals.',
    },
    {
      category: 'Audit Findings',
      impactPercentage: 28,
      insight: 'Multiple findings related to documentation and compliance issues. Recommend quarterly audit reviews and enhanced record-keeping systems.',
    },
    {
      category: 'Population Risk',
      impactPercentage: 18,
      insight: 'Larger municipalities face proportionally higher risks due to complexity. Recommend scaling governance infrastructure accordingly.',
    },
    {
      category: 'Supplier Behavior',
      impactPercentage: 12,
      insight: 'Limited supplier diversity increases concentration risk. Encourage competitive bidding and expand supplier network.',
    },
    {
      category: 'Data Completeness',
      impactPercentage: 7,
      insight: 'Missing or incomplete data fields may mask underlying risks. Improve data collection and validation processes.',
    },
  ]

  const getRiskColor = (percentage) => {
    if (percentage >= 30) return '#dc2626'
    if (percentage >= 15) return '#eab308'
    return '#16a34a'
  }

  return (
    <div className="grid gap-6">
      <div className="bg-[#0f2e47] rounded-lg overflow-hidden border border-[#1a3a52]">
        <div className="px-6 py-4 bg-[#0a2240] border-b border-[#1a3a52]">
          <h3 className="text-lg font-semibold text-white">Risk Factor Analysis</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a3a52] bg-[#0a2240]">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">Risk Category</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-400">Impact %</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">AI Insight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a3a52]">
              {riskFactors.map((factor, idx) => (
                <tr key={idx} className="hover:bg-[#0a2240]/30 transition">
                  <td className="px-6 py-4 text-sm text-white font-medium">{factor.category}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition"
                          style={{
                            width: `${factor.impactPercentage}%`,
                            backgroundColor: getRiskColor(factor.impactPercentage),
                          }}
                        />
                      </div>
                      <span className="text-sm font-bold text-white w-12 text-right">
                        {factor.impactPercentage}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300 leading-relaxed">{factor.insight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0f2e47] rounded-lg p-6 border border-[#1a3a52]">
          <div className="text-sm text-gray-400 mb-2">Top Risk Factor</div>
          <div className="text-lg font-bold text-white">{riskFactors[0].category}</div>
          <div className="text-2xl font-bold text-red-500 mt-2">{riskFactors[0].impactPercentage}%</div>
        </div>

        <div className="bg-[#0f2e47] rounded-lg p-6 border border-[#1a3a52]">
          <div className="text-sm text-gray-400 mb-2">Total Risk Factors</div>
          <div className="text-3xl font-bold text-white">{riskFactors.length}</div>
          <div className="text-xs text-gray-500 mt-2">Tracked and analyzed</div>
        </div>

        <div className="bg-[#0f2e47] rounded-lg p-6 border border-[#1a3a52]">
          <div className="text-sm text-gray-400 mb-2">Coverage</div>
          <div className="text-3xl font-bold text-white">100%</div>
          <div className="text-xs text-gray-500 mt-2">All factors identified</div>
        </div>
      </div>
    </div>
  )
}

export default RiskFactors
