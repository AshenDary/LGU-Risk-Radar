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
    if (score >= 75) return '#DC2626'
    if (score >= 40) return '#EAB308'
    return '#16A34A'
  }

  const statCards = [
    ['Average Risk Score', avgScore, 'Across live LGU records', '#2563EB'],
    ['Highest Risk LGU', riskExtremes.highest.name, riskExtremes.highest.score.toFixed(2), getRiskColor(riskExtremes.highest.score)],
    ['Lowest Risk LGU', riskExtremes.lowest.name, riskExtremes.lowest.score.toFixed(2), getRiskColor(riskExtremes.lowest.score)],
    ['Total Procurement Value', `PHP ${(totalProcurement / 1000000).toFixed(1)}M`, selectedLgu === 'all' ? 'All LGUs' : 'Selected LGU', '#2563EB'],
  ]

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map(([label, value, helper, color]) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/80">
            <div className="mb-2 text-sm text-[#1E293B]/65">{label}</div>
            <div className="text-2xl font-bold text-[#0F172A]">{value}</div>
            <div className="mt-2 text-sm font-semibold" style={{ color }}>{helper}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/80">
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-[#0F172A]">Procurement Exposure</h3>
            <select
              value={selectedLgu}
              onChange={(event) => setSelectedLgu(event.target.value)}
              className="rounded border border-slate-200 bg-white px-4 py-2 text-sm text-[#1E293B] outline-none focus:border-[#2563EB]"
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
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" stroke="#64748B" />
              <YAxis stroke="#64748B" label={{ value: 'PHP Millions', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                labelStyle={{ color: '#0F172A' }}
                formatter={(value) => [`PHP ${value}M`, 'Value']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563EB"
                strokeWidth={2}
                name="Procurement Value"
                dot={{ fill: '#38BDF8', r: 4 }}
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
