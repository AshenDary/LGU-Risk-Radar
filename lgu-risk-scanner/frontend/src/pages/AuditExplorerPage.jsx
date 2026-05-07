import { useMemo, useState } from 'react'
import AiRiskExplainer from '../components/analysis/AiRiskExplainer'
import InfoBanner from '../components/common/InfoBanner'
import PageHeader from '../components/common/PageHeader'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useRiskData } from '../hooks/useRiskData'

const severityColors = {
  Critical: '#dc2626',
  High: '#ea580c',
  Medium: '#eab308',
  Low: '#16a34a',
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
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-lg border border-cyan-200/10 bg-[#0f2e47] p-6 text-sm text-cyan-50/70">
            Loading live backend data...
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-lg border-l-4 border-blue-500 bg-[#0a2240] p-5">
                <p className="text-sm font-medium text-gray-300">Visible Findings</p>
                <p className="mt-2 text-3xl font-bold text-white">{filteredLogs.length}</p>
              </div>
              <div className="rounded-lg border-l-4 border-red-500 bg-[#0a2240] p-5">
                <p className="text-sm font-medium text-gray-300">High Severity</p>
                <p className="mt-2 text-3xl font-bold text-red-300">{stats.highRisk}</p>
              </div>
              <div className="rounded-lg border-l-4 border-amber-500 bg-[#0a2240] p-5">
                <p className="text-sm font-medium text-gray-300">Amount Reviewed</p>
                <p className="mt-2 text-2xl font-bold text-white">PHP {(stats.totalAmount / 1000000).toFixed(1)}M</p>
              </div>
              <div className="rounded-lg border-l-4 border-cyan-500 bg-[#0a2240] p-5">
                <p className="text-sm font-medium text-gray-300">Top Category</p>
                <p className="mt-2 truncate text-xl font-bold text-white">{stats.topCategory?.[0] || 'None'}</p>
              </div>
            </div>

            <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,380px)]">
              <div className="rounded-lg border border-[#1a3a52] bg-[#0f2e47]">
                <div className="grid gap-3 border-b border-[#1a3a52] bg-[#0a2240] p-4 lg:grid-cols-[1fr_180px_220px]">
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search LGU, reference, category, or finding"
                    className="rounded border border-[#1a3a52] bg-[#061a2b] px-3 py-2 text-sm text-white outline-none placeholder:text-cyan-50/35"
                  />
                  <select
                    value={severityFilter}
                    onChange={(event) => setSeverityFilter(event.target.value)}
                    className="rounded border border-[#1a3a52] bg-[#061a2b] px-3 py-2 text-sm text-white outline-none"
                  >
                    {['All', 'High', 'Medium', 'Low'].map((level) => (
                      <option key={level} value={level}>{level} severity</option>
                    ))}
                  </select>
                  <select
                    value={categoryFilter}
                    onChange={(event) => setCategoryFilter(event.target.value)}
                    className="rounded border border-[#1a3a52] bg-[#061a2b] px-3 py-2 text-sm text-white outline-none"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[820px]">
                    <thead className="border-b border-[#1a3a52] bg-[#0a2240]">
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
                            className="cursor-pointer px-5 py-3 text-left text-sm font-semibold text-gray-200 hover:bg-[#142d45]"
                            onClick={() => handleSort(key)}
                          >
                            {label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a3a52]">
                      {sortedLogs.map((log) => (
                        <tr
                          key={log.logId}
                          onClick={() => setSelectedId(log.logId)}
                          className={`cursor-pointer text-sm transition hover:bg-[#0a2240] ${
                            selectedLog?.logId === log.logId ? 'bg-cyan-400/10' : ''
                          }`}
                        >
                          <td className="px-5 py-4">
                            <span
                              className="rounded-full px-3 py-1 text-xs font-medium text-white"
                              style={{ backgroundColor: severityColors[log.riskLevel] || '#666' }}
                            >
                              {log.riskLevel}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-gray-200">{log.city}</td>
                          <td className="px-5 py-4 text-gray-300">{log.category}</td>
                          <td className="px-5 py-4 text-gray-300">{log.action.replaceAll('_', ' ')}</td>
                          <td className="px-5 py-4 text-gray-300">PHP {(Number(log.amount || 0) / 1000000).toFixed(2)}M</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <aside className="grid min-w-0 content-start gap-4">
                <div className="rounded-lg border border-[#1a3a52] bg-[#0f2e47] p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/60">Selected finding</p>
                  <h2 className="mt-2 text-lg font-semibold text-white">{selectedLog?.city || 'No finding selected'}</h2>
                  <p className="mt-3 text-sm leading-6 text-cyan-50/70">{selectedLog?.details}</p>
                  {selectedLog?.recommendation && (
                    <div className="mt-4 rounded-md bg-[#061a2b] p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200/60">Recommended action</p>
                      <p className="mt-2 text-sm leading-5 text-cyan-50/75">{selectedLog.recommendation}</p>
                    </div>
                  )}
                  {selectedLog?.coaPattern && (
                    <p className="mt-4 text-xs leading-5 text-cyan-50/50">Audit pattern: {selectedLog.coaPattern}</p>
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
