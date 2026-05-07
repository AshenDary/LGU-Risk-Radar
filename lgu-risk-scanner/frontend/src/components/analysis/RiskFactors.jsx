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
    <div className="grid gap-8">
      <div className="premium-card premium-hover reveal-on-scroll overflow-hidden rounded-3xl border border-[#38BDF8]/35 bg-white shadow-2xl shadow-[#2563EB]/12">
        <div className="border-b border-[#38BDF8]/20 bg-gradient-to-r from-[#F8FAFC] via-white to-[#EFF6FF] px-8 py-7">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">Risk factors</p>
          <h3 className="mt-2 text-3xl font-black leading-tight text-[#0F172A]">Risk Factor Analysis</h3>
        </div>

        <div className="dashboard-scrollbar overflow-x-auto">
          <table className="min-w-[640px] table-fixed">
            <colgroup>
              <col className="w-[30%]" />
              <col className="w-[28%]" />
              <col className="w-[42%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-[#38BDF8]/18 bg-[#F8FAFC]">
                <th className="px-3 py-4 text-left text-xs font-black uppercase tracking-[0.08em] text-slate-600 sm:px-6">Category</th>
                <th className="px-3 py-4 text-center text-xs font-black uppercase tracking-[0.08em] text-slate-600 sm:px-6">Avg</th>
                <th className="px-3 py-4 text-left text-xs font-black uppercase tracking-[0.08em] text-slate-600 sm:px-6">Insight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {riskFactors.map((factor) => (
                <tr key={factor.category} className="transition hover:bg-[#F8FAFC]">
                  <td className="break-words px-3 py-5 text-sm font-semibold leading-5 text-[#0F172A] sm:px-6">{factor.category}</td>
                  <td className="px-3 py-5 text-center sm:px-6">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-3 min-w-0 flex-1 overflow-hidden rounded-full bg-[#DBEAFE]">
                        <div
                          className="h-full rounded-full transition"
                          style={{
                            width: `${Math.min(100, factor.impactPercentage)}%`,
                            backgroundColor: getRiskColor(factor.impactPercentage),
                          }}
                        />
                      </div>
                      <span className="w-10 text-right text-sm font-bold text-[#0F172A]">
                        {factor.impactPercentage}
                      </span>
                    </div>
                  </td>
                  <td className="break-words px-3 py-5 text-sm leading-6 text-[#1E293B]/70 sm:px-6">{factor.insight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="h-6 bg-white" />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {[
          ['Top Risk Factor', riskFactors[0]?.category || 'None', riskFactors[0]?.impactPercentage || 0],
          ['Total Risk Factors', riskFactors.length, 'Tracked from backend scoring factors'],
          ['Coverage', rows.length, 'Live LGUs analyzed'],
        ].map(([label, value, helper]) => (
          <div key={label} className="premium-card premium-hover reveal-on-scroll rounded-2xl p-6 sm:p-7">
            <div className="mb-2 text-sm font-semibold text-[#2563EB]">{label}</div>
            <div className="text-2xl font-extrabold text-[#0F172A]">{value}</div>
            <div className="mt-2 text-xs font-medium text-[#475569]">{helper}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RiskFactors
