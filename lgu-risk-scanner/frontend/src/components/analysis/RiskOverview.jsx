import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

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
    if (selectedLgu === 'all') {
      return rows
        .map((item) => ({
          name: item.name.replace(/^City of /, '').replace(/^Municipality of /, ''),
          value: Number((item.totalAmount / 1000000).toFixed(2)),
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 12)
    }

    return procurements
      .filter((item) => item.lgu_id === selectedLgu)
      .sort((a, b) => new Date(a.created_at || a.updated_at || 0) - new Date(b.created_at || b.updated_at || 0))
      .map((item, index) => ({
        name: item.reference_number || item.title?.slice(0, 18) || `Record ${index + 1}`,
        value: Number((Number(item.amount || 0) / 1000000).toFixed(2)),
        supplier: item.supplier || 'No supplier',
        status: item.status || 'No status',
      }))
  }, [procurements, rows, selectedLgu])

  const selectedName = rows.find((item) => item.id === selectedLgu)?.name || 'Selected LGU'

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
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Procurement Exposure</h3>
              <p className="mt-1 text-sm text-cyan-50/55">
                {selectedLgu === 'all'
                  ? 'Compare total procurement value across LGUs.'
                  : `Review individual procurement values for ${selectedName}.`}
              </p>
            </div>
            <select
              value={selectedLgu}
              onChange={(event) => setSelectedLgu(event.target.value)}
              className="rounded border border-[#1a3a52] bg-[#0a2240] px-4 py-2 text-sm text-white"
            >
              <option value="all">All LGUs</option>
              {rows.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData} margin={{ top: 12, right: 16, left: 8, bottom: 48 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a3a52" />
                <XAxis
                  dataKey="name"
                  stroke="#999"
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                  height={72}
                  tick={{ fontSize: 11 }}
                />
                <YAxis stroke="#999" tick={{ fontSize: 11 }} label={{ value: 'PHP Millions', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0a2240', border: '1px solid #1a3a52', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value) => [`PHP ${value}M`, 'Value']}
                />
                <Bar dataKey="value" name="Procurement Value" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="grid h-72 place-items-center rounded border border-cyan-200/10 bg-[#071f33] text-sm text-cyan-50/60">
              No procurement records found for {selectedName}.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RiskOverview

