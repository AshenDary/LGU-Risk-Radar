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
    if (percentage >= 30) return '#DC2626'
    if (percentage >= 15) return '#EAB308'
    return '#16A34A'
  }

  return (
    <div className="grid gap-6">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/80">
        <div className="border-b border-slate-200 bg-white px-6 py-4">
          <h3 className="text-lg font-semibold text-[#0F172A]">Risk Factor Analysis</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-[#F8FAFC]">
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#1E293B]/70">Risk Category</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-[#1E293B]/70">Avg Contribution</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#1E293B]/70">Insight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {riskFactors.map((factor) => (
                <tr key={factor.category} className="transition hover:bg-[#F8FAFC]">
                  <td className="px-6 py-4 text-sm font-medium text-[#0F172A]">{factor.category}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full transition"
                          style={{
                            width: `${Math.min(100, factor.impactPercentage)}%`,
                            backgroundColor: getRiskColor(factor.impactPercentage),
                          }}
                        />
                      </div>
                      <span className="w-12 text-right text-sm font-bold text-[#0F172A]">
                        {factor.impactPercentage}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm leading-relaxed text-[#1E293B]/70">{factor.insight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          ['Top Risk Factor', riskFactors[0]?.category || 'None', riskFactors[0]?.impactPercentage || 0],
          ['Total Risk Factors', riskFactors.length, 'Tracked from backend scoring factors'],
          ['Coverage', rows.length, 'Live LGUs analyzed'],
        ].map(([label, value, helper]) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/80">
            <div className="mb-2 text-sm text-[#1E293B]/65">{label}</div>
            <div className="text-2xl font-bold text-[#0F172A]">{value}</div>
            <div className="mt-2 text-xs text-[#1E293B]/55">{helper}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RiskFactors
