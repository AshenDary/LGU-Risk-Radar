function TopTrustworthyLGUs({ data }) {
  const getRiskLevelColor = (riskLevel) => {
    const colors = {
      Critical: '#dc2626',
      High: '#ea580c',
      Medium: '#eab308',
      Low: '#16a34a',
    }
    return colors[riskLevel] || '#666'
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/80">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <h3 className="text-lg font-semibold text-[#0F172A]">Top 5 Most Trustworthy LGUs</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-slate-200 bg-[#F8FAFC]">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[#1E293B]/75">Rank</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[#1E293B]/75">LGU Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[#1E293B]/75">Average Risk Score</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[#1E293B]/75">Risk Level</th>
            </tr>
          </thead>
          <tbody>
            {data.map((lgu, index) => (
              <tr key={lgu.id} className="border-b border-slate-100 hover:bg-[#F8FAFC]">
                <td className="px-6 py-4 text-sm font-medium text-[#1E293B]/70">{index + 1}</td>
                <td className="px-6 py-4 text-sm font-semibold text-[#0F172A]">{lgu.name}</td>
                <td className="px-6 py-4 text-sm text-[#1E293B]/75">{lgu.score.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className="px-3 py-1 rounded-full text-white text-xs font-medium"
                    style={{ backgroundColor: getRiskLevelColor(lgu.riskLevel) }}
                  >
                    {lgu.riskLevel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="border-t border-slate-200 bg-[#F8FAFC] px-6 py-4">
        <p className="text-sm text-[#1E293B]/70">Lower risk scores indicate more trustworthy governance and procurement practices</p>
      </div>
    </div>
  )
}

export default TopTrustworthyLGUs
