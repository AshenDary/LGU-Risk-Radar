import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import DropdownSelect from '../ui/DropdownSelect'

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
  const selectedLabel = selectedLgu === 'all' ? 'All LGUs' : selectedName

  const getRiskColor = (score) => {
    if (score >= 75) return '#dc2626'
    if (score >= 40) return '#eab308'
    return '#16a34a'
  }

  return (
    <div className="grid gap-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="premium-card premium-hover reveal-on-scroll rounded-2xl p-6 sm:p-7">
          <div className="mb-2 text-sm font-semibold text-[#2563EB]">Average Risk Score</div>
          <div className="text-3xl font-extrabold tracking-tight text-[#0F172A]">{avgScore}</div>
          <div className="mt-2 text-xs font-medium text-[#475569]">Across live LGU records</div>
        </div>

        <div className="premium-card premium-hover reveal-on-scroll rounded-2xl p-6 sm:p-7">
          <div className="mb-2 text-sm font-semibold text-[#2563EB]">Highest Risk LGU</div>
          <div className="text-lg font-bold text-[#0F172A]">{riskExtremes.highest.name}</div>
          <div className="mt-2 text-2xl font-extrabold" style={{ color: getRiskColor(riskExtremes.highest.score) }}>
            {riskExtremes.highest.score.toFixed(2)}
          </div>
        </div>

        <div className="premium-card premium-hover reveal-on-scroll rounded-2xl p-6 sm:p-7">
          <div className="mb-2 text-sm font-semibold text-[#2563EB]">Lowest Risk LGU</div>
          <div className="text-lg font-bold text-[#0F172A]">{riskExtremes.lowest.name}</div>
          <div className="mt-2 text-2xl font-extrabold" style={{ color: getRiskColor(riskExtremes.lowest.score) }}>
            {riskExtremes.lowest.score.toFixed(2)}
          </div>
        </div>

        <div className="premium-card premium-hover reveal-on-scroll rounded-2xl p-6 sm:p-7">
          <div className="mb-2 text-sm font-semibold text-[#2563EB]">Total Procurement Value</div>
          <div className="text-2xl font-extrabold tracking-tight text-[#0F172A]">PHP {(totalProcurement / 1000000).toFixed(1)}M</div>
          <div className="mt-2 text-xs font-medium text-[#475569]">{selectedLgu === 'all' ? 'All LGUs' : 'Selected LGU'}</div>
        </div>
      </div>

      <div className="dropdown-card procurement-exposure-card premium-card premium-hover reveal-on-scroll relative overflow-hidden rounded-3xl border border-[#38BDF8]/35 bg-white shadow-2xl shadow-[#2563EB]/12">
        <div className="relative z-20 border-b border-[#38BDF8]/20 bg-gradient-to-r from-[#F8FAFC] via-white to-[#EFF6FF] px-8 py-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">Procurement</p>
              <h3 className="mt-2 text-3xl font-black leading-tight text-[#0F172A]">Procurement Exposure</h3>
              <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-[#2563EB]">
                {selectedLgu === 'all'
                  ? 'Compare total procurement value across LGUs.'
                  : `Review individual procurement values for ${selectedName}.`}
              </p>
            </div>
            <DropdownSelect
              value={selectedLgu}
              options={[{ id: 'all', name: 'All LGUs' }, ...rows]}
              onChange={setSelectedLgu}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
              placeholder={selectedLabel}
              className="w-full md:w-72"
            />
          </div>
        </div>

        <div className="p-7 sm:p-9">
          {chartData.length > 0 ? (
            <ResponsiveContainer className="risk-overview-chart" width="100%" height={320}>
              <BarChart data={chartData} margin={{ top: 12, right: 16, left: 8, bottom: 18 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DBEAFE" />
                <XAxis
                  dataKey="name"
                  stroke="#64748B"
                  angle={0}
                  textAnchor="middle"
                  interval={0}
                  height={44}
                  tick={{ fontSize: 11 }}
                />
                <YAxis stroke="#64748B" tick={{ fontSize: 11 }} label={{ value: 'PHP Millions', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #BAE6FD', borderRadius: '12px', color: '#0F172A' }}
                  labelStyle={{ color: '#0F172A' }}
                  formatter={(value) => [`PHP ${value}M`, 'Value']}
                />
                <Bar dataKey="value" name="Procurement Value" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="grid h-72 place-items-center rounded-2xl border border-[#38BDF8]/30 bg-[#EFF6FF] p-6 text-center text-sm font-medium text-[#2563EB]">
              No procurement records found for {selectedName}.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RiskOverview
