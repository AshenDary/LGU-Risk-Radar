import { useMemo, useState } from 'react'
import AiRiskExplainer from '../components/analysis/AiRiskExplainer'
import DashboardLayout from '../components/layout/DashboardLayout'
import DropdownSelect from '../components/ui/DropdownSelect'
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
  const [showAllFindings, setShowAllFindings] = useState(false)
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
  const visibleLogs = showAllFindings ? sortedLogs : sortedLogs.slice(0, 5)

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
    <DashboardLayout
      title="Audit Explorer"
      description="Investigate COA-pattern audit findings, red flags, and recommended follow-up actions."
    >
      <div className="grid gap-8">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="premium-card reveal-on-scroll rounded-lg p-8 text-sm text-[#1E293B]/70">
            Loading live backend data...
          </div>
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <div className="premium-card premium-hover reveal-on-scroll rounded-2xl p-6 sm:p-7">
                <p className="text-base font-semibold text-[#2563EB]">Visible Findings</p>
                <p className="mt-4 text-4xl font-extrabold tracking-tight text-[#0F172A]">{filteredLogs.length}</p>
              </div>
              <div className="premium-card premium-hover reveal-on-scroll rounded-2xl p-6 sm:p-7">
                <p className="text-base font-semibold text-[#2563EB]">High Severity</p>
                <p className="mt-4 text-4xl font-extrabold tracking-tight text-red-600">{stats.highRisk}</p>
              </div>
              <div className="premium-card premium-hover reveal-on-scroll rounded-2xl p-6 sm:p-7">
                <p className="text-base font-semibold text-[#2563EB]">Amount Reviewed</p>
                <p className="mt-4 text-3xl font-extrabold tracking-tight text-[#0F172A]">PHP {(stats.totalAmount / 1000000).toFixed(1)}M</p>
              </div>
              <div className="premium-card premium-hover reveal-on-scroll rounded-2xl p-6 sm:p-7">
                <p className="text-base font-semibold text-[#2563EB]">Top Category</p>
                <p className="mt-4 truncate text-2xl font-extrabold text-[#0F172A]">{stats.topCategory?.[0] || 'None'}</p>
              </div>
            </div>

            <div className="grid min-w-0 items-start gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(340px,400px)]">
              <div className="dropdown-card premium-card premium-hover reveal-on-scroll relative rounded-3xl border border-[#38BDF8]/35 bg-white shadow-2xl shadow-[#2563EB]/12">
                <div className="relative z-20 border-b border-[#38BDF8]/20 px-6 py-5 sm:px-8 sm:py-6">
                  <div className="mb-5 max-w-2xl">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">Audit findings</p>
                    <h2 className="mt-2 text-3xl font-black leading-tight text-[#0F172A]">Audit Explorer</h2>
                    <p className="mt-2 text-sm font-medium leading-6 text-[#2563EB]">Filter, sort, and inspect audit records that may need follow-up.</p>
                  </div>
                  <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_220px]">
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search LGU, reference, category, or finding"
                      className="min-h-11 rounded-2xl border border-[#38BDF8]/35 bg-white px-4 py-2 text-sm font-medium text-[#0F172A] shadow-sm outline-none placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-4 focus:ring-[#38BDF8]/15"
                    />
                    <DropdownSelect
                      value={severityFilter}
                      options={['All', 'High', 'Medium', 'Low']}
                      onChange={setSeverityFilter}
                      getOptionLabel={(option) => (option === 'All' ? 'All severity' : option)}
                    />
                    <DropdownSelect
                      value={categoryFilter}
                      options={categories}
                      onChange={setCategoryFilter}
                    />
                  </div>
                </div>

                <div className="dashboard-scrollbar overflow-x-auto px-4 pb-5 sm:px-5">
                  <table className="min-w-[760px] table-fixed">
                    <colgroup>
                      <col className="w-[16%]" />
                      <col className="w-[20%]" />
                      <col className="w-[22%]" />
                      <col className="w-[24%]" />
                      <col className="w-[18%]" />
                    </colgroup>
                    <thead className="border-b border-[#38BDF8]/18 bg-transparent">
                      <tr className="text-xs uppercase tracking-[0.14em] text-slate-600">
                        {[
                          ['riskLevel', 'Severity'],
                          ['city', 'LGU'],
                          ['category', 'Category'],
                          ['action', 'Finding Type'],
                          ['amount', 'Amount'],
                        ].map(([key, label]) => (
                          <th
                            key={key}
                            className="cursor-pointer px-3 py-4 text-left font-black hover:bg-[#EFF6FF] sm:px-4"
                            onClick={() => handleSort(key)}
                          >
                            {label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {visibleLogs.map((log) => (
                        <tr
                          key={log.logId}
                          onClick={() => setSelectedId(log.logId)}
                          className="group cursor-pointer text-sm transition"
                        >
                          <td className={`rounded-l-2xl px-3 py-5 transition group-hover:bg-[#F8FAFC] sm:px-4 ${selectedLog?.logId === log.logId ? 'bg-[#EFF6FF]' : ''}`}>
                            <span
                              className="rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm"
                              style={{ backgroundColor: severityColors[log.riskLevel] || '#666' }}
                            >
                              {log.riskLevel}
                            </span>
                          </td>
                          <td className={`break-words px-3 py-5 font-semibold leading-5 text-[#0F172A] transition group-hover:bg-[#F8FAFC] sm:px-4 ${selectedLog?.logId === log.logId ? 'bg-[#EFF6FF]' : ''}`}>{log.city}</td>
                          <td className={`break-words px-3 py-5 leading-5 text-slate-700 transition group-hover:bg-[#F8FAFC] sm:px-4 ${selectedLog?.logId === log.logId ? 'bg-[#EFF6FF]' : ''}`}>{log.category}</td>
                          <td className={`break-words px-3 py-5 capitalize leading-5 text-slate-700 transition group-hover:bg-[#F8FAFC] sm:px-4 ${selectedLog?.logId === log.logId ? 'bg-[#EFF6FF]' : ''}`}>{log.action.replaceAll('_', ' ')}</td>
                          <td className={`rounded-r-2xl px-3 py-5 font-semibold leading-5 text-slate-700 transition group-hover:bg-[#F8FAFC] sm:px-4 ${selectedLog?.logId === log.logId ? 'bg-[#EFF6FF]' : ''}`}>PHP {(Number(log.amount || 0) / 1000000).toFixed(2)}M</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {sortedLogs.length > 5 ? (
                    <div className="mt-5 flex justify-center">
                      <button
                        type="button"
                        onClick={() => setShowAllFindings((current) => !current)}
                        className="rounded-full border border-[#38BDF8]/45 bg-white px-5 py-2 text-sm font-bold text-[#2563EB] shadow-sm shadow-[#2563EB]/10 transition hover:border-[#2563EB]/55 hover:bg-[#EFF6FF]"
                      >
                        {showAllFindings ? 'Show less' : `See more (${sortedLogs.length - 5})`}
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>

              <aside className="grid min-w-0 content-start gap-4">
                <div className="premium-card premium-hover reveal-on-scroll rounded-3xl p-5 sm:p-6">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">Selected finding</p>
                  <h2 className="mt-1.5 text-xl font-black leading-tight text-[#0F172A]">{selectedLog?.city || 'No finding selected'}</h2>
                  <p className="mt-2 text-xs font-medium leading-5 text-slate-700">{selectedLog?.details}</p>
                  {selectedLog?.recommendation && (
                    <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3">
                      <p className="text-[11px] font-black uppercase tracking-[0.12em] text-red-700">Recommended action</p>
                      <p className="mt-1.5 text-xs font-semibold leading-5 text-red-700">{selectedLog.recommendation}</p>
                    </div>
                  )}
                  {selectedLog?.coaPattern && (
                    <p className="mt-3 text-[11px] font-medium leading-5 text-[#475569]">Audit pattern: {selectedLog.coaPattern}</p>
                  )}
                </div>
              </aside>
            </div>

            <AiRiskExplainer item={selectedLog} />
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

export default AuditExplorerPage
