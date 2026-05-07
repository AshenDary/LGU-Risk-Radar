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
    <div className="bg-[#0f2e47] rounded-lg shadow overflow-hidden border border-[#1a3a52]">
      <div className="px-6 py-4 bg-[#0a2240] border-b border-[#1a3a52] flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Top 5 Most Trustworthy LGUs</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#0a2240] border-b border-[#1a3a52]">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Rank</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">LGU Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Average Risk Score</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Risk Level</th>
            </tr>
          </thead>
          <tbody>
            {data.map((lgu, index) => (
              <tr key={lgu.id} className="border-b border-[#1a3a52] hover:bg-[#0a2240]">
                <td className="px-6 py-4 text-sm text-gray-300 font-medium">{index + 1}</td>
                <td className="px-6 py-4 text-sm text-gray-100">{lgu.name}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{lgu.score.toFixed(2)}</td>
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
      
      <div className="px-6 py-4 bg-[#0a2240] border-t border-[#1a3a52]">
        <p className="text-sm text-gray-300">Lower risk scores indicate more trustworthy governance and procurement practices</p>
      </div>
    </div>
  )
}

export default TopTrustworthyLGUs
