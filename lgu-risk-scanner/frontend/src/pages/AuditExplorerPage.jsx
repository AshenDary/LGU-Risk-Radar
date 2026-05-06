import { useState } from 'react'
import InfoBanner from '../components/common/InfoBanner'
import PageHeader from '../components/common/PageHeader'
import DashboardLayout from '../components/layout/DashboardLayout'
import { auditLogs } from '../data/mockData'

function AuditExplorerPage() {
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' })

  const getRiskLevelColor = (riskLevel) => {
    const colors = {
      Critical: '#dc2626',
      High: '#ea580c',
      Medium: '#eab308',
      Low: '#16a34a',
    }
    return colors[riskLevel] || '#666'
  }

  // Calculate audit statistics
  const totalActivity = auditLogs.length

  const cityCount = auditLogs.reduce((acc, log) => {
    acc[log.city] = (acc[log.city] || 0) + 1
    return acc
  }, {})
  const mostActiveLGU = Object.entries(cityCount).sort((a, b) => b[1] - a[1])[0]

  const actionCount = auditLogs.reduce((acc, log) => {
    acc[log.action] = (acc[log.action] || 0) + 1
    return acc
  }, {})
  const commonLog = Object.entries(actionCount).sort((a, b) => b[1] - a[1])[0]

  const highRiskChanges = auditLogs.filter(
    (log) => log.riskLevel === 'Critical' || log.riskLevel === 'High'
  ).length

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    })
  }

  const sortedLogs = [...auditLogs].sort((a, b) => {
    const aVal = a[sortConfig.key]
    const bVal = b[sortConfig.key]

    if (typeof aVal === 'string') {
      return sortConfig.direction === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    }

    return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal
  })

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <PageHeader
          title="Audit Explorer"
          description="Explore audit findings and related LGU risk indicators."
        />

        <InfoBanner text="This section provides detailed audit findings for each LGU, including repeated issues, anomalies, and compliance gaps. It supports deeper investigation into the causes of high risk scores." />

        <div className="grid gap-4 md:grid-cols-4">
          {/* Total Activity Card */}
          <div className="bg-[#0a2240] rounded-lg shadow p-6 border-l-4 border-blue-500">
            <p className="text-sm text-gray-300 font-medium">Total Activity</p>
            <p className="text-3xl font-bold text-white mt-2">{totalActivity}</p>
            <p className="text-xs text-gray-400 mt-2">Audit log entries</p>
          </div>

          {/* Most Active LGU Card */}
          <div className="bg-[#0a2240] rounded-lg shadow p-6 border-l-4 border-purple-500">
            <p className="text-sm text-gray-300 font-medium">Most Active LGU</p>
            <p className="text-2xl font-bold text-white mt-2">{mostActiveLGU[0]}</p>
            <p className="text-xs text-gray-400 mt-2">{mostActiveLGU[1]} activities</p>
          </div>

          {/* Common Logs Card */}
          <div className="bg-[#0a2240] rounded-lg shadow p-6 border-l-4 border-amber-500">
            <p className="text-sm text-gray-300 font-medium">Common Logs</p>
            <p className="text-lg font-bold text-white mt-2 truncate">{commonLog[0]}</p>
            <p className="text-xs text-gray-400 mt-2">{commonLog[1]} occurrences</p>
          </div>

          {/* High Risk Changes Card */}
          <div className="bg-[#0a2240] rounded-lg shadow p-6 border-l-4 border-red-500">
            <p className="text-sm text-gray-300 font-medium">High Risk Changes</p>
            <p className="text-3xl font-bold text-red-400 mt-2">{highRiskChanges}</p>
            <p className="text-xs text-gray-400 mt-2">Critical & High risk</p>
          </div>
        </div>

        <div className="bg-[#0f2e47] rounded-lg shadow overflow-hidden border border-[#1a3a52]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0a2240] border-b border-[#1a3a52]">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-200 cursor-pointer hover:bg-[#142d45]"
                    onClick={() => handleSort('timestamp')}
                  >
                    <div className="flex items-center gap-2">
                      Timestamp
                      {sortConfig.key === 'timestamp' && (
                        <span className="text-xs">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-200 cursor-pointer hover:bg-[#142d45]"
                    onClick={() => handleSort('logId')}
                  >
                    <div className="flex items-center gap-2">
                      Log ID
                      {sortConfig.key === 'logId' && (
                        <span className="text-xs">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-200 cursor-pointer hover:bg-[#142d45]"
                    onClick={() => handleSort('city')}
                  >
                    <div className="flex items-center gap-2">
                      City
                      {sortConfig.key === 'city' && (
                        <span className="text-xs">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-200 cursor-pointer hover:bg-[#142d45]"
                    onClick={() => handleSort('action')}
                  >
                    <div className="flex items-center gap-2">
                      Action
                      {sortConfig.key === 'action' && (
                        <span className="text-xs">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Details</th>
                </tr>
              </thead>
              <tbody>
                {sortedLogs.map((log) => (
                  <tr key={log.logId} className="border-b border-[#1a3a52] hover:bg-[#0a2240]">
                    <td className="px-6 py-4 text-sm text-gray-300">{log.timestamp}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-100">{log.logId}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{log.city}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className="px-3 py-1 rounded-full text-white text-xs font-medium"
                        style={{ backgroundColor: getRiskLevelColor(log.riskLevel) }}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300 max-w-md">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-[#0a2240] border-t border-[#1a3a52]">
            <p className="text-sm text-gray-300">Showing {sortedLogs.length} audit entries</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AuditExplorerPage
