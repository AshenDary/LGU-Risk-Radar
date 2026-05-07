const factorLabels = {
  procurement_volume_risk: 'Procurement Volume',
  supplier_concentration_risk: 'Supplier Concentration',
  status_anomaly_risk: 'Status Anomalies',
  population_risk: 'Population Complexity',
  data_quality_risk: 'Data Quality',
  baseline_risk: 'Baseline Risk',
}

function RiskFactors({ rows }) {
  const riskFactors = Object.entries(factorLabels)
    .map(([key, category]) => {
      const average = rows.length
        ? rows.reduce((sum, item) => sum + Number(item.factors?.[key] || 0), 0) / rows.length
        : 0
      return {
        category,
        impactPercentage: Number(average.toFixed(2)),
        insight: `Average ${category.toLowerCase()} contribution across live LGU risk analyses.`,
      }
    })
    .sort((a, b) => b.impactPercentage - a.impactPercentage)

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
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-400">Avg Contribution</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">Insight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a3a52]">
              {riskFactors.map((factor) => (
                <tr key={factor.category} className="hover:bg-[#0a2240]/30 transition">
                  <td className="px-6 py-4 text-sm text-white font-medium">{factor.category}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition"
                          style={{
                            width: `${Math.min(100, factor.impactPercentage)}%`,
                            backgroundColor: getRiskColor(factor.impactPercentage),
                          }}
                        />
                      </div>
                      <span className="text-sm font-bold text-white w-12 text-right">
                        {factor.impactPercentage}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0f2e47] rounded-lg p-6 border border-[#1a3a52]">
          <div className="text-sm text-gray-400 mb-2">Top Risk Factor</div>
          <div className="text-lg font-bold text-white">{riskFactors[0]?.category || 'None'}</div>
          <div className="text-2xl font-bold text-red-500 mt-2">{riskFactors[0]?.impactPercentage || 0}</div>
        </div>

        <div className="bg-[#0f2e47] rounded-lg p-6 border border-[#1a3a52]">
          <div className="text-sm text-gray-400 mb-2">Total Risk Factors</div>
          <div className="text-3xl font-bold text-white">{riskFactors.length}</div>
          <div className="text-xs text-gray-500 mt-2">Tracked from backend scoring factors</div>
        </div>

        <div className="bg-[#0f2e47] rounded-lg p-6 border border-[#1a3a52]">
          <div className="text-sm text-gray-400 mb-2">Coverage</div>
          <div className="text-3xl font-bold text-white">{rows.length}</div>
          <div className="text-xs text-gray-500 mt-2">Live LGUs analyzed</div>
        </div>
      </div>
    </div>
  )
}

export default RiskFactors

