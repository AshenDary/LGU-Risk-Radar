import { useMemo, useState } from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function RiskOverview({ rows, procurements }) {
  const [selectedLgu, setSelectedLgu] = useState('all')

  const avgScore = useMemo(() => {
    if (!rows.length) return '0.0'
    return (rows.reduce((sum, item) => sum + item.score, 0) / rows.length).toFixed(1)
  }, [rows])

  const riskExtremes = useMemo(() => {
    const sorted = [...rows].sort((a, b) => b.score - a.score)
    return {
      highest: sorted[0] || { name: 'None', score: 0 },
      lowest: sorted[sorted.length - 1] || { name: 'None', score: 0 },
    }
  }, [rows])

  const totalProcurement = useMemo(() => {
    const source = selectedLgu === 'all'
      ? procurements
      : procurements.filter((item) => item.lgu_id === selectedLgu)
    return source.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  }, [procurements, selectedLgu])

  const chartData = useMemo(() => {
    const source = selectedLgu === 'all' ? rows : rows.filter((item) => item.id === selectedLgu)
    return source
      .map((item) => ({
        name: item.name.replace(/^City of /, '').replace(/^Municipality of /, ''),
        value: Number((item.totalAmount / 1000000).toFixed(2)),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, selectedLgu === 'all' ? 12 : 20)
  }, [rows, selectedLgu])

  const getRiskColor = (score) => {
    if (score >= 75) return '#dc2626'
    if (score >= 40) return '#eab308'
    return '#16a34a'
  }

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0f2e47] rounded-lg p-6 border border-[#1a3a52]">
          <div className="text-sm text-gray-400 mb-2">Average Risk Score</div>
          <div className="text-3xl font-bold text-white">{avgScore}</div>
          <div className="text-xs text-gray-500 mt-2">Across live LGU records</div>
        </div>

        <div className="bg-[#0f2e47] rounded-lg p-6 border border-[#1a3a52]">
          <div className="text-sm text-gray-400 mb-2">Highest Risk LGU</div>
          <div className="text-lg font-bold text-white">{riskExtremes.highest.name}</div>
          <div className="text-2xl font-bold mt-2" style={{ color: getRiskColor(riskExtremes.highest.score) }}>
            {riskExtremes.highest.score.toFixed(2)}
          </div>
        </div>

        <div className="bg-[#0f2e47] rounded-lg p-6 border border-[#1a3a52]">
          <div className="text-sm text-gray-400 mb-2">Lowest Risk LGU</div>
          <div className="text-lg font-bold text-white">{riskExtremes.lowest.name}</div>
          <div className="text-2xl font-bold mt-2" style={{ color: getRiskColor(riskExtremes.lowest.score) }}>
            {riskExtremes.lowest.score.toFixed(2)}
          </div>
        </div>

        <div className="bg-[#0f2e47] rounded-lg p-6 border border-[#1a3a52]">
          <div className="text-sm text-gray-400 mb-2">Total Procurement Value</div>
          <div className="text-2xl font-bold text-white">PHP {(totalProcurement / 1000000).toFixed(1)}M</div>
          <div className="text-xs text-gray-500 mt-2">{selectedLgu === 'all' ? 'All LGUs' : 'Selected LGU'}</div>
        </div>
      </div>

      <div className="bg-[#0f2e47] rounded-lg p-6 border border-[#1a3a52]">
        <div className="mb-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h3 className="text-lg font-semibold text-white">Procurement Exposure</h3>
            <select
              value={selectedLgu}
              onChange={(event) => setSelectedLgu(event.target.value)}
              className="bg-[#0a2240] text-white px-4 py-2 rounded border border-[#1a3a52] text-sm"
            >
              <option value="all">All LGUs</option>
              {rows.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3a52" />
              <XAxis dataKey="name" stroke="#999" />
              <YAxis stroke="#999" label={{ value: 'PHP Millions', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0a2240', border: '1px solid #1a3a52', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
                formatter={(value) => [`PHP ${value}M`, 'Value']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#06b6d4"
                strokeWidth={2}
                name="Procurement Value"
                dot={{ fill: '#06b6d4', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default RiskOverview

