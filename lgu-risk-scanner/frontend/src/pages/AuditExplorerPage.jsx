import { useMemo, useState } from 'react'
import AiRiskExplainer from '../components/analysis/AiRiskExplainer'
import InfoBanner from '../components/common/InfoBanner'
import PageHeader from '../components/common/PageHeader'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useRiskData } from '../hooks/useRiskData'

const severityColors = {
  Critical: '#DC2626',
  High: '#EA580C',
  Medium: '#EAB308',
  Low: '#16A34A',
}

function AuditExplorerPage() {
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' })
  const [severityFilter, setSeverityFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const { loading, error, auditRows } = useRiskData()

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(auditRows.map((row) => row.category).filter(Boolean))).sort()],
    [auditRows]
  )

  const filteredLogs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return auditRows.filter((log) => {
      const matchesSeverity = severityFilter === 'All' || log.riskLevel === severityFilter
      const matchesCategory = categoryFilter === 'All' || log.category === categoryFilter
      const haystack = `${log.city} ${log.action} ${log.details} ${log.category} ${log.relatedReference}`.toLowerCase()
      return matchesSeverity && matchesCategory && (!normalizedQuery || haystack.includes(normalizedQuery))
    })
  }, [auditRows, categoryFilter, query, severityFilter])

  const sortedLogs = useMemo(() => {
    return [...filteredLogs].sort((a, b) => {
      const aVal = a[sortConfig.key]
      const bVal = b[sortConfig.key]

      if (typeof aVal === 'string') {
        return sortConfig.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }

      return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal
    })
  }, [filteredLogs, sortConfig])

  const selectedLog = sortedLogs.find((log) => log.logId === selectedId) || sortedLogs[0]

  const stats = useMemo(() => {
    const totalAmount = filteredLogs.reduce((sum, log) => sum + Number(log.amount || 0), 0)
    const highRisk = filteredLogs.filter((log) => log.riskLevel === 'High' || log.riskLevel === 'Critical').length
    const topCategory = Object.entries(
      filteredLogs.reduce((acc, log) => {
        acc[log.category] = (acc[log.category] || 0) + 1
        return acc
      }, {})
    ).sort((a, b) => b[1] - a[1])[0]

    return { totalAmount, highRisk, topCategory }
  }, [filteredLogs])

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    })
  }

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <PageHeader
          title="Audit Explorer"
          description="Investigate COA-pattern audit findings, red flags, and recommended follow-up actions."
        />

        <InfoBanner text="This view uses synthetic mock findings patterned after common audit observations. It is for risk-scoring demos, not a claim that an LGU has an official adverse COA finding." />

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-[#1E293B]/70 shadow-sm">
            Loading live backend data...
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-4">
              {[
                ['Visible Findings', filteredLogs.length, 'border-[#2563EB]'],
                ['High Severity', stats.highRisk, 'border-red-500'],
                ['Amount Reviewed', `PHP ${(stats.totalAmount / 1000000).toFixed(1)}M`, 'border-amber-500'],
                ['Top Category', stats.topCategory?.[0] || 'None', 'border-[#38BDF8]'],
              ].map(([label, value, border]) => (
                <div key={label} className={`rounded-xl border border-slate-200 border-l-4 ${border} bg-white p-5 shadow-sm shadow-slate-200/80`}>
                  <p className="text-sm font-medium text-[#1E293B]/65">{label}</p>
                  <p className="mt-2 truncate text-2xl font-bold text-[#0F172A]">{value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/80">
                <div className="grid gap-3 border-b border-slate-200 bg-[#F8FAFC] p-4 lg:grid-cols-[1fr_180px_220px]">
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search LGU, reference, category, or finding"
                    className="rounded border border-slate-200 bg-white px-3 py-2 text-sm text-[#1E293B] outline-none placeholder:text-[#1E293B]/35 focus:border-[#2563EB]"
                  />
                  <select
                    value={severityFilter}
                    onChange={(event) => setSeverityFilter(event.target.value)}
                    className="rounded border border-slate-200 bg-white px-3 py-2 text-sm text-[#1E293B] outline-none focus:border-[#2563EB]"
                  >
                    {['All', 'High', 'Medium', 'Low'].map((level) => (
                      <option key={level} value={level}>{level} severity</option>
                    ))}
                  </select>
                  <select
                    value={categoryFilter}
                    onChange={(event) => setCategoryFilter(event.target.value)}
                    className="rounded border border-slate-200 bg-white px-3 py-2 text-sm text-[#1E293B] outline-none focus:border-[#2563EB]"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[820px]">
                    <thead className="border-b border-slate-200 bg-[#F8FAFC]">
                      <tr>
                        {[
                          ['riskLevel', 'Severity'],
                          ['city', 'LGU'],
                          ['category', 'Category'],
                          ['action', 'Finding Type'],
                          ['amount', 'Amount'],
                        ].map(([key, label]) => (
                          <th
                            key={key}
                            className="cursor-pointer px-5 py-3 text-left text-sm font-semibold text-[#1E293B]/70 hover:bg-slate-100"
                            onClick={() => handleSort(key)}
                          >
                            {label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sortedLogs.map((log) => (
                        <tr
                          key={log.logId}
                          onClick={() => setSelectedId(log.logId)}
                          className={`cursor-pointer text-sm text-[#1E293B]/75 transition hover:bg-[#F8FAFC] ${
                            selectedLog?.logId === log.logId ? 'bg-[#38BDF8]/10' : ''
                          }`}
                        >
                          <td className="px-5 py-4">
                            <span
                              className="rounded-full px-3 py-1 text-xs font-medium text-white"
                              style={{ backgroundColor: severityColors[log.riskLevel] || '#64748B' }}
                            >
                              {log.riskLevel}
                            </span>
                          </td>
                          <td className="px-5 py-4 font-semibold text-[#0F172A]">{log.city}</td>
                          <td className="px-5 py-4">{log.category}</td>
                          <td className="px-5 py-4">{log.action.replaceAll('_', ' ')}</td>
                          <td className="px-5 py-4">PHP {(Number(log.amount || 0) / 1000000).toFixed(2)}M</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <aside className="grid content-start gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/80">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#2563EB]">Selected finding</p>
                  <h2 className="mt-2 text-lg font-semibold text-[#0F172A]">{selectedLog?.city || 'No finding selected'}</h2>
                  <p className="mt-3 text-sm leading-6 text-[#1E293B]/75">{selectedLog?.details}</p>
                  {selectedLog?.recommendation && (
                    <div className="mt-4 rounded-lg bg-[#F8FAFC] p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2563EB]">Recommended action</p>
                      <p className="mt-2 text-sm leading-5 text-[#1E293B]/75">{selectedLog.recommendation}</p>
                    </div>
                  )}
                  {selectedLog?.coaPattern && (
                    <p className="mt-4 text-xs leading-5 text-[#1E293B]/55">Audit pattern: {selectedLog.coaPattern}</p>
                  )}
                </div>

                <AiRiskExplainer item={selectedLog} />
              </aside>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

export default AuditExplorerPage
